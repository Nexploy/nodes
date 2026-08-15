import ky from 'ky';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { waitForUrlConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class WaitForUrlExecutor implements INodeExecutor {
    readonly type = 'wait-for-url';
    readonly configSchema = waitForUrlConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof waitForUrlConfigSchema>>): Promise<NodeExecutionResult> {
        const { nodeConfig, logger, nodeId, abortSignal, reporter } = ctx;

        const url = nodeConfig.url;
        const expectedStatus = nodeConfig.expectedStatus;
        const timeout = nodeConfig.timeout;
        const interval = nodeConfig.interval;
        const method = nodeConfig.method;

        await logger.info(nodeId, `Waiting for ${method} ${url} to return ${expectedStatus} (timeout: ${timeout}s)`);

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
                labelValues: { method, url },
            });

            try {
                const response = await ky(url, {
                    method,
                    signal: abortSignal,
                    throwHttpErrors: false,
                    timeout: false,
                });
                if (response.status === expectedStatus) {
                    await logger.info(nodeId, `URL ${url} returned ${response.status}`);
                    await reporter.reportProgress(nodeId, {
                        current: maxAttempts,
                        total: maxAttempts,
                        labelKey: 'probe',
                        labelValues: { method, url },
                    });
                    await reporter.reportSummary(nodeId, {
                        key: 'reachable',
                        values: { status: response.status, attempts: attempt },
                        tone: 'positive',
                    });
                    return { output: { url, status: response.status } };
                }
                await logger.debug(
                    nodeId,
                    `Got ${response.status}, expected ${expectedStatus}, retrying in ${interval}s`,
                );
            } catch (err) {
                if (abortSignal.aborted) throw new Error('Aborted');
                await logger.debug(nodeId, `Request failed: ${err instanceof Error ? err.message : 'unknown error'}`);
            }

            await new Promise<void>((resolve) => setTimeout(resolve, interval * 1000));
        }

        throw new Error(`URL ${url} did not return ${expectedStatus} within ${timeout}s`);
    }
}

export const waitForUrlExecutor = new WaitForUrlExecutor();
