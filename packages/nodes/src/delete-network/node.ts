import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { deleteNetworkConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const deleteNetworkDescriptor: NodeDescriptor = {
    type: 'delete-network',
    category: 'utility',
    icon: 'Trash2',
    description: 'Deletes a Docker network.',
    configSchema: deleteNetworkConfigSchema,
    outputs: [{ key: 'deletedNetwork' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
