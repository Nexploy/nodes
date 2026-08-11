'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { BranchSelect } from '@nexploy/nodes/ui/BranchSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import { Textarea } from '@nexploy/nodes/vendor/ui/components/textarea';
import { Switch } from '@nexploy/nodes/vendor/ui/components/switch';
import { RefAware } from '@nexploy/nodes/ui/RefAware';

export function CreateReleaseConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('releaseTagName')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('releaseTagNamePlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <BranchSelect name="targetBranch" label={t('releaseTargetBranch')} autoSelectFirst />
            <FormField
                control={form.control}
                name="releaseTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('releaseTitle')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('releaseTitlePlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="releaseNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('releaseNotes')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Textarea {...field} placeholder={t('releaseNotesPlaceholder')} rows={5} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="draft"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                        <FormLabel>{t('releaseDraft')}</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="prerelease"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                        <FormLabel>{t('releasePrerelease')}</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        </div>
    );
}
