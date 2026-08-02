import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { startContainerConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const startContainerDescriptor: NodeDescriptor = {
    type: 'start-container',
    category: 'deploy',
    icon: 'Play',
    description: 'Starts an existing container. Typically placed after create-container.',
    consumesFromUpstream: ['containerId'],
    configSchema: startContainerConfigSchema,
    outputs: [{ key: 'containerId' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
