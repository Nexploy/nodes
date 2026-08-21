import { spawn } from 'node:child_process';
import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { resolveLatestTagConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { z } from 'zod';

interface RemoteTag {
    name: string;
    commitHash: string;
}

const PRERELEASE_PATTERN = /-/;

function patternToRegExp(pattern: string): RegExp {
    const escaped = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');

    return new RegExp(`^${escaped}$`);
}

function versionSegments(tag: string): number[] {
    const digits = tag.match(/\d+/g) ?? [];
    return digits.map((segment) => Number.parseInt(segment, 10));
}

function compareVersions(left: string, right: string): number {
    const leftSegments = versionSegments(left);
    const rightSegments = versionSegments(right);
    const length = Math.max(leftSegments.length, rightSegments.length);

    for (let index = 0; index < length; index += 1) {
        const difference = (rightSegments[index] ?? 0) - (leftSegments[index] ?? 0);
        if (difference !== 0) return difference;
    }

    return right.localeCompare(left);
}

function listRemoteTags(repoUrl: string, signal: AbortSignal): Promise<RemoteTag[]> {
    return new Promise((resolve, reject) => {
        const proc = spawn('git', ['ls-remote', '--tags', '--refs', repoUrl], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        const abort = () => proc.kill('SIGTERM');
        signal.addEventListener('abort', abort, { once: true });

        proc.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        proc.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        proc.on('error', (error) => {
            signal.removeEventListener('abort', abort);
            reject(error);
        });

        proc.on('close', (code) => {
            signal.removeEventListener('abort', abort);

            if (code !== 0) {
                reject(new Error(stderr.trim() || `git ls-remote exited with code ${code}`));
                return;
            }

            const tags = stdout
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const [commitHash, ref] = line.split(/\s+/);
                    return { commitHash: commitHash ?? '', name: (ref ?? '').replace('refs/tags/', '') };
                })
                .filter((tag) => tag.name && tag.commitHash);

            resolve(tags);
        });
    });
}

export class ResolveLatestTagExecutor implements INodeExecutor {
    readonly type = 'resolve-latest-tag';
    readonly configSchema = resolveLatestTagConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof resolveLatestTagConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeId, nodeConfig, allOutputs, edges, buildConfig, logger, abortSignal, reporter } = ctx;

        const repoUrl =
            nodeConfig.repoUrl.trim() ||
            getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'repoUrl') ||
            buildConfig.gitUrl;

        if (!repoUrl) {
            throw new Error('No repository URL available — set one on the node or connect it after a clone node');
        }

        const tracker = createProgressTracker(reporter, nodeId, 2);

        await tracker.step('listing', { repoUrl });
        await logger.info(nodeId, `Listing tags of ${repoUrl}`);

        const tags = await listRemoteTags(repoUrl, abortSignal);

        await tracker.step('selecting', { pattern: nodeConfig.pattern });

        const matcher = patternToRegExp(nodeConfig.pattern);

        const candidates = tags
            .filter((tag) => matcher.test(tag.name))
            .filter((tag) => !nodeConfig.excludePrereleases || !PRERELEASE_PATTERN.test(tag.name))
            .sort((left, right) => compareVersions(left.name, right.name));

        const latest = candidates[0];

        if (!latest) {
            throw new Error(`No tag matching "${nodeConfig.pattern}" found on ${repoUrl}`);
        }

        await tracker.done();
        await logger.info(nodeId, `Latest tag: ${latest.name} (${latest.commitHash.slice(0, 7)})`);

        await reporter.reportSummary(nodeId, {
            key: 'resolved',
            values: { tag: latest.name, count: candidates.length },
            tone: 'positive',
        });

        return { output: { tag: latest.name, commitHash: latest.commitHash } };
    }
}

export const resolveLatestTagExecutor = new ResolveLatestTagExecutor();
