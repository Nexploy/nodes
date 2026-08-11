import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { composeFileConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const deployComposeDescriptor: NodeDescriptor = {
    type: 'deploy-compose',
    nodeType: 'large-node',
    category: 'deploy',
    icon: 'Layers',
    description:
        'Deploys a docker-compose stack (runs docker-compose up --build internally — no separate build-docker-image needed). When a Build Runner node sits upstream, the services declaring a build section are built on the runner and pushed to its registry first, while services that only reference a public image keep being pulled from their public repository. Needs a workDir from an upstream source node. Supports an optional save-version attach-node via its bottom attachment handle.',
    consumesFromUpstream: ['workDir', 'runnerId'],
    configSchema: composeFileConfigSchema,
    outputs: [
        { key: 'projectName' },
        { key: 'containers' },
        { key: 'composeConfig' },
        { key: 'builtServices', type: 'array', internal: true },
        { key: 'pushedImages', type: 'array', internal: true },
        { key: 'runnerId', internal: true },
    ],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [{ id: 'save-version', position: 'bottom' }],
    },
};
