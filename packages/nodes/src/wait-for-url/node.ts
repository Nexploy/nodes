import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { waitForUrlConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const waitForUrlDescriptor: NodeDescriptor = {
    type: 'wait-for-url',
    category: 'flow',
    icon: 'Globe',
    description: 'Polls a URL until it returns the expected HTTP status code.',
    configSchema: waitForUrlConfigSchema,
    outputs: [
        { key: 'url' },
        { key: 'status', labelKey: 'pipeline.inputs.httpStatus', descriptionKey: 'pipeline.inputs.desc_httpStatus' },
    ],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
