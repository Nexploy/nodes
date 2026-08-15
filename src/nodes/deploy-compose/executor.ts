import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createDockerService } from '@nexploy/nodes/core/dockerService';
import { getComposeProjectName, resolveComposeEnvVars, resolveComposeLabels } from '@nexploy/nodes/core/composeContext';
import { composeFileConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { buildComposeOnRunner } from '@nexploy/nodes/core/composeRunnerBuild';

export class DeployComposeExecutor implements INodeExecutor {
    readonly type = 'deploy-compose';
    readonly configSchema = composeFileConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof composeFileConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { buildConfig, allOutputs, logger, nodeId, nodeConfig, abortSignal, edges, services, reporter } = ctx;
        const dockerService = createDockerService(services.docker);
        const tracker = createProgressTracker(reporter, nodeId, 3);

        const workDir = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'workDir');

        if (!workDir) {
            throw new Error('No workDir found in input nodes — connect this node after a Clone Repository node');
        }

        const composeFileName = nodeConfig.composeFileName;
        const composeFilePath = nodeConfig.composeFilePath;
        const composePath = composeFilePath
            ? `${composeFilePath.replace(/\/$/, '')}/${composeFileName}`
            : composeFileName;
        const projectName = getComposeProjectName(buildConfig.repositoryId);

        await tracker.step('resolveEnv');
        const envVars = await resolveComposeEnvVars(ctx);
        const labels = resolveComposeLabels(ctx);

        const runnerId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerId');
        const runnerFallback = getFromClosestAncestor<boolean>(allOutputs, edges, nodeId, 'runnerFallback');

        let runnerBuiltServices: string[] = [];
        let runnerPushedImages: string[] = [];

        if (runnerId && services.runner) {
            try {
                await tracker.step('buildOnRunner');
                const runnerResult = await buildComposeOnRunner(ctx, {
                    workDir,
                    composePath,
                    labels,
                    runnerId,
                    noCache: nodeConfig.noCache,
                });

                runnerBuiltServices = runnerResult.builtServices;
                runnerPushedImages = runnerResult.pushedImages;
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') throw error;

                const message = error instanceof Error ? error.message : 'Unknown error';

                if (!runnerFallback) {
                    throw new Error(`Runner compose build failed: ${message}`);
                }

                await logger.warn(nodeId, `Runner compose build failed (${message}), building on this server instead`);
            }
        }

        await tracker.step('deployStack', { project: projectName });
        await logger.info(nodeId, `Deploying Docker Compose stack: ${projectName}`);

        const composeServicePattern = /^\s*(?:Container|Service)\s+(\S+)\s+(Creating|Created|Starting|Started)\b/i;

        const onLog = async (message: string) => {
            await logger.info(nodeId, message);
            const match = composeServicePattern.exec(message);
            if (match) await tracker.detail(`${match[1]} ${match[2]!.toLowerCase()}`);
        };

        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        try {
            const result = await dockerService.deployCompose(
                workDir,
                projectName,
                composePath,
                envVars,
                abortSignal,
                onLog,
                environmentId,
                buildConfig.buildId,
                buildConfig.repositoryId,
                labels,
                nodeConfig.noCache,
            );

            await logger.info(
                nodeId,
                `Docker Compose stack deployed: ${projectName}${
                    result.containers ? ` (${result.containers.length} containers)` : ''
                }`,
            );

            await tracker.done();
            await reporter.reportSummary(nodeId, {
                key: 'deployed',
                values: { project: projectName, containers: result.containers?.length ?? 0 },
                tone: 'positive',
            });

            return {
                output: {
                    projectName,
                    containers: result.containers ?? [],
                    composeConfig: result.composeConfig,
                    ...(runnerBuiltServices.length > 0 && {
                        builtServices: runnerBuiltServices,
                        pushedImages: runnerPushedImages,
                        runnerId,
                    }),
                },
            };
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') throw error;
            throw new Error(
                `Docker Compose deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }
}

export const deployComposeExecutor = new DeployComposeExecutor();
