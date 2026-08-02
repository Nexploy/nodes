import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { triggerStageBuildConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const triggerStageBuildDescriptor: NodeDescriptor = {
    type: 'trigger-stage-build',
    category: 'deploy',
    icon: 'Workflow',
    description:
        'Triggers a new build on another deployment stage of the same repository. Only runs when the current pipeline has succeeded — use it to promote a successful pre-prod build to production. Place it at the end of the success path.',
    configSchema: triggerStageBuildConfigSchema,
    outputs: [{ key: 'triggered' }, { key: 'triggeredStageId' }, { key: 'triggeredBuildId' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
