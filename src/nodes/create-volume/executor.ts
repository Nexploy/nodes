import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';
import { createVolumeConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class CreateVolumeExecutor implements INodeExecutor {
    readonly type = 'create-volume';
    readonly configSchema = createVolumeConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof createVolumeConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, logger, nodeId, abortSignal, edges, reporter } = ctx;
        const tracker = createProgressTracker(reporter, nodeId, 1);

        const name = nodeConfig.name;
        const driver = nodeConfig.driver;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        await tracker.step('create', { name: String(name) });
        await logger.info(nodeId, `Creating Docker volume: ${name}`);

        try {
            const result = await ctx.services.docker
                .post('volumes/create', {
                    json: { name, ...(driver && { driver }) },
                    signal: abortSignal,
                    environmentId,
                })
                .json<{ volumeName: string }>();

            await logger.info(nodeId, `Volume created: ${result.volumeName}`);

            await reporter.reportSummary(nodeId, {
                key: 'created',
                values: { name: result.volumeName },
                tone: 'positive',
            });

            return {
                output: { volumeName: result.volumeName },
            };
        } catch (error) {
            const msg = error instanceof Error ? error.message.toLowerCase() : '';
            if (msg.includes('already') || msg.includes('existe')) {
                await logger.info(nodeId, `Volume already exists: ${name}`);
                await reporter.reportSummary(nodeId, {
                    key: 'alreadyExists',
                    values: { name: String(name) },
                    tone: 'warning',
                });
                return { output: { volumeName: name }, skipped: true };
            }
            throw new Error(`Failed to create volume: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const createVolumeExecutor = new CreateVolumeExecutor();
