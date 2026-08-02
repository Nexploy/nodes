import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { pushToRegistryConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const pushToRegistryDescriptor: NodeDescriptor = {
    type: 'push-to-registry',
    category: 'build',
    icon: 'Upload',
    description: 'Pushes a built Docker image to a registry.',
    consumesFromUpstream: ['imageName'],
    configSchema: pushToRegistryConfigSchema,
    outputs: [{ key: 'pushedImages' }, { key: 'registryUrl' }, { key: 'tag', labelKey: 'pipeline.inputs.imageTag' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
