import type { BuildConfig } from '@nexploy/nodes/core/buildConfig';
import type { NodeHostServices } from '@nexploy/nodes/core/nodeServices';
import type { ProgressCallback } from '@nexploy/nodes/core/pipeline';
declare class GitService {
    private readonly services;
    constructor(services: NodeHostServices);
    private assertSafeGitUrl;
    private exec;
    cloneRepository(
        buildConfig: BuildConfig,
        onProgress?: ProgressCallback,
        options?: {
            submodules?: boolean;
            destDir?: string;
            manualToken?: string;
        },
    ): Promise<string>;
    private baseGitEnv;
    private buildAuthedUrl;
    private redactToken;
    private buildCloneArgs;
    private isAuthenticationError;
    private execCloneWithRetry;
    getCommitInfo(workDir: string): Promise<{
        hash: string;
        message: string;
    } | null>;
    validateComposeFile(workDir: string, composePath: string): Promise<string>;
    validateComposeSyntax(workDir: string, composePath: string): Promise<void>;
    validateDockerfile(workDir: string, dockerfilePath?: string): Promise<void>;
    createTag(
        workDir: string,
        tagName: string,
        message?: string,
    ): Promise<{
        alreadyExists: boolean;
    }>;
    pushTag(workDir: string, remote: string, tagName: string): Promise<void>;
    cherryPick(
        workDir: string,
        commitHash: string,
        options?: {
            noCommit?: boolean;
            remote?: string;
            targetBranch?: string;
        },
    ): Promise<void>;
    mergeBranch(
        workDir: string,
        sourceBranch: string,
        options?: {
            strategy?: 'merge' | 'squash';
            message?: string;
            remote?: string;
            push?: boolean;
            targetBranch?: string;
        },
    ): Promise<string>;
    getChangelogCommits(
        workDir: string,
        from: string,
        to: string,
    ): Promise<
        {
            hash: string;
            subject: string;
            author: string;
            date: string;
        }[]
    >;
    cleanup(workDir: string): Promise<void>;
}
export type GitCommandService = InstanceType<typeof GitService>;
export declare function createGitService(services: NodeHostServices): GitCommandService;
export {};
