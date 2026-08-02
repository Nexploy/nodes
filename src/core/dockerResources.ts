export type NodeContainerState = 'created' | 'running' | 'restarting' | 'paused' | 'exited' | 'dead';

export interface NodeContainerRef {
    id: string;
    name: string;
    state: NodeContainerState;
}

export interface NodeImageRef {
    id: string;
    repoTags: string[];
    containersUsed: number;
}

export interface NodeVolumeRef {
    name: string;
}

export interface NodeNetworkRef {
    id: string;
    name: string;
}
