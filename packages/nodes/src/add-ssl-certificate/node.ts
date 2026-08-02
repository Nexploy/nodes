import { NodeDescriptor } from '@nexploy/node-core/nodeDescriptor';
import { addSslCertificateConfigSchema } from '@nexploy/node-core/schemas/nodeConfigs.schema';

export const addSslCertificateDescriptor: NodeDescriptor = {
    type: 'add-ssl-certificate',
    category: 'deploy',
    icon: 'ShieldCheck',
    description: "Provisions a Let's Encrypt SSL certificate for a domain.",
    configSchema: addSslCertificateConfigSchema,
    outputs: [{ key: 'certificateId' }, { key: 'domain' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
