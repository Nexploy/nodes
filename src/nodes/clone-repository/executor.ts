import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createGitService } from '@nexploy/nodes/core/gitService';
import { cloneRepositoryConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class CloneRepositoryExecutor implements INodeExecutor {
    readonly type = 'clone-repository';
    readonly configSchema = cloneRepositoryConfigSchema;

    async execute(
        ctx: NodeExecutionContext<z.infer<typeof cloneRepositoryConfigSchema>>,
    ): Promise<NodeExecutionResult> {
        const { buildId, buildConfig, nodeConfig, logger, nodeId, reporter, services } = ctx;
        const gitService = createGitService(services);
        const tracker = createProgressTracker(reporter, nodeId, 3);

        const effectiveBranch = nodeConfig.branch;
        const effectiveCommitHash = nodeConfig.commitHash;

        const effectiveConfig = {
            ...buildConfig,
            gitBranch: effectiveBranch,
            gitCommitHash: effectiveCommitHash,
        };

        const commitSuffix = effectiveCommitHash ? ` (commit: ${effectiveCommitHash.substring(0, 7)})` : '';
        await logger.info(
            nodeId,
            `Cloning repository ${buildConfig.gitUrl} (branch: ${effectiveBranch}${commitSuffix})`,
        );

        const onProgress = async (progress: number, message: string) => {
            await logger.info(nodeId, `${message} (${Math.round(progress)}%)`);
            await tracker.detail(`${message} ${Math.round(progress)}%`);
        };

        try {
            await tracker.step('clone', { branch: effectiveBranch });
            const workDir = await gitService.cloneRepository(effectiveConfig, onProgress, {
                submodules: nodeConfig.submodules,
            });

            if (effectiveCommitHash) {
                await tracker.step('checkout', { commit: effectiveCommitHash.substring(0, 7) });
                await logger.info(nodeId, `Checked out commit ${effectiveCommitHash.substring(0, 7)}`);
            }

            await tracker.step('readCommit');
            const commitInfo = await gitService.getCommitInfo(workDir);
            const resolvedHash = commitInfo?.hash ?? effectiveCommitHash;
            const resolvedMessage = commitInfo?.message;

            await services.build.updateGitInfo(buildId, effectiveBranch, resolvedHash, resolvedMessage);
            await reporter.publishCommitInfo({
                branch: effectiveBranch,
                commitHash: resolvedHash,
                commitMessage: resolvedMessage,
            });

            await logger.info(
                nodeId,
                `Repository cloned successfully (branch: ${effectiveBranch}, commit: ${resolvedHash ?? 'unknown'})`,
            );

            await tracker.done();
            await reporter.reportSummary(nodeId, {
                key: 'cloned',
                values: { branch: effectiveBranch, commit: resolvedHash?.substring(0, 7) ?? '—' },
                tone: 'positive',
            });

            return {
                output: {
                    workDir,
                    branch: effectiveBranch,
                    commitHash: resolvedHash,
                    commitMessage: resolvedMessage,
                },
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to clone repository: ${message}`);
        }
    }
}

export const cloneRepositoryExecutor = new CloneRepositoryExecutor();
