import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { cherryPickCommitConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const cherryPickCommitDescriptor: NodeDescriptor = {
    type: 'cherry-pick-commit',
    category: 'source',
    icon: 'GitCommit',
    description: 'Cherry-picks a specific commit onto the current branch.',
    configSchema: cherryPickCommitConfigSchema,
    outputs: [{ key: 'workDir' }, { key: 'commitHash' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
