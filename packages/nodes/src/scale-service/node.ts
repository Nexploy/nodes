import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { scaleServiceConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const scaleServiceDescriptor: NodeDescriptor = {
    type: 'scale-service',
    category: 'deploy',
    icon: 'ArrowUpDown',
    description: 'Scales a Docker Swarm service to a given number of replicas.',
    consumesFromUpstream: ['serviceId'],
    configSchema: scaleServiceConfigSchema,
    outputs: [{ key: 'serviceName' }, { key: 'replicas' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
