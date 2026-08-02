import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { sendNotificationConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const sendNotificationDescriptor: NodeDescriptor = {
    type: 'send-notification',
    category: 'integration',
    icon: 'Bell',
    description: 'Sends a webhook notification (Slack, Discord, etc.) on success, failure, or always.',
    configSchema: sendNotificationConfigSchema,
    outputs: [{ key: 'sent' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
