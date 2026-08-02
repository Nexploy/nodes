import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { createVolumeConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const createVolumeDescriptor: NodeDescriptor = {
    type: 'create-volume',
    category: 'utility',
    icon: 'HardDrive',
    description: 'Creates a Docker volume.',
    configSchema: createVolumeConfigSchema,
    outputs: [{ key: 'volumeName' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
