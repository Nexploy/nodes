import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { createGitService } from '@nexploy/nodes/core/gitService';
import { createProgressTracker } from '@nexploy/nodes/core/nodeProgress';

export class CleanWorkdirExecutor implements INodeExecutor {
    readonly type = 'clean-workdir';

    async execute(ctx: NodeExecutionContext): Promise<NodeExecutionResult> {
        const { inputOutputs, allOutputs, logger, nodeId, edges, services, reporter } = ctx;
        const gitService = createGitService(services);
        const tracker = createProgressTracker(reporter, nodeId, 1);

        const workDirFromInputs = inputOutputs.map((o) => o.workDir).find((v): v is string => typeof v === 'string');

        const workDir = workDirFromInputs ?? getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'workDir');

        if (!workDir) {
            await logger.info(nodeId, 'No work directory to clean up');
            return { output: {}, skipped: true };
        }

        try {
            await tracker.step('remove', { path: workDir });
            await gitService.cleanup(workDir);
            await logger.info(nodeId, `Work directory cleaned: ${workDir}`);
            await reporter.reportSummary(nodeId, { key: 'cleaned', tone: 'positive' });
            return { output: { cleaned: workDir } };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            await logger.warn(nodeId, `Cleanup warning: ${message}`);
            await reporter.reportSummary(nodeId, { key: 'cleanupWarning', text: message, tone: 'warning' });
            return { output: { cleaned: workDir } };
        }
    }
}

export const cleanWorkdirExecutor = new CleanWorkdirExecutor();
