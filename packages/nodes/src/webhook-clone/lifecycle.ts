import { type NodeLifecycleCallbacks } from '@nexploy/node-core/node';

export const webhookCloneLifecycle: NodeLifecycleCallbacks = {
    onAdd: async ({ repositoryId, services }) => {
        await services.webhook.setup(repositoryId);
    },
    onRemove: async ({ repositoryId, remainingNodesOfType, services }) => {
        if (remainingNodesOfType === 0) {
            await services.webhook.teardown(repositoryId);
        }
    },
};
