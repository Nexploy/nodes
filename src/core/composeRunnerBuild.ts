import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { NodeExecutionContext } from '@nexploy/nodes/core/pipeline';
import { ComposeBuildableService, planComposeBuild, renderComposeWithImages } from '@nexploy/nodes/core/composePlan';

export interface ComposeRunnerBuildOptions {
    workDir: string;
    composePath: string;
    labels: Record<string, string>;
    runnerId: string;
    noCache?: boolean;
}

export interface ComposeRunnerBuildResult {
    services: string[];
    builtServices: string[];
    pushedImages: string[];
    composeConfig: string;
}

function resolveServiceImageName(service: ComposeBuildableService, repositoryName: string, buildId: string): string {
    if (service.declaredImage) {
        return service.declaredImage.includes(':') ? service.declaredImage : `${service.declaredImage}:${buildId}`;
    }

    const repositorySlug = `nexploy-${repositoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    return `${repositorySlug}-${service.serviceName}:${buildId}`;
}

export async function buildComposeOnRunner(
    ctx: NodeExecutionContext<unknown>,
    options: ComposeRunnerBuildOptions,
): Promise<ComposeRunnerBuildResult> {
    const { allOutputs, logger, nodeId, abortSignal, edges, services, buildConfig } = ctx;
    const { workDir, composePath, labels, runnerId, noCache } = options;

    const runner = services.runner;

    if (!runner) {
        throw new Error('Runner dispatch is not available on this server');
    }

    const runnerName = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerName');
    const runnerRegistryId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'runnerRegistryId');
    const branch = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'branch');
    const commitHash = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'commitHash');

    const composeDirectory = dirname(composePath) === '.' ? '' : dirname(composePath);
    const composeAbsolutePath = join(workDir, composePath);
    const content = await readFile(composeAbsolutePath, 'utf-8');
    const plan = planComposeBuild(content, composeDirectory);

    const allServices = [
        ...plan.pulled.map((service) => service.serviceName),
        ...plan.buildable.map((service) => service.serviceName),
    ];

    for (const pulled of plan.pulled) {
        await logger.info(
            nodeId,
            `Service ${pulled.serviceName} uses the public image ${pulled.image}, it will be pulled at deploy time`,
        );
    }

    if (plan.buildable.length === 0) {
        await logger.info(nodeId, 'No service declares a build section, nothing to build on the runner');

        return { services: allServices, builtServices: [], pushedImages: [], composeConfig: content };
    }

    if (!runnerRegistryId) {
        await logger.warn(
            nodeId,
            'No registry is configured on the Build Runner node, the images will stay on the runner and the deployment will not find them',
        );
    }

    const images = new Map<string, string>();
    const pushedImages: string[] = [];

    for (const service of plan.buildable) {
        const imageName = resolveServiceImageName(service, buildConfig.repositoryName, buildConfig.buildId);

        await logger.info(
            nodeId,
            `Building service ${service.serviceName} on runner ${runnerName || runnerId} as ${imageName}`,
        );

        const result = await runner.dispatchBuild(
            {
                runnerId,
                buildConfig,
                nodeId,
                branch,
                commitHash,
                build: {
                    imageName,
                    contextPath: service.contextPath || undefined,
                    dockerfilePath: service.dockerfilePath,
                    buildArgs: service.buildArgs,
                    target: service.target,
                    platform: service.platform,
                    labels,
                    noCache,
                },
                registryId: runnerRegistryId || undefined,
            },
            { signal: abortSignal, onLog: async (message: string) => logger.info(nodeId, message) },
        );

        const deployableImage = result.pushedImages[0] ?? result.imageName;

        images.set(service.serviceName, deployableImage);
        pushedImages.push(...result.pushedImages);

        await logger.info(nodeId, `Service ${service.serviceName} built on runner: ${deployableImage}`);
    }

    const rewritten = renderComposeWithImages(plan.document, images, plan.resolvedServices);
    await writeFile(composeAbsolutePath, rewritten, 'utf-8');

    await logger.info(
        nodeId,
        `Compose file rewritten to use the ${images.size} image(s) built on the runner, the other services keep their public images`,
    );

    return { services: allServices, builtServices: [...images.keys()], pushedImages, composeConfig: rewritten };
}
