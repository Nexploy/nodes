import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createNetworkConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class CreateNetworkExecutor implements INodeExecutor {
    readonly type = 'create-network';
    readonly configSchema = createNetworkConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof createNetworkConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, logger, nodeId, abortSignal, edges, reporter } = ctx;
        const tracker = createProgressTracker(reporter, nodeId, 1);

        const name = nodeConfig.name;
        const driver = nodeConfig.driver;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        await tracker.step('create', { name: String(name) });
        await logger.info(nodeId, `Creating Docker network: ${name} (driver: ${driver})`);

        try {
            const result = await ctx.services.docker
                .post('networks/create', {
                    json: { name, driver },
                    signal: abortSignal,
                    environmentId,
                })
                .json<{ id: string; name: string; alreadyExisted: boolean }>();

            if (result.alreadyExisted) {
                await logger.warn(nodeId, `Network ${name} already exists`);
                await reporter.reportSummary(nodeId, {
                    key: 'alreadyExists',
                    values: { name: String(name) },
                    tone: 'warning',
                });
            } else {
                await logger.info(nodeId, `Network created: ${name}`);
                await reporter.reportSummary(nodeId, {
                    key: 'created',
                    values: { name: String(name), driver },
                    tone: 'positive',
                });
            }
            return { output: { networkId: result.id, networkName: name } };
        } catch (error) {
            throw new Error(`Failed to create network: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const createNetworkExecutor = new CreateNetworkExecutor();
