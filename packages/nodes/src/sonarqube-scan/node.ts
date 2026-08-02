import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { sonarqubeScanConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const sonarqubeScanDescriptor: NodeDescriptor = {
    type: 'sonarqube-scan',
    category: 'build',
    icon: 'ScanSearch',
    description:
        'Runs a SonarQube code quality analysis. Can fail the pipeline on the quality gate and/or when a metric (e.g. coverage) is below a required minimum score.',
    consumesFromUpstream: ['workDir'],
    configSchema: sonarqubeScanConfigSchema,
    outputs: [{ key: 'qualityGatePassed' }, { key: 'projectKey' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
