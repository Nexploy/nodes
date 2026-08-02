import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { cacheSaveConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const cacheSaveDescriptor: NodeDescriptor = {
    type: 'cache-save',
    category: 'files',
    icon: 'FolderOutput',
    description: 'Saves a directory to cache for future builds.',
    configSchema: cacheSaveConfigSchema,
    outputs: [{ key: 'error', internal: true }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
