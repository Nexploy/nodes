import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { pruneVolumesConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const pruneVolumesDescriptor: NodeDescriptor = {
    type: 'prune-volumes',
    category: 'utility',
    icon: 'DatabaseZap',
    description:
        'Removes unused Docker volumes (docker volume prune) to free disk space. By default only anonymous volumes are removed; enable "all" to also remove unused named volumes, or set "filter" (e.g. project=myapp) to restrict pruning to a label.',
    configSchema: pruneVolumesConfigSchema,
    outputs: [{ key: 'removedVolumes' }, { key: 'reclaimedSpace' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
