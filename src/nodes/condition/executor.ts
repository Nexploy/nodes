import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { findClosestEnabledNodes } from '@nexploy/nodes/core/helpers';
import { conditionConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class ConditionExecutor implements INodeExecutor {
    readonly type = 'condition';
    readonly configSchema = conditionConfigSchema;

    async execute(ctx: NodeExecutionContext<z.infer<typeof conditionConfigSchema>>): Promise<NodeExecutionResult> {
        const { logger, nodeId, edges, nodes, allOutputs, nodeConfig, reporter } = ctx;

        const enabledParents = findClosestEnabledNodes(nodeId, nodes, edges);
        const effectiveOutputs = enabledParents
            .map((n) => allOutputs.get(n.id))
            .filter((o): o is Record<string, unknown> => o !== undefined);

        const hasData = (o: Record<string, unknown>) => Object.keys(o).length > 0;

        let passed: boolean;
        if (nodeConfig.operator === 'and') {
            passed = effectiveOutputs.length > 0 && effectiveOutputs.every(hasData);
        } else {
            passed = effectiveOutputs.length > 0 && effectiveOutputs.some(hasData);
        }

        await logger.info(
            nodeId,
            `Condition [${nodeConfig.operator.toUpperCase()}] evaluated: ${passed ? 'true' : 'false'} (${effectiveOutputs.length} effective input(s))`,
        );

        const losingHandle = passed ? 'false' : 'true';
        const skippedBranchTargets = edges
            .filter((e) => e.source === nodeId && e.sourceHandle === losingHandle)
            .map((e) => e.target);

        await reporter.reportSummary(nodeId, {
            key: passed ? 'passed' : 'notPassed',
            values: { inputs: effectiveOutputs.length },
            tone: passed ? 'positive' : 'warning',
        });

        return {
            output: { passed, branch: passed ? 'true' : 'false' },
            skippedBranchTargets,
        };
    }
}

export const conditionExecutor = new ConditionExecutor();
