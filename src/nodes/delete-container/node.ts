import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { deleteContainerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const deleteContainerDescriptor: NodeDescriptor = {
    type: 'delete-container',
    category: 'deploy',
    icon: 'Trash2',
    description:
        'Deletes a container, optionally force-removing it even when running and deleting its anonymous volumes.',
    consumesFromUpstream: ['containerId'],
    configSchema: deleteContainerConfigSchema,
    outputs: [],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
