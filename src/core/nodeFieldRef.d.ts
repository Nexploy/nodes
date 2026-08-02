export interface NodeFieldRef {
    nodeId: string;
    inputKey: string;
    labelKey: string;
    nodeType?: string;
}
export declare function isNodeFieldRef(value: unknown): value is NodeFieldRef;
