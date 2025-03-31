"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useMemo, useState } from "react";

// Define Option Type
type Option = {
  name: string;
  type: "single" | "multiple";
  values: { name: string; price: string }[];
};

// Deserialize JSON string into Option array
const deserializeOptions = (str: string | undefined): Option[] => {
  try {
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};

// Deserialize user-selected values into an object for easy lookup
const stringToJson = (str: string | undefined): Record<string, string> => {
  if (!str) return {};

  return str.split(", ").reduce((acc, pair) => {
    const [name, value] = pair.split(":");
    if (!acc[name]) acc[name] = value;
    // acc[name].push(value);
    return acc;
  }, {} as Record<string, string>);
};

export default function Options({
  options,
  existingOptions,
  price,setPrice
}: {
  options: string;
  existingOptions: string | undefined;
  price:number,
  setPrice:React.Dispatch<React.SetStateAction<number>>;
}) {
  // Deserialize options and existing selections
  const deserializedOptions = useMemo(
    () => deserializeOptions(options),
    [options]
  );
  const deserializedValues = useMemo(
    () => stringToJson(existingOptions),
    [existingOptions]
  );
  return (
    <div className="space-y-7">
      {deserializedOptions.map((option,i) => (
        <div key={i} className="grid gap-4">
          <Label
            htmlFor={option.name}
            className="text-base capitalize font-normal"
          >
            {option.name}
          </Label>

          {option.type === "single" ? (
            <DefaultRadioGroup
              name={option.name}
              setPrice={setPrice}
              defaultValue={deserializedValues[option.name] ?? ""}
            >
              {option.values.map((value,i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={value.name }
                    className="border-primary"

                  />
                  <Label className="text-base capitalize font-normal">
                    {value.name}{" "}
                    {value.price !== "0" && (
                      <span className="text-muted">(+${value.price})</span>
                    )}
                  </Label>
                </div>
              ))}
            </DefaultRadioGroup>
          ) : (
            <MultipleChoiceGroup
              name={option.name}
              values={option.values}
              defaultValues={deserializedValues[option.name]?.split("+") ?? []}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ✅ Default Radio Group Component
interface DefaultRadioGroupProps {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}
export function DefaultRadioGroup({
  name,
  defaultValue,
  children,
  setPrice,
}: DefaultRadioGroupProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleChange(e: string) {
    setValue(e);
  }

  return (
    <RadioGroup
      name={name}
      value={value}
      onValueChange={handleChange}
      className="space-y-2"
    >
      {children}
    </RadioGroup>
  );
}

// ✅ Multiple Choice Group Component
interface MultipleChoiceGroupProps {
  name: string;
  values: { name: string; price: string }[];
  defaultValues: string[];
}

export function MultipleChoiceGroup({
  name,
  values,
  defaultValues,
}: MultipleChoiceGroupProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);
  console.log(selectedValues);
  useEffect(() => {
    setSelectedValues(defaultValues);
  }, [defaultValues]);

  const handleChange = (name: string) => {
    setSelectedValues((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-2">
      {values.map((value,i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox
            id={`${name}-${value.name}`}
            checked={selectedValues?.includes(value.name)}
            onCheckedChange={() => handleChange(value.name)}
          />
          <Label
            htmlFor={`${name}-${value.name}`}
            className="text-base capitalize font-normal"
          >
            {value.name} {value.price && `(+${value.price})`}
          </Label>
        </div>
      ))}
      <input
        type="hidden"
        hidden
        name={name}
        defaultValue={selectedValues?.join("+")}
      />
    </div>
  );
}
