import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { setEnvVarsConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class SetEnvVarsExecutor implements INodeExecutor {
    readonly type = 'set-env-vars';
    readonly configSchema = setEnvVarsConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof setEnvVarsConfigSchema>>): Promise<NodeExecutionResult> {
        const { logger, nodeId, nodeConfig, allOutputs, edges, reporter } = ctx;

        const rawVars = Array.isArray(nodeConfig.vars) ? nodeConfig.vars : [];
        const ownMap = Object.fromEntries(rawVars.filter((e) => e.key).map((e) => [e.key, e.value]));

        const ancestorEnvs =
            getFromClosestAncestor<{ key: string; value: string }[]>(allOutputs, edges, nodeId, 'envVariables') ?? [];
        const ancestorMap = Object.fromEntries(ancestorEnvs.map((e) => [e.key, e.value]));

        const merged = { ...ancestorMap, ...ownMap };
        const envVariables = Object.entries(merged).map(([key, value]) => ({ key, value }));

        if (envVariables.length === 0) {
            await logger.info(nodeId, 'No variables defined, skipping');
            await reporter.reportSummary(nodeId, { key: 'none', tone: 'warning' });
            return { output: { envVariables: [] }, skipped: true };
        }

        await logger.info(nodeId, `Injecting ${envVariables.length} environment variable(s) into the pipeline`);

        await reporter.reportSummary(nodeId, {
            key: 'injected',
            values: { count: envVariables.length },
            tone: 'positive',
        });

        return { output: { envVariables } };
    }
}

export const setEnvVarsExecutor = new SetEnvVarsExecutor();
