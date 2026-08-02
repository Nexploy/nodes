import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { createReleaseConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

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
