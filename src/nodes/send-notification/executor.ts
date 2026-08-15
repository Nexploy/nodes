import ky from 'ky';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { sendNotificationConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class SendNotificationExecutor implements INodeExecutor {
    readonly type = 'send-notification';
    readonly configSchema = sendNotificationConfigSchema;
    readonly runsOnPipelineFailure = true;

    async execute(
        ctx: NodeExecutionContext<z.infer<typeof sendNotificationConfigSchema>>,
    ): Promise<NodeExecutionResult> {
        const { logger, nodeId, nodeConfig, abortSignal, pipelineHasFailed, reporter } = ctx;

        const { webhookUrl, message: customMessage, triggerOn } = nodeConfig;

        const pipelineStatus = pipelineHasFailed ? 'failure' : 'success';

        const shouldSend =
            triggerOn.includes('always') ||
            (triggerOn.includes('success') && !pipelineHasFailed) ||
            (triggerOn.includes('failure') && pipelineHasFailed);

        if (!shouldSend) {
            await logger.info(
                nodeId,
                `Notification skipped (triggerOn: [${triggerOn.join(', ')}], pipeline status: ${pipelineStatus})`,
            );
            await reporter.reportSummary(nodeId, { key: 'notTriggered', tone: 'neutral' });
            return { output: { sent: false }, skipped: true };
        }

        const payload = {
            message: customMessage,
            pipelineStatus,
            timestamp: new Date().toISOString(),
        };

        await logger.info(nodeId, `Sending notification to ${webhookUrl}`);

        try {
            await ky.post(webhookUrl, {
                json: payload,
                signal: abortSignal,
            });

            await logger.info(nodeId, 'Notification sent successfully');
            await reporter.reportSummary(nodeId, { key: 'sent', tone: 'positive' });
            return { output: { sent: true } };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to send notification: ${message}`);
        }
    }
}

export const sendNotificationExecutor = new SendNotificationExecutor();
