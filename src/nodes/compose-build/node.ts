import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { composeBuildConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const composeBuildDescriptor: NodeDescriptor = {
    type: 'compose-build',
    category: 'build',
    icon: 'Hammer',
    description:
        'Pulls and builds the images of a docker-compose stack WITHOUT starting it. Use it instead of deploy-compose only when a one-off command (compose-run) must run between the build and the start, or when an upstream Build Runner node must build the stack remotely. Needs a workDir from an upstream source node.',
    consumesFromUpstream: ['workDir', 'runnerId'],
    configSchema: composeBuildConfigSchema,
    outputs: [
        { key: 'projectName' },
        { key: 'composeFile' },
        { key: 'services' },
        { key: 'builtServices' },
        { key: 'composeConfig' },
        { key: 'pushedImages', type: 'array', internal: true },
        { key: 'runnerId', internal: true },
    ],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
