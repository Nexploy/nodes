import { NodeDescriptor } from '@nexploy/nodes/core/nodeDescriptor';
import { fetchSecretsVaultConfigSchema } from '@nexploy/nodes/core/schemas/nodeConfigs.schema';

export const fetchSecretsVaultDescriptor: NodeDescriptor = {
    type: 'fetch-secrets-vault',
    category: 'config',
    icon: 'KeyRound',
    description: 'Fetches secrets from a HashiCorp Vault instance.',
    configSchema: fetchSecretsVaultConfigSchema,
    outputs: [{ key: 'envVariables', type: 'array' }, { key: 'secretCount' }],
    handles: {
        inputs: [{ id: 'input', position: 'left' }],
        outputs: [{ id: 'output', position: 'right' }],
        attachments: [],
    },
};
