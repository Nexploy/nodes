import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { setRunnerConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const setRunnerDescriptor: NodeDescriptor = {
    type: 'set-runner',
    category: 'build',
    icon: 'Hammer',
    description:
        'Sends the build work of every downstream node to a remote build runner instead of the Nexploy host. Requires a runner registered in Admin > Servers.',
    configSchema: setRunnerConfigSchema,
    outputs: [
        { key: 'runnerId' },
        { key: 'runnerName' },
        { key: 'runnerRegistryId', internal: true },
        { key: 'runnerFallback', internal: true },
    ],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
