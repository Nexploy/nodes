import type { NodeDefinition } from '@nexploy/node-ui/nodeDefinition';

export interface NodeRegistryState {
    nodes: NodeDefinition[];
    getDefinition: (type: string) => NodeDefinition | undefined;
}
