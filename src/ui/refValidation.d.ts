import { type ReactNode } from 'react';
export declare function RefValidationProvider({
    nodeId,
    children,
}: {
    nodeId: string;
    children: ReactNode;
}): import('react/jsx-runtime').JSX.Element;
export declare function useValidAncestorNodeIds(): Set<string>;
export declare function useAncestorIndex(nodeId: string): number | undefined;
