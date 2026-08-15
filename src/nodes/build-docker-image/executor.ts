import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createDockerService } from '@nexploy/nodes/core/dockerService';
import { NEXPLOY_LABELS } from '@nexploy/nodes/core/nexployLabels';
import { buildDockerImageConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { z } from 'zod';

export class BuildDockerImageExecutor implements INodeExecutor {
    readonly type = 'build-docker-image';
    readonly configSchema = buildDockerImageConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof buildDockerImageConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { buildConfig, allOutputs, logger, nodeId, abortSignal, nodeConfig, edges, services, reporter } = ctx;
        const dockerService = createDockerService(services.docker);
        const tracker = createProgressTracker(reporter, nodeId, 2);

        const runnerId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerId');
        const runnerName = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerName');
        const runnerRegistryId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerRegistryId');
        const runnerFallback = getFromClosestAncestor<boolean>(allOutputs, edges, nodeId, 'runnerFallback');

        const dockerfileName = nodeConfig.dockerfilePath;
        const dockerfileFilePath = nodeConfig.dockerfileFilePath;
        const dockerfilePath = dockerfileFilePath
            ? `${dockerfileFilePath.replace(/\/$/, '')}/${dockerfileName}`
            : dockerfileName;

        const repositorySlug = `nexploy-${buildConfig.repositoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        const customImageName = nodeConfig.imageName?.trim();
        const imageName = customImageName
            ? customImageName.includes(':')
                ? customImageName
                : `${customImageName}:${buildConfig.buildId}`
            : `${repositorySlug}-${nodeId}:${buildConfig.buildId}`;

        const dockerStepPattern = /^Step (\d+)\/(\d+)\s*:\s*(.*)$/;
        let layersSeen = 0;

        const onLog = async (message: string) => {
            await logger.info(nodeId, message);
            const match = dockerStepPattern.exec(message.trim());
            if (!match) return;
            layersSeen = Number(match[1]);
            await reporter.reportProgress(nodeId, {
                current: layersSeen,
                total: Number(match[2]),
                labelKey: 'layer',
                labelValues: { current: layersSeen, total: Number(match[2]) },
                detail: match[3]!.slice(0, 80),
            });
        };

        const branch = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'branch');
        const commitHash = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'commitHash');
        const commitMessage = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'commitMessage');

        const labels: Record<string, string> = {
            [NEXPLOY_LABELS.repositoryId]: buildConfig.repositoryId,
            ...(buildConfig.organizationId && {
                [NEXPLOY_LABELS.organizationId]: buildConfig.organizationId,
            }),
            [NEXPLOY_LABELS.buildId]: buildConfig.buildId,
            ...(branch && { [NEXPLOY_LABELS.branch]: branch }),
            ...(commitHash && { [NEXPLOY_LABELS.commitHash]: commitHash }),
            ...(commitMessage && { [NEXPLOY_LABELS.commitMessage]: commitMessage }),
        };

        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        if (runnerId && services.runner) {
            await tracker.step('dispatchRunner', { runner: runnerName || runnerId });
            await logger.info(nodeId, `Building ${imageName} on runner ${runnerName || runnerId}`);

            try {
                const result = await services.runner.dispatchBuild(
                    {
                        runnerId,
                        buildConfig,
                        nodeId,
                        branch,
                        commitHash,
                        build: {
                            imageName,
                            dockerfilePath,
                            labels,
                        },
                        registryId: runnerRegistryId || undefined,
                    },
                    { signal: abortSignal, onLog },
                );

                const deployableImage = result.pushedImages[0] ?? result.imageName;

                await logger.info(nodeId, `Runner build finished: ${deployableImage}`);

                await tracker.done();
                await reporter.reportSummary(nodeId, {
                    key: 'builtOnRunner',
                    values: { image: deployableImage, runner: runnerName || runnerId },
                    tone: 'positive',
                });

                return {
                    output: {
                        imageId: result.imageId,
                        imageName: deployableImage,
                        localImageName: result.imageName,
                        pushedImages: result.pushedImages,
                        runnerId,
                    },
                };
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') throw error;

                const message = error instanceof Error ? error.message : 'Unknown error';

                if (!runnerFallback) {
                    throw new Error(`Runner build failed: ${message}`);
                }

                await logger.warn(nodeId, `Runner build failed (${message}), retrying on this server`);
            }
        }

        const workDir = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'workDir');
        if (!workDir) {
            throw new Error('No workDir found in input nodes — connect this node after a Source node');
        }

        await tracker.step('buildImage', { image: imageName });
        await logger.info(nodeId, `Building Docker image: ${imageName}`);

        try {
            const result = await dockerService.buildImage(
                workDir,
                imageName,
                dockerfilePath,
                abortSignal,
                onLog,
                environmentId,
                labels,
            );

            await logger.info(
                nodeId,
                `Docker image built successfully${result.imageId ? `: ${result.imageId.slice(0, 12)}` : ''}`,
            );

            await tracker.done();
            await reporter.reportSummary(nodeId, {
                key: layersSeen > 0 ? 'builtWithLayers' : 'built',
                values: { image: imageName, layers: layersSeen },
                tone: 'positive',
            });

            return {
                output: {
                    imageId: result.imageId,
                    imageName,
                },
            };
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') throw error;
            throw new Error(`Docker build failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const buildDockerImageExecutor = new BuildDockerImageExecutor();
