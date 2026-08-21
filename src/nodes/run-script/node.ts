import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { runScriptConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const runScriptDescriptor: NodeDescriptor = {
    type: 'run-script',
    category: 'script',
    icon: 'Terminal',
    description:
        'Runs a shell command inside the cloned repository. Use it for setup scripts a project ships with, such as generating an .env file before deploying.',
    consumesFromUpstream: ['workDir'],
    configSchema: runScriptConfigSchema,
    outputs: [{ key: 'stdout' }, { key: 'exitCode', type: 'number' }, { key: 'failed', internal: true }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
