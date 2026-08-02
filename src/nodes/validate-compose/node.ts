import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { composeFileConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const validateComposeDescriptor: NodeDescriptor = {
    type: 'validate-compose',
    category: 'build',
    icon: 'FileSearch',
    description: 'Validates a docker-compose file syntax.',
    consumesFromUpstream: ['workDir'],
    configSchema: composeFileConfigSchema,
    outputs: [{ key: 'workDir' }, { key: 'composePath' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
