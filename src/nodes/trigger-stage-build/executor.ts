import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { triggerStageBuildConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { z } from 'zod';

export class TriggerStageBuildExecutor implements INodeExecutor {
    readonly type = 'trigger-stage-build';
    readonly configSchema = triggerStageBuildConfigSchema;
    readonly runsOnPipelineFailure = true;

    async execute(
        ctx: NodeExecutionContext<z.infer<typeof triggerStageBuildConfigSchema>>,
    ): Promise<NodeExecutionResult> {
        const { nodeId, nodeConfig, buildConfig, logger, abortSignal, pipelineHasFailed, services, reporter } = ctx;

        const { stageId: targetStageId, triggerOnFailure } = nodeConfig;

        if (pipelineHasFailed && !triggerOnFailure) {
            await logger.info(nodeId, 'Pipeline failed — skipping downstream stage build trigger');
            await reporter.reportSummary(nodeId, { key: 'notTriggered', tone: 'warning' });
            return { output: { triggered: false }, skipped: true };
        }

        if (!targetStageId) {
            throw new Error('No target stage configured for trigger-stage-build node');
        }

        if (targetStageId === buildConfig.stageId) {
            throw new Error('Trigger Stage Build cannot target the stage it is running in (would loop indefinitely)');
        }

        const targetStage = await services.build.findStage(buildConfig.repositoryId, targetStageId);
        if (!targetStage) {
            throw new Error(`Target stage ${targetStageId} not found in this repository — it may have been deleted`);
        }

        if (abortSignal.aborted) throw new Error('Build cancelled');

        await logger.info(nodeId, `Triggering build on stage "${targetStage.name}"`);

        const triggered = await services.build.startStageBuild({
            repositoryId: buildConfig.repositoryId,
            branch: buildConfig.gitBranch,
            stageId: targetStage.id,
            userId: buildConfig.userId,
            triggeredByStageId: buildConfig.stageId,
        });

        if (!triggered) {
            throw new Error(`Build on stage "${targetStage.name}" was not started`);
        }

        await logger.info(nodeId, `Started build #${triggered.numberBuild} on stage "${targetStage.name}"`);

        await reporter.reportSummary(nodeId, {
            key: 'triggered',
            values: { build: triggered.numberBuild, stage: targetStage.name },
            tone: 'positive',
        });

        return {
            output: {
                triggered: true,
                triggeredStageId: targetStage.id,
                triggeredBuildId: triggered.id,
            },
        };
    }
}

export const triggerStageBuildExecutor = new TriggerStageBuildExecutor();
