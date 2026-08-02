import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { setEnvVarsConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const setEnvVarsDescriptor: NodeDescriptor = {
    type: 'set-env-vars',
    category: 'config',
    icon: 'Variable',
    description: 'Defines inline environment variables for downstream nodes.',
    configSchema: setEnvVarsConfigSchema,
    outputs: [{ key: 'envVariables', type: 'array' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
