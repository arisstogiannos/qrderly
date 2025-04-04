"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Options({
  defaultOptions,
}: {
  defaultOptions?: string;
}) {
  const serializeOptions = (opts: { name: string; values: string[] }[]) => {
    return opts
      .map((opt) => `${opt.name}__${opt.values.join("---")}`)
      .join("/+/");
  };

  // Function to convert string back to array
  const deserializeOptions = (str: string) => {
    if (!str) return [];
    return str.split("/+/").map((opt) => {
      const [name, values] = opt.split("__");
      return { name, values: values ? values.split("---") : [] };
    });
  };

  
  const defaultOptionsDeserialized = deserializeOptions(defaultOptions || "");
  const [options, setOptions] = useState<{ name: string; values: string[] }[]>(
    defaultOptions ? defaultOptionsDeserialized : []
  );

  // Function to convert array to string for database storage

  // Add a new option
  const addOption = () => {
    setOptions([...options, { name: "New Option", values: ["New Value"] }]);
  };

  // Update option name
  const updateOptionName = (index: number, newName: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, name: newName } : opt))
    );
  };

  // Update option value
  const updateOptionValue = (
    index: number,
    valueIndex: number,
    newValue: string
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index
          ? {
              ...opt,
              values: opt.values.map((val, j) =>
                j === valueIndex ? newValue : val
              ),
            }
          : opt
      )
    );
  };


  // Add a new value to an option
  const addValue = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index ? { ...opt, values: [...opt.values, "New Value"] } : opt
      )
    );
  };

  if (!options.length) {
    return (
      <Button onClick={addOption}>
        Add Option
        <Plus />
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {options.map((option, i) => (
        <div
          key={i}
          className="flex flex-col  gap-4 p-3 border-accent border-2 rounded-xl"
        >
          {/* Option Name Input */}
          <Input
            value={option.name}
            onChange={(e) => updateOptionName(i, e.target.value)}
            placeholder="Option Name"
          />

          {/* Option Values */}
          <div className="flex flex-col gap-2 min-w-40">
            {option.values.map((value, j) => (
              <div key={j} className="flex gap-4">

              <Input
                value={value}
                onChange={(e) => updateOptionValue(i, j, e.target.value)}
                placeholder="Option Value"
                />
              <Input
                value={value}
                onChange={(e) => updateOptionValue(i, j, e.target.value)}
                placeholder="Extra Price"
                />
                </div>
            ))}

            {/* Add Value Button */}
            <Button type="button" onClick={() => addValue(i)}>
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
