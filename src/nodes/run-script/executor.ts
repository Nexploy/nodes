import { spawn } from 'node:child_process';
import { getFromAllOutputs, getFromInputs } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { runScriptConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { safeResolvePath } from '@nexploy/shared/pathSafety';
import { z } from 'zod';

interface ScriptResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    timedOut: boolean;
}

const MAX_CAPTURED_OUTPUT = 256 * 1024;

function runShellCommand(
    command: string,
    cwd: string,
    timeoutMs: number,
    signal: AbortSignal,
    onLine: (line: string) => void,
): Promise<ScriptResult> {
    return new Promise((resolve, reject) => {
        const proc = spawn('/bin/sh', ['-c', command], {
            cwd,
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            proc.kill('SIGKILL');
        }, timeoutMs);

        const abort = () => proc.kill('SIGTERM');
        signal.addEventListener('abort', abort, { once: true });

        const capture = (chunk: Buffer, isError: boolean) => {
            const text = chunk.toString();

            if (isError) {
                if (stderr.length < MAX_CAPTURED_OUTPUT) stderr += text;
            } else if (stdout.length < MAX_CAPTURED_OUTPUT) {
                stdout += text;
            }

            for (const line of text.split('\n')) {
                const trimmed = line.trimEnd();
                if (trimmed) onLine(trimmed);
            }
        };

        proc.stdout.on('data', (chunk: Buffer) => capture(chunk, false));
        proc.stderr.on('data', (chunk: Buffer) => capture(chunk, true));

        const cleanup = () => {
            clearTimeout(timer);
            signal.removeEventListener('abort', abort);
        };

        proc.on('error', (error) => {
            cleanup();
            reject(error);
        });

        proc.on('close', (code) => {
            cleanup();
            resolve({ stdout, stderr, exitCode: code ?? -1, timedOut });
        });
    });
}

export class RunScriptExecutor implements INodeExecutor {
    readonly type = 'run-script';
    readonly configSchema = runScriptConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof runScriptConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeId, nodeConfig, inputOutputs, allOutputs, logger, abortSignal, reporter } = ctx;

        const workDir =
            getFromInputs<string>(inputOutputs, 'workDir') ?? getFromAllOutputs<string>(allOutputs, 'workDir');

        if (!workDir) {
            throw new Error('No workDir found — connect this node after a Clone Repository node');
        }

        const command = nodeConfig.command.trim();

        if (!command) {
            throw new Error('No command configured');
        }

        const relativeDirectory = nodeConfig.workingDirectory.trim();
        const cwd = relativeDirectory ? safeResolvePath(workDir, relativeDirectory) : workDir;
        const timeoutMs = nodeConfig.timeoutSeconds * 1000;

        await logger.info(nodeId, `Running "${command}" in ${relativeDirectory || '.'}`);

        await reporter.reportProgress(nodeId, {
            current: 0,
            total: 1,
            labelKey: 'running',
            labelValues: { directory: relativeDirectory || '.' },
        });

        const result = await runShellCommand(command, cwd, timeoutMs, abortSignal, (line) => {
            void logger.info(nodeId, line);
        });

        await reporter.reportProgress(nodeId, {
            current: 1,
            total: 1,
            labelKey: 'running',
            labelValues: { directory: relativeDirectory || '.' },
        });

        if (result.timedOut) {
            const message = `Command timed out after ${nodeConfig.timeoutSeconds}s`;

            if (!nodeConfig.continueOnError) throw new Error(message);

            await reporter.reportSummary(nodeId, {
                key: 'timedOut',
                values: { timeout: nodeConfig.timeoutSeconds },
                tone: 'warning',
            });

            return { output: { stdout: result.stdout, exitCode: result.exitCode, failed: true } };
        }

        if (result.exitCode !== 0) {
            const message = result.stderr.trim().split('\n').pop() ?? `Command exited with code ${result.exitCode}`;

            if (!nodeConfig.continueOnError) {
                throw new Error(`Command failed with exit code ${result.exitCode}: ${message}`);
            }

            await logger.warn(nodeId, `Command failed with exit code ${result.exitCode}, continuing`);

            await reporter.reportSummary(nodeId, {
                key: 'failedButContinued',
                values: { exitCode: result.exitCode },
                tone: 'warning',
            });

            return { output: { stdout: result.stdout, exitCode: result.exitCode, failed: true } };
        }

        await reporter.reportSummary(nodeId, {
            key: 'succeeded',
            values: { directory: relativeDirectory || '.' },
            tone: 'positive',
        });

        return { output: { stdout: result.stdout, exitCode: result.exitCode, failed: false } };
    }
}

export const runScriptExecutor = new RunScriptExecutor();
