import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { deleteVolumeConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { z } from 'zod';

export class DeleteVolumeExecutor implements INodeExecutor {
    readonly type = 'delete-volume';
    readonly configSchema = deleteVolumeConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof deleteVolumeConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, logger, nodeId, abortSignal, edges, reporter } = ctx;

        const volumeName = nodeConfig.volumeName.trim();
        const force = nodeConfig.force;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        await logger.info(nodeId, `Deleting Docker volume: ${volumeName}`);

        try {
            const url = force ? `volumes/delete?force=true` : `volumes/delete`;
            await ctx.services.docker
                .post(url, {
                    json: { volumeNames: [volumeName] },
                    signal: abortSignal,
                    environmentId,
                })
                .json<{ deleted: string[] }>();

            await logger.info(nodeId, `Volume deleted: ${volumeName}`);

            await reporter.reportSummary(nodeId, {
                key: 'deleted',
                values: { volume: String(volumeName) },
                tone: 'positive',
            });

            return { output: { deletedVolume: volumeName } };
        } catch (error) {
            const msg = error instanceof Error ? error.message.toLowerCase() : '';
            if (msg.includes('not found') || msg.includes('no such volume')) {
                await logger.info(nodeId, `Volume not found, skipping: ${volumeName}`);
                await reporter.reportSummary(nodeId, {
                    key: 'notFound',
                    values: { volume: String(volumeName) },
                    tone: 'warning',
                });
                return { output: { deletedVolume: volumeName }, skipped: true };
            }
            throw new Error(`Failed to delete volume: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const deleteVolumeExecutor = new DeleteVolumeExecutor();
