import { z } from 'zod';
export declare const nodeFieldRefSchema: z.ZodObject<
    {
        nodeId: z.ZodString;
        inputKey: z.ZodString;
        labelKey: z.ZodString;
        nodeType: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
>;
export type NodeFieldRef = z.infer<typeof nodeFieldRefSchema>;
export declare function refable<T extends z.ZodTypeAny>(
    schema: T,
): z.ZodUnion<
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
        T,
    ]
>;
export type ResolveRefs<T> = T extends NodeFieldRef
    ? never
    : T extends Array<infer U>
      ? Array<ResolveRefs<U>>
      : T extends object
        ? {
              [K in keyof T]: ResolveRefs<T[K]>;
          }
        : Exclude<T, NodeFieldRef>;
