'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function AddLanguageComboBox<T extends Record<string, string>>({
  list,
  valueKey,
  labelKey,
  onSelect,
  selectedLanguages,
}: {
  list: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  onSelect: (v: string) => void;
  selectedLanguages: string[];
}) {
  const formattedList = list.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const t = useTranslations('menu settings');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal"
        >
          {t('Add Language')}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={value}
            onValueChange={setValue}
            placeholder={t('Search Language')}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {formattedList.map((item) => (
                <CommandItem key={item.value} value={item.label} onSelect={onSelect}>
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedLanguages.includes(item.value) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ComboBox<T extends Record<string, string>>({
  list,
  valueKey,
  labelKey,
  placeholder,
  onSelect,
  defaultValue,
}: {
  list: T[];
  placeholder: string;
  valueKey: keyof T;
  labelKey: keyof T;
  onSelect?: (v: string) => void;
  defaultValue?: string;
}) {
  const formattedList = list.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<undefined | string>(defaultValue);

  return (
    <>
      <input required type="hidden" defaultValue={value} name="defaultLanguage" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between font-normal"
          >
            {value ? formattedList.find((item) => item.value === value)?.label : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {formattedList.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue === value
                          ? ''
                          : formattedList.find((item) => item.label === currentValue)?.value,
                      );
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
