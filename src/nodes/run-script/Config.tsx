'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@nexploy/nodes/vendor/ui/components/checkbox';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import { Textarea } from '@nexploy/nodes/vendor/ui/components/textarea';
import { RefAware } from '@nexploy/nodes/ui/RefAware';

export function RunScriptConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('runScriptImage')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('runScriptImagePlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormDescription>{t('runScriptImageDescription')}</FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="command"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('runScriptCommand')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Textarea {...field} placeholder={t('runScriptCommandPlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="workingDirectory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('runScriptWorkingDirectory')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('runScriptWorkingDirectoryPlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="timeoutSeconds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('runScriptTimeout')}</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                onChange={(event) => field.onChange(Number(event.target.value))}
                            />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="continueOnError"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>{t('runScriptContinueOnError')}</FormLabel>
                    </FormItem>
                )}
            />
        </div>
    );
}
