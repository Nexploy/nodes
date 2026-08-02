import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { createServiceConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const createServiceDescriptor: NodeDescriptor = {
    type: 'create-service',
    nodeType: 'large-node',
    category: 'deploy',
    icon: 'Layers',
    description: 'Creates a Docker Swarm service. Requires Swarm mode enabled.',
    configSchema: createServiceConfigSchema,
    outputs: [{ key: 'serviceId' }, { key: 'serviceName' }, { key: 'imageName' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
