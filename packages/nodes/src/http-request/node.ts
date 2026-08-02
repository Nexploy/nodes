import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { httpRequestConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const httpRequestDescriptor: NodeDescriptor = {
    type: 'http-request',
    category: 'integration',
    icon: 'Webhook',
    description: 'Makes an HTTP request to an external API.',
    configSchema: httpRequestConfigSchema,
    outputs: [
        { key: 'status', labelKey: 'pipeline.inputs.httpStatus', descriptionKey: 'pipeline.inputs.desc_httpStatus' },
        { key: 'continued', internal: true },
        { key: 'body', labelKey: 'pipeline.inputs.httpBody', descriptionKey: 'pipeline.inputs.desc_httpBody' },
        { key: 'failed', internal: true },
        { key: 'error', internal: true },
    ],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
