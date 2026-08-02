'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nexploy/nodes/vendor/ui/components/form';
import { Input } from '@nexploy/nodes/vendor/ui/components/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@nexploy/nodes/vendor/ui/components/select';
import { VOLUME_DRIVERS } from '@nexploy/nodes/vendor/shared/dockerConstants';
import { RefAware } from '@nexploy/nodes/ui/RefAware';

export function CreateVolumeConfig() {
    const t = useTranslations('repository.pipeline.config');
    const tDocker = useTranslations('docker');
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('volumeName')}</FormLabel>
                        <FormControl>
                            <RefAware value={field.value} onChange={field.onChange}>
                                <Input {...field} placeholder={t('volumeNamePlaceholder')} />
                            </RefAware>
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('volumeDriver')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectDriver')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('volumeDriver')}</SelectLabel>
                                    {VOLUME_DRIVERS.map((driver) => (
                                        <SelectItem key={driver} value={driver}>
                                            {tDocker(`volumeDrivers.${driver}`)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        </div>
    );
}
