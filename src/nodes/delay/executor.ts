import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { delayConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class DelayExecutor implements INodeExecutor {
    readonly type = 'delay';
    readonly configSchema = delayConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof delayConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, logger, nodeId, abortSignal, reporter } = ctx;

        const seconds = nodeConfig.seconds;

        await logger.info(nodeId, `Delaying pipeline by ${seconds} second(s)`);

        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(resolve, seconds * 1000);
            abortSignal.addEventListener('abort', () => {
                clearTimeout(timer);
                reject(new Error('Aborted'));
            });
        });

        await logger.info(nodeId, `Delay of ${seconds}s complete`);
        await reporter.reportSummary(nodeId, { key: 'waited', values: { seconds } });
        return { output: { delayed: seconds } };
    }
}

export const delayExecutor = new DelayExecutor();
