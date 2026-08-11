import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { setRunnerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class SetRunnerExecutor implements INodeExecutor {
    readonly type = 'set-runner';
    readonly configSchema = setRunnerConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof setRunnerConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, logger, nodeId, services } = ctx;

        const { runnerId, runnerName, registryId, fallbackToLocal } = nodeConfig;

        if (!runnerId) {
            throw new Error('No build runner selected — pick one in the node configuration');
        }

        const label = runnerName || runnerId;

        const availability = await services.runner?.checkAvailability(runnerId);

        if (availability && !availability.available) {
            const reason = availability.reason ?? 'runner unavailable';

            if (!fallbackToLocal) {
                throw new Error(`Build runner "${label}" is not usable: ${reason}`);
            }

            await logger.warn(nodeId, `Build runner "${label}" is not usable (${reason}), building on this server`);

            return { output: { runnerId: '', runnerName: '', runnerRegistryId: '', runnerFallback: true } };
        }

        await logger.info(nodeId, `Build runner set: ${label}`);

        if (!registryId) {
            await logger.warn(
                nodeId,
                'No registry selected — the image will stay on the runner and cannot be deployed from here',
            );
        }

        return {
            output: {
                runnerId,
                runnerName,
                runnerRegistryId: registryId,
                runnerFallback: fallbackToLocal,
            },
        };
    }
}

export const setRunnerExecutor = new SetRunnerExecutor();
