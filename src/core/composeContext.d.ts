import type { NodeExecutionContext } from '@nexploy/nodes/core/pipeline';
export declare function getComposeProjectName(repositoryId: string): string;
export declare function resolveComposeEnvVars(ctx: NodeExecutionContext<unknown>): Promise<Record<string, string>>;
export declare function resolveComposeLabels(ctx: NodeExecutionContext<unknown>): Record<string, string>;
export declare function requireComposeFileFromAncestor(ctx: NodeExecutionContext<unknown>): {
    composeFile: string;
    projectName: string;
};
