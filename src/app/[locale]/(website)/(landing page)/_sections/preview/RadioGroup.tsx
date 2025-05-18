"use client";
import { Label } from "@/components/ui/label";
import React from "react";
import ColorPicker from "./ColorPicker";
import type { ReadonlyURLSearchParams } from "next/navigation";
import updateSearchParams from "@/lib/updateSearchParams";

export default function RadioGroup({
  name,
  values,
  searchParams,
}: {
  name: string;
  values: { param: string; name: string }[];
  searchParams: ReadonlyURLSearchParams;
}) {
  return values.map((value, i) => (
    <Label
      key={value.name}
      className="border-b-foreground/10 flex items-center text-sm md:text-base text-background/20 gap-2 border-2 border-background/20 px-4 py-2 rounded-lg cursor-pointer has-checked:border-primary has-checked:text-primary"
    >
      <input
        type="radio"
        defaultValue={value.param}
        defaultChecked={i === 0}
        name={name} // Ensure all radios share the same name
        className="peer hidden"
        onChange={(e) => updateSearchParams(name[0], e.target.value)}
      />

      {value.name}
    </Label>
  ));
}
