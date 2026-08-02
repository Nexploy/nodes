'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';

export function DelayConfig() {
    const t = useTranslations('repository.pipeline.config');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="seconds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('delaySeconds')}</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min={1} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        </div>
    );
}
