import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { restartContainerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const restartContainerDescriptor: NodeDescriptor = {
    type: 'restart-container',
    category: 'deploy',
    icon: 'RotateCcw',
    description: 'Restarts a container.',
    consumesFromUpstream: ['containerId'],
    configSchema: restartContainerConfigSchema,
    outputs: [{ key: 'containerId' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
