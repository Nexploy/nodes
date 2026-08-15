import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createContainerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { NEXPLOY_LABELS } from '@nexploy/nodes/core/nexployLabels';
import { z } from 'zod';

export class CreateContainerExecutor implements INodeExecutor {
    readonly type = 'create-container';
    readonly configSchema = createContainerConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof createContainerConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, buildConfig, logger, nodeId, abortSignal, edges, services, reporter } = ctx;
        const tracker = createProgressTracker(reporter, nodeId, 2);

        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');
        const containerName = nodeConfig.containerName;
        const imageName = nodeConfig.imageName;

        await tracker.step('resolveEnv');
        const repoEnvs = buildConfig.stageId ? await services.build.getStageEnvVariables(buildConfig.stageId) : [];
        const envVarMap = Object.fromEntries(repoEnvs.map((e) => [e.key, e.value]));
        for (const e of [...(nodeConfig.envVarsSource ?? []), ...nodeConfig.envVars]) {
            envVarMap[e.key] = e.value;
        }
        const envVars = Object.entries(envVarMap).map(([key, value]) => ({ key, value }));

        await tracker.step('createContainer', { image: imageName });
        await logger.info(
            nodeId,
            `Creating container from image: ${imageName}${containerName ? ` (name: ${containerName})` : ''}`,
        );

        const labels: Record<string, string> = {
            [NEXPLOY_LABELS.repositoryId]: buildConfig.repositoryId,
            ...(buildConfig.organizationId && {
                [NEXPLOY_LABELS.organizationId]: buildConfig.organizationId,
            }),
            [NEXPLOY_LABELS.buildId]: buildConfig.buildId,
        };

        try {
            const result = await ctx.services.docker
                .post('container/create', {
                    json: {
                        name: containerName,
                        image: imageName,
                        restart: nodeConfig.restartPolicy,
                        network: nodeConfig.networkName || undefined,
                        autoRemove: false,
                        ports: [...(nodeConfig.portsSource ?? []), ...nodeConfig.ports],
                        envVars,
                        volumes: [...(nodeConfig.volumesSource ?? []), ...nodeConfig.volumes],
                        labels,
                    },
                    signal: abortSignal,
                    environmentId,
                })
                .json<{ id: string }>();

            await logger.info(nodeId, `Container created: ${result.id.slice(0, 12)}`);

            await reporter.reportSummary(nodeId, {
                key: 'created',
                values: {
                    container: containerName ?? result.id.slice(0, 12),
                    ports: [...(nodeConfig.portsSource ?? []), ...nodeConfig.ports].length,
                },
                tone: 'positive',
            });

            return {
                output: {
                    containerId: result.id,
                    containerName: containerName ?? result.id.slice(0, 12),
                    imageName,
                },
            };
        } catch (error) {
            throw new Error(`Failed to create container: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const createContainerExecutor = new CreateContainerExecutor();
