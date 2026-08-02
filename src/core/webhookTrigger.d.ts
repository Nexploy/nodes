import { MergeRequestAction, WebhookEventType, WebhookTrigger } from '@nexploy/nodes/core/webhook';
export interface WebhookCloneFilters {
    triggerEvents?: WebhookEventType[];
    branchFilter?: string;
    mergeRequestActions?: MergeRequestAction[];
    tagFilter?: string;
}
export type WebhookSkipReason = 'event-filter' | 'merge-request-action' | 'tag-filter' | 'branch-filter';
export interface WebhookTriggerMatch {
    matched: boolean;
    reason?: WebhookSkipReason;
    detail?: string;
}
export declare function matchesRefFilter(ref: string, filter: string): boolean;
export declare function matchesWebhookTrigger(
    filters: WebhookCloneFilters,
    trigger: WebhookTrigger,
    branch: string,
): WebhookTriggerMatch;
