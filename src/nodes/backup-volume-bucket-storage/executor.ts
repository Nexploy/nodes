import { getFromClosestAncestor } from '@nexploy/nodes/core/helpers';
import { INodeExecutor, NodeExecutionContext, NodeExecutionResult } from '@nexploy/nodes/core/pipeline';
import { backupVolumeBucketStorageConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';
import { ResolveRefs } from '@nexploy/nodes/core/schemas/nodeFieldRef.schema';
import { z } from 'zod';

export class BackupVolumeBucketStorageExecutor implements INodeExecutor {
    readonly type = 'backup-volume-bucket-storage';
    readonly configSchema = backupVolumeBucketStorageConfigSchema;

    async execute(
        ctx: NodeExecutionContext<ResolveRefs<z.infer<typeof backupVolumeBucketStorageConfigSchema>>>,
    ): Promise<NodeExecutionResult> {
        const { nodeId, nodeConfig, allOutputs, logger, abortSignal, edges, services, reporter } = ctx;

        const volumeName = nodeConfig.volumeName;
        const accountId = nodeConfig.accountId;
        const bucket = nodeConfig.bucket;
        const environmentId = getFromClosestAncestor<string>(allOutputs, edges, nodeId, 'environmentId');

        await logger.info(nodeId, `Fetching bucket storage credentials for account ${accountId}`);

        await logger.info(nodeId, `Downloading volume archive: ${volumeName}`);
        if (abortSignal.aborted) throw new Error('Build cancelled');

        const buffer = await ctx.services.docker
            .get(`backups/download/${encodeURIComponent(volumeName)}`, {
                timeout: false,
                environmentId,
            })
            .arrayBuffer();

        const fileName = `${volumeName}-${Date.now()}.tar.gz`;

        await logger.info(nodeId, `Uploading ${fileName} to ${bucket} (${buffer.byteLength} bytes)`);
        if (abortSignal.aborted) throw new Error('Build cancelled');

        await services.bucketStorage.putObject(accountId, bucket, fileName, new Uint8Array(buffer), 'application/gzip');

        await logger.info(nodeId, `Volume backup uploaded successfully: ${fileName}`);

        await reporter.reportSummary(nodeId, {
            key: 'uploaded',
            values: { file: String(fileName), bucket: String(bucket) },
            tone: 'positive',
        });

        return {
            output: { fileName, bucket, volumeName },
        };
    }
}

export const backupVolumeBucketStorageExecutor = new BackupVolumeBucketStorageExecutor();
