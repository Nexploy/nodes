import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { updateServiceConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const updateServiceDescriptor: NodeDescriptor = {
    type: 'update-service',
    category: 'deploy',
    icon: 'RefreshCw',
    description: 'Updates an existing Docker Swarm service (rolling update).',
    consumesFromUpstream: ['serviceId'],
    configSchema: updateServiceConfigSchema,
    outputs: [{ key: 'serviceName' }, { key: 'image' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
