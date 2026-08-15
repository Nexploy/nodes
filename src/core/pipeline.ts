import { BuildConfig } from '@nexploy/nodes/core/buildConfig';
import { PipelineEdge, PipelineNode } from '@nexploy/nodes/core/node';
import { NodeHostServices } from '@nexploy/nodes/core/nodeServices';
import { z } from 'zod';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type PipelineStatus = 'QUEUED' | 'BUILDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type NodeOutputData = Record<string, unknown>;

export type NodeOutputStore = Map<string, NodeOutputData>;

export interface InputNodeInfo {
    id: string;
    type: string;
}

export interface NodeExecutionContext<TConfig = Record<string, unknown>> {
    buildId: string;
    buildConfig: BuildConfig;
    nodeId: string;
    nodeConfig: TConfig;
    inputNodes: InputNodeInfo[];
    inputOutputs: NodeOutputData[];
    allOutputs: NodeOutputStore;
    nodes: PipelineNode[];
    edges: PipelineEdge[];
    logger: PipelineLogger;
    reporter: PipelineReporter;
    services: NodeHostServices;
    abortSignal: AbortSignal;
    pipelineHasFailed: boolean;
}

export interface NodeExecutionResult {
    output: NodeOutputData;
    skipped?: boolean;
    skippedBranchTargets?: string[];
}

export interface INodeExecutor<TConfig = Record<string, unknown>> {
    readonly type: string;
    readonly configSchema?: z.ZodType<TConfig>;
    readonly runsOnPipelineFailure?: boolean;
    readonly isAttachNode?: boolean;
    execute(ctx: NodeExecutionContext<TConfig>): Promise<NodeExecutionResult>;
}

export interface PipelineLogger {
    log(step: string, message: string, level?: LogLevel): Promise<void>;
    debug(step: string, message: string): Promise<void>;
    info(step: string, message: string): Promise<void>;
    warn(step: string, message: string): Promise<void>;
    error(step: string, message: string): Promise<void>;
    flush(): Promise<void>;
}

export type { NodeRunStatus } from '@nexploy/nodes/core/node';

export interface CommitInfo {
    branch: string;
    commitHash?: string;
    commitMessage?: string;
}

export type NodeReportValues = Record<string, string | number>;

export interface NodeProgress {
    current: number;
    total: number;
    labelKey: string;
    labelValues?: NodeReportValues;
    detail?: string;
}

export type NodeSummaryTone = 'neutral' | 'positive' | 'warning' | 'negative';

export interface NodeSummary {
    key: string;
    text?: string;
    values?: NodeReportValues;
    tone?: NodeSummaryTone;
}

export interface PipelineReporter {
    markCompleted(nodeId: string): Promise<void>;
    markRunning(nodeId: string): Promise<void>;
    markSkipped(nodeId: string): Promise<void>;
    markFailed(nodeId: string): Promise<void>;
    markCancelled(nodeId: string): Promise<void>;
    markNotConfigured(nodeId: string): Promise<void>;
    publishCommitInfo(data: CommitInfo): Promise<void>;
    reportProgress(nodeId: string, progress: NodeProgress): Promise<void>;
    reportSummary(nodeId: string, summary: NodeSummary): Promise<void>;
}

export interface NodeProgressTracker {
    step(labelKey: string, labelValues?: NodeReportValues, detail?: string): Promise<void>;
    detail(detail: string): Promise<void>;
    done(): Promise<void>;
}

export interface InngestStepRunner {
    run<T>(id: string, fn: () => Promise<T>): Promise<unknown>;
}

export interface PipelineResult {
    success: boolean;
    error?: string;
}

export type ProgressCallback = (progress: number, message: string) => void | Promise<void>;

export interface SSEEvent {
    type: 'log' | 'error' | 'complete';
    message?: string;
    result?: unknown;
    timestamp?: string;
}
