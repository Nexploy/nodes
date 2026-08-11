'use client';

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
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import { Switch } from '@nexploy/nodes/vendor/ui/components/switch';
import { BranchSelect } from '@nexploy/nodes/ui/BranchSelect';

export function CloneRepositoryConfig() {
    const t = useTranslations('repository.pipeline.config');
    const tCommon = useTranslations('common');

    const form = useFormContext();

    return (
        <div className="space-y-4">
            <BranchSelect name="branch" label={t('cloneBranch')} autoSelectFirst />

            <FormField
                control={form.control}
                name="commitHash"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            {t('cloneCommitHash')}
                            <span className="text-muted-foreground text-xs">{tCommon('optional')}</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={t('cloneCommitHashPlaceholder')}
                            />
                        </FormControl>
                        <FormDescription>{t('cloneCommitHashDescription')}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="submodules"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4">
                        <FormLabel className={'cursor-pointer'}>
                            <div className={'flex flex-col gap-1'}>
                                {t('cloneSubmodules')}
                                <FormDescription className={'text-xs'}>
                                    {t('cloneSubmodulesDescription')}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    className={'cursor-pointer'}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormLabel>
                    </FormItem>
                )}
            />
        </div>
    );
}
