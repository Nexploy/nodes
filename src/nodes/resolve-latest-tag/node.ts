import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { resolveLatestTagConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const resolveLatestTagDescriptor: NodeDescriptor = {
    type: 'resolve-latest-tag',
    category: 'source',
    icon: 'Tag',
    description:
        'Reads the tags of a remote repository and resolves the newest one matching a pattern. Use it to deploy the latest release instead of the default branch.',
    configSchema: resolveLatestTagConfigSchema,
    outputs: [{ key: 'tag' }, { key: 'commitHash' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
