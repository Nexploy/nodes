import { type ComponentType } from 'react';
import { z } from 'zod';
import { type NodeDefinition } from '@nexploy/nodes/ui/nodeDefinition';
import { type NodeLifecycleCallbacks } from '@nexploy/nodes/core/node';

export interface NodeInputField {
    key: string;
    labelKey: string;
    descriptionKey?: string;
    type: 'input' | 'number' | 'array';
}

export interface NodeManifest {
    type: string;
    definition: NodeDefinition;
    configSchema?: z.ZodObject<any>;
    configPanel: ComponentType;
    lifecycle?: NodeLifecycleCallbacks;
    inputFields?: NodeInputField[];
}
