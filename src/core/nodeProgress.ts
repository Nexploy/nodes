import { NodeProgressTracker, NodeReportValues, NodeSummary, PipelineReporter } from '@nexploy/nodes/core/pipeline';

export function createProgressTracker(reporter: PipelineReporter, nodeId: string, total: number): NodeProgressTracker {
    let current = 0;
    let lastLabelKey = '';
    let lastLabelValues: NodeReportValues | undefined;

    return {
        async step(labelKey: string, labelValues?: NodeReportValues, detail?: string) {
            current = Math.min(current + 1, total);
            lastLabelKey = labelKey;
            lastLabelValues = labelValues;
            await reporter.reportProgress(nodeId, { current, total, labelKey, labelValues, detail });
        },
        async detail(detail: string) {
            if (!lastLabelKey) return;
            await reporter.reportProgress(nodeId, {
                current,
                total,
                labelKey: lastLabelKey,
                labelValues: lastLabelValues,
                detail,
            });
        },
        async done() {
            if (!lastLabelKey) return;
            current = total;
            await reporter.reportProgress(nodeId, {
                current,
                total,
                labelKey: lastLabelKey,
                labelValues: lastLabelValues,
            });
        },
    };
}

export function summary(key: string, values?: NodeReportValues, tone?: NodeSummary['tone']): NodeSummary {
    return { key, values, tone };
}

export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'kB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;
    return `${value >= 100 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
}
