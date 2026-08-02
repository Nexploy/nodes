'use client';

import { useNodeEnvironments } from '@nexploy/nodes/ui/adapter';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@nexploy/nodes/vendor/ui/components/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@nexploy/nodes/vendor/ui/components/select';

export function SetEnvironmentConfig() {
    const t = useTranslations('repository.pipeline.config');
    const { control } = useFormContext();
    const environments = useNodeEnvironments();

    return (
        <FormField
            control={control}
            name="environmentId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('environment')}</FormLabel>
                    <Select {...field} onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger className={'w-full'}>
                                <SelectValue placeholder={t('selectEnvironment')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('environment')}</SelectLabel>
                                {environments.map((env) => (
                                    <SelectItem key={env.id} value={env.id}>
                                        {env.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
}
