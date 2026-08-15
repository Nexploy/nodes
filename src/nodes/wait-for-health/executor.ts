import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { waitForHealthConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { ContainerInspectInfo } from 'dockerode';

export class WaitForHealthExecutor implements INodeExecutor {
    readonly type = 'wait-for-health';
    readonly configSchema = waitForHealthConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof waitForHealthConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeConfig, allOutputs, logger, nodeId, abortSignal, edges, reporter } = ctx;

        const containerId = nodeConfig.containerId;
        const timeout = nodeConfig.timeout;
        const interval = nodeConfig.interval;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        await logger.info(nodeId, `Waiting for container "${containerId}" to be healthy (timeout: ${timeout}s)`);

        const deadline = Date.now() + timeout * 1000;
        const maxAttempts = Math.max(1, Math.ceil(timeout / interval));
        let attempt = 0;

        while (Date.now() < deadline) {
            if (abortSignal.aborted) throw new Error('Aborted');

            attempt += 1;
            await reporter.reportProgress(nodeId, {
                current: Math.min(attempt, maxAttempts),
                total: maxAttempts,
                labelKey: 'probe',
                labelValues: { container: containerId.slice(0, 12) },
            });

            try {
                const result = await ctx.services.docker
                    .get(`container/${encodeURIComponent(containerId)}`, {
                        signal: abortSignal,
                        environmentId,
                    })
                    .json<ContainerInspectInfo>();

                const healthStatus = result?.State?.Health?.Status;
                const runningStatus = result?.State?.Status;

                if (!healthStatus && runningStatus === 'running') {
                    await logger.info(nodeId, `Container "${containerId}" is running (no healthcheck configured)`);
                    await reporter.reportSummary(nodeId, {
                        key: 'runningNoHealthcheck',
                        values: { attempts: attempt },
                        tone: 'warning',
                    });
                    return { output: { containerId, healthy: true } };
                }

                if (healthStatus === 'healthy') {
                    await logger.info(nodeId, `Container "${containerId}" is healthy`);
                    await reporter.reportSummary(nodeId, {
                        key: 'healthy',
                        values: { attempts: attempt },
                        tone: 'positive',
                    });
                    return { output: { containerId, healthy: true } };
                }

                await logger.debug(
                    nodeId,
                    `Health status: ${healthStatus ?? runningStatus ?? 'unknown'}, retrying in ${interval}s`,
                );
            } catch (err) {
                if (abortSignal.aborted) throw new Error('Aborted');
                await logger.debug(nodeId, `Inspect failed: ${err instanceof Error ? err.message : 'unknown error'}`);
            }

            await new Promise<void>((resolve) => setTimeout(resolve, interval * 1000));
        }

        throw new Error(`Container "${containerId}" did not become healthy within ${timeout}s`);
    }
}

export const waitForHealthExecutor = new WaitForHealthExecutor();
