"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { useCardModalContext } from "@/context/CardModalProvider";
import { Option } from "@/types";
import DisplayPrice from "@/components/DisplayPrice";

// Define Option Type

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

  return str.split(", ").reduce(
    (acc, pair) => {
      const [name, value] = pair.split(":");
      if (!acc[name]) acc[name] = value;
      // acc[name].push(value);
      return acc;
    },
    {} as Record<string, string>
  );
};

export default function Options({
  options,
  existingOptions,
}: {
  options: string;
  existingOptions: string | undefined;
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
      {deserializedOptions.map((option, i) => (
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
              defaultValue={deserializedValues[option.name] ?? ""}
              values={option.values}
            >
              {option.values.map((value, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={value.name}
                    className="border-primary"
                    id={`${option.name}-${value.name}`}
                  />
                  <Label
                    htmlFor={`${option.name}-${value.name}`}
                    className="text-base capitalize font-normal"
                  >
                    {value.name}{" "}
                    {value.price && value.price !== "0" && (
                      <span className="text-foreground/70">
                        <DisplayPrice price={Number(value.price)} />
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </DefaultRadioGroup>
          ) : (
            <MultipleChoiceGroup
              name={option.name}
              values={option.values}
              defaultValues={
                deserializedValues[option.name]?.split(" + ") ?? []
              }
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
  values: { name: string; price: string }[];
}
export function DefaultRadioGroup({
  name,
  defaultValue,
  children,
  values,
}: DefaultRadioGroupProps) {
  const [value, setValue] = useState(defaultValue);
  const [localPrice, setLocalPrice] = useState(0);
  const { setPrice } = useCardModalContext();

  useEffect(() => {
    setValue(defaultValue);
    const price = values.find((v) => v.name === defaultValue)?.price;
    if (price) {
      setLocalPrice(Number(price));
    }
    setPrice((prev) => prev + (Number(price) - localPrice));
  }, [defaultValue]);

  function handleChange(e: string) {
    const price = values.find((v) => v.name === e)?.price;
    setPrice(
      (prev) =>
        prev +
        (Number.isNaN(Number(price) - localPrice)
          ?

            
             (-localPrice)
          : Number(price) - localPrice)
    );
    setValue(e);
    setLocalPrice(!Number.isNaN(Number(price))?Number(price):0);
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
  const [selectedValues, setSelectedValues] = useState<string[] | null>(null);
  const [localPrice, setLocalPrice] = useState(0);

  const { setPrice } = useCardModalContext();

  useEffect(() => {
    if (defaultValues.length > 0 && !selectedValues) {
      setSelectedValues(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    let lp = 0;

    if (selectedValues) {
      for (const value of selectedValues) {
        lp += Number(values.find((v) => v.name === value)?.price ?? 0);
      }
      setPrice((prev) => prev - localPrice + lp);
      setLocalPrice(lp);
    }
  }, [selectedValues]);

  const handleChange = (name: string) => {
    setSelectedValues((prev) =>
      prev?.includes(name)
        ? prev.filter((v) => v !== name)
        : prev
          ? [...prev, name]
          : [name]
    );
  };

  return (
    <div className="space-y-2">
      {values.map((value, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox
            id={`${name}-${value.name}`}
            checked={selectedValues?.includes(value.name)}
            // value={value.name}
            onCheckedChange={() => handleChange(value.name)}
          />
          <Label
            htmlFor={`${name}-${value.name}`}
            className="text-base capitalize font-normal space-x-1"
          >
            <span>{value.name}</span>{" "}
            {value.price && value.price !== "0" ? (
              <span className="text-muted">
                + <DisplayPrice price={parseInt(value.price)} />
              </span>
            ) : (
              ""
            )}
          </Label>
        </div>
      ))}
      <input
        type="hidden"
        hidden
        name={name}
        defaultValue={selectedValues?.join(" + ")}
      />
    </div>
  );
}
