import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { createReleaseConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const createReleaseDescriptor: NodeDescriptor = {
    type: 'create-release',
    category: 'integration',
    icon: 'PackageCheck',
    description: 'Creates a release on GitHub or GitLab.',
    configSchema: createReleaseConfigSchema,
    outputs: [{ key: 'releaseId' }, { key: 'releaseUrl' }, { key: 'tagName' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
