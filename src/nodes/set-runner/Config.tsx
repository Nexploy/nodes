'use client';

import { useNodeResource } from '@nexploy/nodes/ui/adapter';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@nexploy/nodes/vendor/ui/components/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@nexploy/nodes/vendor/ui/components/select';
import { Switch } from '@nexploy/nodes/vendor/ui/components/switch';
import { Status, StatusIndicator } from '@nexploy/nodes/vendor/ui/components/kibo-ui/status';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface BuildRunnerOption {
    id: string;
    name: string;
    enabled: boolean;
    status: 'OFFLINE' | 'ONLINE' | 'DRAINING';
    maxConcurrency: number;
}

interface RegistryOption {
    id: string;
    name: string;
    url: string;
}

export function SetRunnerConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    const { data: runners = [], isLoading } = useNodeResource<BuildRunnerOption[]>('/api/build-runners');
    const { data: registries = [] } = useNodeResource<RegistryOption[]>('/api/registries');

    return (
        <div className="flex flex-col gap-4">
            <FormField
                control={form.control}
                name="runnerId"
                render={({ field }) => {
                    const isStale = !isLoading && !!field.value && !runners.find((runner) => runner.id === field.value);

                    return (
                        <FormItem>
                            <FormLabel>{t('buildRunner')}</FormLabel>
                            <FormControl>
                                <Select
                                    {...field}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue(
                                            'runnerName',
                                            runners.find((runner) => runner.id === value)?.name ?? '',
                                        );
                                    }}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className={'w-full overflow-hidden pl-0! data-[placeholder]:pl-3!'}>
                                        {isLoading ? (
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin"/>
                                                {t('buildRunnersLoading')}
                                            </span>
                                        ) : isStale ? (
                                            <span className="flex items-center gap-1.5">
                                                <AlertTriangle className="h-3 w-3 shrink-0"/>
                                                {t('buildRunnerUnavailable')}
                                            </span>
                                        ) : (
                                            <SelectValue placeholder={t('selectBuildRunner')}/>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{t('buildRunner')}</SelectLabel>
                                            {runners.length === 0 ? (
                                                <span className="text-muted-foreground px-2 py-1.5 text-sm">
                                                    {t('noBuildRunnersFound')}
                                                </span>
                                            ) : (
                                                runners.map((runner) => (
                                                    <SelectItem key={runner.id} value={runner.id} className="pl-0">
                                                        <Status
                                                            className="m-0 w-full rounded-none border-0 p-0 pl-2.5 text-sm"
                                                            status={
                                                                runner.enabled && runner.status === 'ONLINE'
                                                                    ? 'online'
                                                                    : 'offline'
                                                            }
                                                            variant="outline"
                                                        >
                                                            <StatusIndicator className="pl-2"/>
                                                            <span className="truncate">{runner.name}</span>
                                                        </Status>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    );
                }}
            />

            <FormField
                control={form.control}
                name="registryId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('runnerRegistry')}</FormLabel>
                        <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger className={'w-full overflow-hidden'}>
                                    <SelectValue placeholder={t('selectRunnerRegistry')}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t('runnerRegistry')}</SelectLabel>
                                        {registries.length === 0 ? (
                                            <span className="text-muted-foreground px-2 py-1.5 text-sm">
                                                {t('noRunnerRegistryFound')}
                                            </span>
                                        ) : (
                                            registries.map((registry) => (
                                                <SelectItem key={registry.id} value={registry.id}>
                                                    {registry.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>{t('runnerRegistryDescription')}</FormDescription>
                        <FormMessage className="text-xs"/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="fallbackToLocal"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange}/>
                        </FormControl>
                        <div>
                            <FormLabel className="cursor-pointer">{t('runnerFallbackToLocal')}</FormLabel>
                            <FormDescription>{t('runnerFallbackToLocalDescription')}</FormDescription>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
}
