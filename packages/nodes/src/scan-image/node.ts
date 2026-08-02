import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { scanImageConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const scanImageDescriptor: NodeDescriptor = {
    type: 'scan-image',
    category: 'build',
    icon: 'ShieldCheck',
    description: 'Scans a Docker image for vulnerabilities using Trivy.',
    consumesFromUpstream: ['imageId'],
    configSchema: scanImageConfigSchema,
    outputs: [{ key: 'image' }, { key: 'vulnerabilities' }, { key: 'critical' }, { key: 'high' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
