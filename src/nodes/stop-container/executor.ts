import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { stopContainerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { HTTPError } from 'ky';
import { z } from 'zod';

export class StopContainerExecutor implements INodeExecutor {
    readonly type = 'stop-container';
    readonly configSchema = stopContainerConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof stopContainerConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, logger, nodeId, abortSignal, edges, reporter } = ctx;

        const containerId = nodeConfig.containerId;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');
        const opts = { signal: abortSignal, environmentId };

        await logger.info(nodeId, `Stopping container: ${containerId}`);

        try {
            await ctx.services.docker.post('container/stop', { ...opts, json: { containerIds: [containerId] } });
        } catch (error) {
            if (error instanceof HTTPError && error.response.status === 409) {
                await logger.warn(nodeId, error.message);
                return { output: { containerId } };
            }
            throw error;
        }

        await logger.info(nodeId, `Container stopped: ${containerId}`);
        await reporter.reportSummary(nodeId, {
            key: 'stopped',
            values: { container: String(containerId).slice(0, 12) },
            tone: 'positive',
        });
        return { output: { containerId } };
    }
}

export const stopContainerExecutor = new StopContainerExecutor();
