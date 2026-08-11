'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { BranchSelect } from '@nexploy/nodes/ui/BranchSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import { Switch } from '@nexploy/nodes/vendor/ui/components/switch';
import { RefAware } from '@nexploy/nodes/ui/RefAware';

export function CherryPickCommitConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="commitHash"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('cherryPickCommitHash')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('cherryPickCommitHashPlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <BranchSelect name="targetBranch" label={t('cherryPickTargetBranch')} />
            <FormField
                control={form.control}
                name="remote"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('gitRemote')}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder={t('gitRemotePlaceholder')} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="noCommit"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                        <FormLabel>{t('cherryPickNoCommit')}</FormLabel>
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
