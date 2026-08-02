import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { setEnvironmentConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

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
