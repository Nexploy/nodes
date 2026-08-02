import { MinimalEdge, MinimalNode, PipelineEdge } from '@nexploy/nodes/core/node';
import { NodeOutputData, NodeOutputStore } from '@nexploy/nodes/core/pipeline';
export declare function getFromInputs<T>(inputOutputs: NodeOutputData[], key: string): T | undefined;
export declare function getFromAllOutputs<T>(allOutputs: NodeOutputStore, key: string): T | undefined;
export declare function getFromClosestAncestor<T>(
    allOutputs: NodeOutputStore,
    edges: PipelineEdge[],
    nodeId: string,
    key: string,
): T | undefined;
export declare function findClosestEnabledNodes<TNode extends MinimalNode>(
    nodeId: string,
    nodes: TNode[],
    edges: MinimalEdge[],
    visited?: Set<string>,
): TNode[];
