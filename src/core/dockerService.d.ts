import type { DockerApiClient } from '@nexploy/nodes/core/nodeServices';
type LogWriter = (message: string) => Promise<void>;
export interface DockerBuildService {
    buildImage(
        workDir: string,
        imageName: string,
        dockerfilePath: string | undefined,
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
        labels?: Record<string, string>,
    ): Promise<{
        imageId?: string;
    }>;
    pushToRegistry(
        imageName: string,
        targetName: string,
        auth: {
            serveraddress: string;
            username: string;
            password: string;
        },
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
    ): Promise<{
        targetName: string;
    }>;
    deployCompose(
        workDir: string,
        projectName: string,
        composePath: string | undefined,
        envVars: Record<string, string>,
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
        buildId?: string,
        repositoryId?: string,
        labels?: Record<string, string>,
        noCache?: boolean,
    ): Promise<{
        success: boolean;
        containers?: string[];
        composeConfig?: string;
    }>;
    composeBuild(
        workDir: string,
        projectName: string,
        composePath: string,
        envVars: Record<string, string>,
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
        labels?: Record<string, string>,
        noCache?: boolean,
    ): Promise<{
        success: boolean;
        projectName: string;
        composeFile: string;
        services: string[];
        builtServices: string[];
        composeConfig: string;
    }>;
    composeRun(
        workDir: string,
        projectName: string,
        composeFile: string,
        service: string,
        command: string | undefined,
        envVars: Record<string, string>,
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
        options?: {
            noDeps?: boolean;
            user?: string;
            workingDir?: string;
        },
    ): Promise<{
        success: boolean;
        exitCode: number;
        service: string;
    }>;
    composeUp(
        workDir: string,
        projectName: string,
        composeFile: string,
        envVars: Record<string, string>,
        signal: AbortSignal,
        onLog: LogWriter,
        environmentId?: string,
        options?: {
            recreate?: boolean;
            removeOrphans?: boolean;
            keepComposeFile?: boolean;
        },
    ): Promise<{
        success: boolean;
        projectName: string;
        containers: string[];
        composeConfig: string;
    }>;
}
export declare function createDockerService(docker: DockerApiClient): DockerBuildService;
export {};
