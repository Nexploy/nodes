import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { pruneImagesConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const pruneImagesDescriptor: NodeDescriptor = {
    type: 'prune-images',
    category: 'build',
    icon: 'Trash2',
    description: 'Prunes unused Docker images to free disk space.',
    configSchema: pruneImagesConfigSchema,
    outputs: [{ key: 'removedImages' }, { key: 'reclaimedSpace' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
