import { z } from 'zod';
export declare const cloneRepositoryConfigSchema: z.ZodObject<
    {
        branch: z.ZodDefault<z.ZodString>;
        commitHash: z.ZodOptional<z.ZodString>;
        submodules: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const WEBHOOK_TRIGGER_EVENTS: readonly ['push', 'merge_request', 'tag'];
export declare const MERGE_REQUEST_ACTIONS: readonly ['opened', 'updated', 'merged', 'closed'];
export declare const webhookCloneConfigSchema: z.ZodObject<
    {
        triggerEvents: z.ZodDefault<
            z.ZodArray<
                z.ZodEnum<{
                    merge_request: 'merge_request';
                    push: 'push';
                    tag: 'tag';
                }>
            >
        >;
        branchFilter: z.ZodOptional<z.ZodString>;
        mergeRequestActions: z.ZodDefault<
            z.ZodArray<
                z.ZodEnum<{
                    closed: 'closed';
                    merged: 'merged';
                    opened: 'opened';
                    updated: 'updated';
                }>
            >
        >;
        tagFilter: z.ZodOptional<z.ZodString>;
        submodules: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export type WebhookCloneConfig = z.infer<typeof webhookCloneConfigSchema>;
export declare const buildDockerImageConfigSchema: z.ZodObject<
    {
        dockerfilePath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        dockerfileFilePath: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        imageName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const validateDockerfileConfigSchema: z.ZodObject<
    {
        dockerfilePath: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const composeFileConfigSchema: z.ZodObject<
    {
        composeFileName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        composeFilePath: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        noCache: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const composeBuildConfigSchema: z.ZodObject<
    {
        composeFileName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        composeFilePath: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        noCache: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const composeRunConfigSchema: z.ZodObject<
    {
        service: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        command: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        workingDir: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        user: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        noDeps: z.ZodDefault<z.ZodBoolean>;
        continueOnError: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const composeUpConfigSchema: z.ZodObject<
    {
        recreate: z.ZodDefault<z.ZodBoolean>;
        removeOrphans: z.ZodDefault<z.ZodBoolean>;
        keepComposeFile: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const varEntrySchema: z.ZodObject<
    {
        id: z.ZodString;
        key: z.ZodString;
        value: z.ZodString;
    },
    z.core.$strip
>;
export declare const setEnvVarsConfigSchema: z.ZodObject<
    {
        vars: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        id: z.ZodString;
                        key: z.ZodString;
                        value: z.ZodString;
                    },
                    z.core.$strip
                >
            >
        >;
    },
    z.core.$strip
>;
export declare const pushToRegistryConfigSchema: z.ZodObject<
    {
        registryId: z.ZodDefault<z.ZodString>;
        registryName: z.ZodDefault<z.ZodString>;
        imageName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const pullFromRegistryConfigSchema: z.ZodObject<
    {
        registryId: z.ZodDefault<z.ZodString>;
        imageName: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const setEnvironmentConfigSchema: z.ZodObject<
    {
        environmentId: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const sendNotificationConfigSchema: z.ZodObject<
    {
        webhookUrl: z.ZodDefault<z.ZodString>;
        triggerOn: z.ZodDefault<
            z.ZodArray<
                z.ZodEnum<{
                    always: 'always';
                    failure: 'failure';
                    success: 'success';
                }>
            >
        >;
        message: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const stopContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const startContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const restartContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const removeContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const deleteContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        force: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const createContainerConfigSchema: z.ZodObject<
    {
        containerName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        imageName: z.ZodUnion<
            readonly [
                z.ZodObject<
                    {
                        nodeId: z.ZodString;
                        inputKey: z.ZodString;
                        labelKey: z.ZodString;
                        nodeType: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                >,
                z.ZodString,
            ]
        >;
        restartPolicy: z.ZodDefault<
            z.ZodEnum<{
                always: 'always';
                no: 'no';
                'on-failure': 'on-failure';
                'unless-stopped': 'unless-stopped';
            }>
        >;
        networkName: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        portsSource: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodArray<
                        z.ZodObject<
                            {
                                hostPort: z.ZodCoercedNumber<unknown>;
                                containerPort: z.ZodCoercedNumber<unknown>;
                                protocol: z.ZodDefault<
                                    z.ZodEnum<{
                                        tcp: 'tcp';
                                        udp: 'udp';
                                    }>
                                >;
                            },
                            z.core.$strip
                        >
                    >,
                ]
            >
        >;
        ports: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        hostPort: z.ZodCoercedNumber<unknown>;
                        containerPort: z.ZodCoercedNumber<unknown>;
                        protocol: z.ZodDefault<
                            z.ZodEnum<{
                                tcp: 'tcp';
                                udp: 'udp';
                            }>
                        >;
                    },
                    z.core.$strip
                >
            >
        >;
        envVarsSource: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodArray<
                        z.ZodObject<
                            {
                                key: z.ZodString;
                                value: z.ZodString;
                            },
                            z.core.$strip
                        >
                    >,
                ]
            >
        >;
        envVars: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        key: z.ZodString;
                        value: z.ZodString;
                    },
                    z.core.$strip
                >
            >
        >;
        volumesSource: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodArray<
                        z.ZodObject<
                            {
                                hostPath: z.ZodString;
                                containerPath: z.ZodString;
                                readOnly: z.ZodDefault<z.ZodBoolean>;
                            },
                            z.core.$strip
                        >
                    >,
                ]
            >
        >;
        volumes: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        hostPath: z.ZodString;
                        containerPath: z.ZodString;
                        readOnly: z.ZodDefault<z.ZodBoolean>;
                    },
                    z.core.$strip
                >
            >
        >;
    },
    z.core.$strip
>;
export declare const createNetworkConfigSchema: z.ZodObject<
    {
        name: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        driver: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const createVolumeConfigSchema: z.ZodObject<
    {
        name: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        driver: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const waitForHealthConfigSchema: z.ZodObject<
    {
        containerId: z.ZodUnion<
            readonly [
                z.ZodObject<
                    {
                        nodeId: z.ZodString;
                        inputKey: z.ZodString;
                        labelKey: z.ZodString;
                        nodeType: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                >,
                z.ZodString,
            ]
        >;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        interval: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    },
    z.core.$strip
>;
export declare const waitForUrlConfigSchema: z.ZodObject<
    {
        url: z.ZodDefault<z.ZodString>;
        expectedStatus: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        interval: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        method: z.ZodDefault<
            z.ZodEnum<{
                GET: 'GET';
                HEAD: 'HEAD';
                POST: 'POST';
            }>
        >;
    },
    z.core.$strip
>;
export declare const waitForPortConfigSchema: z.ZodObject<
    {
        containerId: z.ZodUnion<
            readonly [
                z.ZodObject<
                    {
                        nodeId: z.ZodString;
                        inputKey: z.ZodString;
                        labelKey: z.ZodString;
                        nodeType: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                >,
                z.ZodString,
            ]
        >;
        port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        interval: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    },
    z.core.$strip
>;
export declare const delayConfigSchema: z.ZodObject<
    {
        seconds: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    },
    z.core.$strip
>;
export declare const conditionConfigSchema: z.ZodObject<
    {
        operator: z.ZodDefault<
            z.ZodEnum<{
                and: 'and';
                or: 'or';
            }>
        >;
    },
    z.core.$strip
>;
export declare const runCommandInContainerConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        command: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        workdir: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        user: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        continueOnError: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const httpRequestConfigSchema: z.ZodObject<
    {
        url: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodURL,
                ]
            >
        >;
        method: z.ZodDefault<
            z.ZodEnum<{
                DELETE: 'DELETE';
                GET: 'GET';
                HEAD: 'HEAD';
                PATCH: 'PATCH';
                POST: 'POST';
                PUT: 'PUT';
            }>
        >;
        headers: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        id: z.ZodString;
                        key: z.ZodUnion<
                            readonly [
                                z.ZodObject<
                                    {
                                        nodeId: z.ZodString;
                                        inputKey: z.ZodString;
                                        labelKey: z.ZodString;
                                        nodeType: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                >,
                                z.ZodString,
                            ]
                        >;
                        value: z.ZodUnion<
                            readonly [
                                z.ZodObject<
                                    {
                                        nodeId: z.ZodString;
                                        inputKey: z.ZodString;
                                        labelKey: z.ZodString;
                                        nodeType: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                >,
                                z.ZodString,
                            ]
                        >;
                    },
                    z.core.$strip
                >
            >
        >;
        body: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        expectedStatus: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        continueOnError: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const updateCommitStatusConfigSchema: z.ZodObject<
    {
        state: z.ZodDefault<
            z.ZodEnum<{
                error: 'error';
                failure: 'failure';
                pending: 'pending';
                success: 'success';
            }>
        >;
        context: z.ZodUnion<
            readonly [
                z.ZodObject<
                    {
                        nodeId: z.ZodString;
                        inputKey: z.ZodString;
                        labelKey: z.ZodString;
                        nodeType: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                >,
                z.ZodDefault<z.ZodString>,
            ]
        >;
        description: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const tagImageConfigSchema: z.ZodObject<
    {
        sourceImage: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        targetTag: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const scanImageConfigSchema: z.ZodObject<
    {
        image: z.ZodDefault<z.ZodString>;
        trivyVersion: z.ZodDefault<z.ZodString>;
        severity: z.ZodDefault<
            z.ZodEnum<{
                CRITICAL: 'CRITICAL';
                HIGH: 'HIGH';
                LOW: 'LOW';
                MEDIUM: 'MEDIUM';
            }>
        >;
        exitOnVulnerabilities: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const pruneImagesConfigSchema: z.ZodObject<
    {
        filter: z.ZodOptional<z.ZodString>;
        olderThan: z.ZodOptional<z.ZodString>;
        dangling: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const pruneBuildCacheConfigSchema: z.ZodObject<
    {
        all: z.ZodDefault<z.ZodBoolean>;
        keepStorage: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const pruneContainersConfigSchema: z.ZodObject<
    {
        olderThan: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const pruneVolumesConfigSchema: z.ZodObject<
    {
        all: z.ZodDefault<z.ZodBoolean>;
        filter: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const deleteImageConfigSchema: z.ZodObject<
    {
        imageId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        force: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const deleteNetworkConfigSchema: z.ZodObject<
    {
        networkId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        force: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const deleteVolumeConfigSchema: z.ZodObject<
    {
        volumeName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        force: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const downloadFileConfigSchema: z.ZodObject<
    {
        url: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        destinationPath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        filename: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const backupVolumeBucketStorageConfigSchema: z.ZodObject<
    {
        volumeName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        accountId: z.ZodDefault<z.ZodString>;
        bucket: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const updateServiceConfigSchema: z.ZodObject<
    {
        serviceId: z.ZodDefault<z.ZodString>;
        serviceName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        image: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        forceUpdate: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const scaleServiceConfigSchema: z.ZodObject<
    {
        serviceId: z.ZodDefault<z.ZodString>;
        serviceName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        replicas: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    },
    z.core.$strip
>;
export declare const createServiceConfigSchema: z.ZodObject<
    {
        serviceName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        imageName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        mode: z.ZodDefault<
            z.ZodEnum<{
                global: 'global';
                replicated: 'replicated';
            }>
        >;
        replicas: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        portsSource: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodArray<
                        z.ZodObject<
                            {
                                publishedPort: z.ZodCoercedNumber<unknown>;
                                targetPort: z.ZodCoercedNumber<unknown>;
                                protocol: z.ZodDefault<
                                    z.ZodEnum<{
                                        tcp: 'tcp';
                                        udp: 'udp';
                                    }>
                                >;
                            },
                            z.core.$strip
                        >
                    >,
                ]
            >
        >;
        ports: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        publishedPort: z.ZodCoercedNumber<unknown>;
                        targetPort: z.ZodCoercedNumber<unknown>;
                        protocol: z.ZodDefault<
                            z.ZodEnum<{
                                tcp: 'tcp';
                                udp: 'udp';
                            }>
                        >;
                    },
                    z.core.$strip
                >
            >
        >;
        envVarsSource: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodArray<
                        z.ZodObject<
                            {
                                key: z.ZodString;
                                value: z.ZodString;
                            },
                            z.core.$strip
                        >
                    >,
                ]
            >
        >;
        envVars: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        key: z.ZodString;
                        value: z.ZodString;
                    },
                    z.core.$strip
                >
            >
        >;
        networks: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        value: z.ZodString;
                    },
                    z.core.$strip
                >
            >
        >;
        constraints: z.ZodDefault<
            z.ZodArray<
                z.ZodObject<
                    {
                        value: z.ZodString;
                    },
                    z.core.$strip
                >
            >
        >;
    },
    z.core.$strip
>;
export declare const checkContainerLogsConfigSchema: z.ZodObject<
    {
        containerId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        pattern: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        since: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        failIfFound: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const cacheRestoreConfigSchema: z.ZodObject<
    {
        volumeName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        cachePath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        cacheKey: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const cacheSaveConfigSchema: z.ZodObject<
    {
        volumeName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        sourcePath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        cacheKey: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const gitTagConfigSchema: z.ZodObject<
    {
        tagName: z.ZodDefault<z.ZodString>;
        message: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        remote: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const gitCloneExtraConfigSchema: z.ZodObject<
    {
        repoUrl: z.ZodDefault<z.ZodString>;
        branch: z.ZodDefault<z.ZodString>;
        targetDir: z.ZodDefault<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const cherryPickCommitConfigSchema: z.ZodObject<
    {
        commitHash: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        targetBranch: z.ZodDefault<z.ZodString>;
        noCommit: z.ZodDefault<z.ZodBoolean>;
        remote: z.ZodDefault<z.ZodString>;
    },
    z.core.$strip
>;
export declare const mergeBranchConfigSchema: z.ZodObject<
    {
        sourceBranch: z.ZodDefault<z.ZodString>;
        targetBranch: z.ZodDefault<z.ZodString>;
        strategy: z.ZodDefault<
            z.ZodEnum<{
                merge: 'merge';
                squash: 'squash';
            }>
        >;
        message: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        remote: z.ZodDefault<z.ZodString>;
        push: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const createReleaseConfigSchema: z.ZodObject<
    {
        tagName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        targetBranch: z.ZodDefault<z.ZodString>;
        releaseTitle: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        releaseNotes: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        draft: z.ZodDefault<z.ZodBoolean>;
        prerelease: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const sonarqubeScanConfigSchema: z.ZodObject<
    {
        mode: z.ZodDefault<
            z.ZodEnum<{
                custom: 'custom';
                local: 'local';
            }>
        >;
        projectKey: z.ZodDefault<z.ZodString>;
        token: z.ZodDefault<z.ZodString>;
        sources: z.ZodDefault<z.ZodString>;
        exclusions: z.ZodOptional<z.ZodString>;
        qualityGate: z.ZodDefault<z.ZodBoolean>;
        enforceMinScore: z.ZodDefault<z.ZodBoolean>;
        scoreMetric: z.ZodDefault<
            z.ZodEnum<{
                branch_coverage: 'branch_coverage';
                coverage: 'coverage';
                line_coverage: 'line_coverage';
            }>
        >;
        minScore: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        timeoutSeconds: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        serverUrl: z.ZodDefault<z.ZodString>;
        organization: z.ZodOptional<z.ZodString>;
        sonarqubeVersion: z.ZodDefault<z.ZodString>;
        sonarqubePort: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    },
    z.core.$strip
>;
export declare const fetchSecretsVaultConfigSchema: z.ZodObject<
    {
        endpoint: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        token: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        secretPath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        kvVersion: z.ZodDefault<
            z.ZodEnum<{
                v1: 'v1';
                v2: 'v2';
            }>
        >;
        namespace: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const fetchSecretsDopplerConfigSchema: z.ZodObject<
    {
        serviceToken: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        project: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        config: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const fetchSecretsInfisicalConfigSchema: z.ZodObject<
    {
        siteUrl: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        authMethod: z.ZodDefault<
            z.ZodEnum<{
                'access-token': 'access-token';
                'universal-auth': 'universal-auth';
            }>
        >;
        clientId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        clientSecret: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        accessToken: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        projectId: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        environment: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        secretPath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        recursive: z.ZodDefault<z.ZodBoolean>;
        expandSecretReferences: z.ZodDefault<z.ZodBoolean>;
        includeImports: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const addDomainConfigSchema: z.ZodObject<
    {
        host: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        path: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        internalPath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        stripPath: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodBoolean,
                ]
            >
        >;
        containerName: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        containerPort: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodNumber,
                ]
            >
        >;
        https: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodBoolean,
                ]
            >
        >;
        certificateId: z.ZodOptional<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
        cloudflareCredentialId: z.ZodOptional<z.ZodString>;
        cloudflareZoneId: z.ZodOptional<z.ZodString>;
        cloudflareZoneName: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export declare const removeDomainConfigSchema: z.ZodObject<
    {
        host: z.ZodDefault<
            z.ZodUnion<
                readonly [
                    z.ZodObject<
                        {
                            nodeId: z.ZodString;
                            inputKey: z.ZodString;
                            labelKey: z.ZodString;
                            nodeType: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                    >,
                    z.ZodString,
                ]
            >
        >;
    },
    z.core.$strip
>;
export declare const triggerStageBuildConfigSchema: z.ZodObject<
    {
        stageId: z.ZodDefault<z.ZodString>;
        stageName: z.ZodDefault<z.ZodString>;
        triggerOnFailure: z.ZodDefault<z.ZodBoolean>;
    },
    z.core.$strip
>;
export declare const addSslCertificateConfigSchema: z.ZodObject<
    {
        certType: z.ZodDefault<
            z.ZodEnum<{
                CUSTOM: 'CUSTOM';
                LETS_ENCRYPT: 'LETS_ENCRYPT';
            }>
        >;
        name: z.ZodDefault<z.ZodString>;
        domain: z.ZodDefault<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        agreedToTos: z.ZodDefault<z.ZodBoolean>;
        certificate: z.ZodOptional<z.ZodString>;
        privateKey: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
