import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { cloneRepositoryConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const cloneRepositoryDescriptor: NodeDescriptor = {
    type: 'clone-repository',
    category: 'source',
    icon: 'GitBranch',
    isStartNode: true,
    description: 'Clones the linked Git repository. Always the first node of a pipeline.',
    configSchema: cloneRepositoryConfigSchema,
    outputs: [{ key: 'workDir' }, { key: 'branch' }, { key: 'commitHash' }, { key: 'commitMessage' }],
    handles: {
        inputs: [],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
