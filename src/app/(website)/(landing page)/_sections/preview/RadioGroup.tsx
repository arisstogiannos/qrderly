"use client";
import { Label } from "@/components/ui/label";
import React from "react";
import ColorPicker from "./ColorPicker";
import { ReadonlyURLSearchParams } from "next/navigation";

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
function updateSearchParams(name: string, value: string) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  // Update or add the parameter
  searchParams.set(name, value);

  // Replace the current URL without reloading the page
  history.replaceState(null, "", `${url.pathname}?${searchParams.toString()}`);
}
