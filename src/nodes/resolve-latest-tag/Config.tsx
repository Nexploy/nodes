'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@nexploy/nodes/vendor/ui/components/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import { RefAware } from '@nexploy/nodes/ui/RefAware';

export function ResolveLatestTagConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('resolveTagRepoUrl')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('resolveTagRepoUrlPlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('resolveTagPattern')}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="v*" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="excludePrereleases"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>{t('resolveTagExcludePrereleases')}</FormLabel>
                    </FormItem>
                )}
            />
        </div>
    );
}
