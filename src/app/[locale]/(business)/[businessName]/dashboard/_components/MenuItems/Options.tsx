'use client';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Options({ defaultOptions }: { defaultOptions?: string }) {
  const serializeOptions = (
    opts: {
      name: string;
      type: string;
      values: { name: string; price: string }[];
    }[],
  ) => {
    return JSON.stringify(opts);
  };

  const deserializeOptions = (str: string) => {
    try {
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  };

  const defaultOptionsDeserialized = deserializeOptions(defaultOptions || '');
  const [options, setOptions] = useState<
    { name: string; type: string; values: { name: string; price: string }[] }[]
  >(defaultOptions ? defaultOptionsDeserialized : []);
  const t = useTranslations('menuItemForm');
  // Add a new option
  const addOption = () => {
    setOptions([
      ...options,
      {
        name: 'New Option',
        type: 'single',
        values: [{ name: 'New Value', price: '0' }],
      },
    ]);
  };

  // Update option name
  const updateOptionName = (index: number, newName: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, name: newName } : opt)));
  };

  // Update option type (Single / Multiple Choice)
  const updateOptionType = (index: number, newType: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, type: newType } : opt)));
  };

  // Update option value name or price
  const updateOptionValue = (
    index: number,
    valueIndex: number,
    field: 'name' | 'price',
    newValue: string,
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index
          ? {
              ...opt,
              values: opt.values.map((val, j) =>
                j === valueIndex ? { ...val, [field]: newValue } : val,
              ),
            }
          : opt,
      ),
    );
  };

  // Add a new value to an option
  const addValue = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index
          ? {
              ...opt,
              values: [...opt.values, { name: 'New Value', price: '0' }],
            }
          : opt,
      ),
    );
  };

  if (!options.length) {
    return (
      <Button onClick={addOption}>
        {t('addOption')}
        <Plus />
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {options.map((option, i) => (
        <div key={i} className="flex flex-col gap-4 p-3 border-accent border-2 rounded-xl">
          <div className="flex gap-4">
            {/* Option Name Input */}
            <Input
              value={option.name}
              onChange={(e) => updateOptionName(i, e.target.value)}
              placeholder="Option Name"
            />

            {/* Option Type (Single/Multiple) */}
            <Select value={option.type} onValueChange={(value) => updateOptionType(i, value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Choice</SelectItem>
                <SelectItem value="multiple">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="border-accent" />
          {/* Option Values */}
          <div className="flex flex-col gap-2 min-w-40">
            <div className="flex justify-between  text-sm pl-2">
              <p>Value</p>
              <p className="w-28 pl-2 ">Extra Price</p>
            </div>
            {option.values.map((value, j) => (
              <div key={j} className="flex gap-4">
                {/* Option Value Name */}
                <Input
                  value={value.name}
                  onChange={(e) => updateOptionValue(i, j, 'name', e.target.value)}
                  placeholder="Option Value"
                />
                {/* Option Value Price */}
                <Input
                  type="number"
                  value={value.price}
                  onChange={(e) => updateOptionValue(i, j, 'price', e.target.value)}
                  placeholder="Price"
                  className="max-w-28"
                />
              </div>
            ))}

            {/* Add Value Button */}
            <Button type="button" className="mt-4" onClick={() => addValue(i)}>
              Add Value
              <Plus />
            </Button>
          </div>
        </div>
      ))}

      {/* Add Option Button */}
      <Button type="button" onClick={addOption}>
        Add Option
        <Plus />
      </Button>

      {/* Show Serialized String (For Debugging) */}
      <input
        name="options"
        value={serializeOptions(options)}
        readOnly
        hidden
        type="text"
        className="mt-4 p-2 border rounded bg-gray-100"
      />
    </div>
  );
}
