import type { NodeDefinition } from '@nexploy/nodes/ui/nodeDefinition';

export interface NodeRegistryState {
    nodes: NodeDefinition[];
    getDefinition: (type: string) => NodeDefinition | undefined;
}
