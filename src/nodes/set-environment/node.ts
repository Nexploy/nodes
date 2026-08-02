import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { setEnvironmentConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const setEnvironmentDescriptor: NodeDescriptor = {
    type: 'set-environment',
    category: 'deploy',
    icon: 'Server',
    description: 'Activates a Nexploy environment for subsequent nodes.',
    configSchema: setEnvironmentConfigSchema,
    outputs: [{ key: 'environmentId' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
