import { type ComponentType, type ReactNode } from 'react';
import type {
    NodeContainerRef,
    NodeImageRef,
    NodeNetworkRef,
    NodeVolumeRef,
} from '@nexploy/nodes/core/dockerResources';
export interface NodeEnvironmentSummary {
    id: string;
    name: string;
    connectionType?: string | null;
}
export interface NodeSwarmService {
    id: string;
    name: string;
}
export interface ResourceResult<T> {
    data: T | undefined;
    isLoading: boolean;
    mutate: () => void;
}
export interface NodeOutputFieldView {
    key: string;
    labelKey: string;
    descriptionKey: string;
    type: 'input' | 'number' | 'array';
}
export interface AncestorWithInputs {
    nodeId: string;
    nodeType: string;
    inputFields: NodeOutputFieldView[];
}
export interface PermissionGateProps {
    resource: string;
    action: string;
    condition?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
}
export interface CloudflareDomainFieldProps {
    form: unknown;
    basePath?: string;
}
export interface NodeHostComponents {
    PermissionGate: ComponentType<PermissionGateProps>;
    CloudflareDomainField: ComponentType<CloudflareDomainFieldProps>;
}
export interface WebhookSetup {
    execute: (input: { repositoryId: string; refresh?: boolean }) => void;
    isPending: boolean;
}
export interface NodesUIAdapter {
    useEnvironmentId(): string | undefined;
    usePanelNodeId(): string | undefined;
    useStageId(): string | undefined;
    useEnvironments(): NodeEnvironmentSummary[];
    useSwarmServices(): NodeSwarmService[];
    useContainers(environmentId?: string): {
        containers: NodeContainerRef[];
        isLoading: boolean;
    };
    useImages(environmentId?: string): {
        images: NodeImageRef[];
        isLoading: boolean;
    };
    useVolumes(environmentId?: string): {
        volumes: NodeVolumeRef[];
        isLoading: boolean;
    };
    useNetworks(environmentId?: string): {
        networks: NodeNetworkRef[];
        isLoading: boolean;
    };
    useResource<T>(url: string | null): ResourceResult<T>;
    useAncestorInputFields(nodeId: string): AncestorWithInputs[];
    useWebhookSetup(onSuccess: () => void): WebhookSetup;
    components: NodeHostComponents;
}
export declare function NodesUIProvider({
    adapter,
    children,
}: {
    adapter: NodesUIAdapter;
    children: ReactNode;
}): import('react/jsx-runtime').JSX.Element;
export declare function useNodeEnvironmentId(): string | undefined;
export declare function useNodePanelNodeId(): string | undefined;
export declare function useNodeStageId(): string | undefined;
export declare function useNodeEnvironments(): NodeEnvironmentSummary[];
export declare function useNodeSwarmServices(): NodeSwarmService[];
export declare function useNodeContainers(environmentId?: string): {
    containers: NodeContainerRef[];
    isLoading: boolean;
};
export declare function useNodeImages(environmentId?: string): {
    images: NodeImageRef[];
    isLoading: boolean;
};
export declare function useNodeVolumes(environmentId?: string): {
    volumes: NodeVolumeRef[];
    isLoading: boolean;
};
export declare function useNodeNetworks(environmentId?: string): {
    networks: NodeNetworkRef[];
    isLoading: boolean;
};
export declare function useNodeResource<T>(url: string | null): ResourceResult<T>;
export declare function useNodeAncestorInputFields(nodeId: string): AncestorWithInputs[];
export declare function useNodeWebhookSetup(onSuccess: () => void): WebhookSetup;
export declare function useNodeHostComponents(): NodeHostComponents;
