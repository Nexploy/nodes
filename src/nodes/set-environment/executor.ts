import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { setEnvironmentConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class SetEnvironmentExecutor implements INodeExecutor {
    readonly type = 'set-environment';
    readonly configSchema = setEnvironmentConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof setEnvironmentConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, logger, nodeId, reporter } = ctx;

        const environmentId = nodeConfig.environmentId;

        await logger.info(nodeId, `Environment set: ${environmentId}`);

        await reporter.reportSummary(nodeId, {
            key: 'selected',
            values: { environment: String(environmentId) },
            tone: 'positive',
        });

        return {
            output: { environmentId },
        };
    }
}

export const setEnvironmentExecutor = new SetEnvironmentExecutor();
