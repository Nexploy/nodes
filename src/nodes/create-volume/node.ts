import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { createVolumeConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

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
