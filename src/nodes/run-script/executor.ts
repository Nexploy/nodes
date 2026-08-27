import { getFromAllOutputs, getFromInputs } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createDockerService } from '@nexploy/nodes/core/dockerService';
import { resolveComposeEnvVars, resolveComposeLabels } from '@nexploy/nodes/core/composeContext';
import { runScriptConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { safeResolvePath } from '@nexploy/shared/pathSafety';
import { z } from 'zod';

const MAX_CAPTURED_OUTPUT = 256 * 1024;

function resolveWorkspaceOwner(): { uid: number; gid: number } | undefined {
    const uid = process.getuid?.();
    const gid = process.getgid?.();

    return uid === undefined || gid === undefined ? undefined : { uid, gid };
}

export class RunScriptExecutor implements INodeExecutor {
    readonly type = 'run-script';
    readonly configSchema = runScriptConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof runScriptConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeId, nodeConfig, inputOutputs, allOutputs, logger, abortSignal, reporter, services } = ctx;
        const dockerService = createDockerService(services.docker);

        const workDir =
            getFromInputs<string>(inputOutputs, 'workDir') ?? getFromAllOutputs<string>(allOutputs, 'workDir');

        if (!workDir) {
            throw new Error('No workDir found — connect this node after a Clone Repository node');
        }

        const command = nodeConfig.command.trim();

        if (!command) {
            throw new Error('No command configured');
        }

        const image = nodeConfig.image.trim();

        if (!image) {
            throw new Error('No image configured');
        }

        const relativeDirectory = nodeConfig.workingDirectory.trim();
        const cwd = relativeDirectory ? safeResolvePath(workDir, relativeDirectory) : workDir;
        const envVars = await resolveComposeEnvVars(ctx);
        const labels = resolveComposeLabels(ctx);

        await logger.info(nodeId, `Running "${command}" in ${relativeDirectory || '.'} using ${image}`);

        await reporter.reportProgress(nodeId, {
            current: 0,
            total: 1,
            labelKey: 'running',
            labelValues: { directory: relativeDirectory || '.', image },
        });

        let stdout = '';
        let lastLine = '';

        const onLog = async (message: string) => {
            if (stdout.length < MAX_CAPTURED_OUTPUT) stdout += `${message}\n`;
            lastLine = message;
            await logger.info(nodeId, message);
        };

        const result = await dockerService.runScript(
            workDir,
            image,
            command,
            cwd,
            envVars,
            nodeConfig.timeoutSeconds,
            abortSignal,
            onLog,
            labels,
            resolveWorkspaceOwner(),
        );

        await reporter.reportProgress(nodeId, {
            current: 1,
            total: 1,
            labelKey: 'running',
            labelValues: { directory: relativeDirectory || '.', image },
        });

        if (result.timedOut) {
            const message = `Command timed out after ${nodeConfig.timeoutSeconds}s`;

            if (!nodeConfig.continueOnError) throw new Error(message);

            await reporter.reportSummary(nodeId, {
                key: 'timedOut',
                values: { timeout: nodeConfig.timeoutSeconds },
                tone: 'warning',
            });

            return { output: { stdout, exitCode: result.exitCode, failed: true } };
        }

        if (result.exitCode !== 0) {
            const message = lastLine.trim() || `Command exited with code ${result.exitCode}`;

            if (!nodeConfig.continueOnError) {
                throw new Error(`Command failed with exit code ${result.exitCode}: ${message}`);
            }

            await reporter.reportSummary(nodeId, {
                key: 'failedButContinued',
                values: { exitCode: result.exitCode },
                tone: 'warning',
            });

            return { output: { stdout, exitCode: result.exitCode, failed: true } };
        }

        await reporter.reportSummary(nodeId, {
            key: 'succeeded',
            values: { directory: relativeDirectory || '.' },
            tone: 'positive',
        });

        return { output: { stdout, exitCode: result.exitCode, failed: false } };
    }
}

export const runScriptExecutor = new RunScriptExecutor();
