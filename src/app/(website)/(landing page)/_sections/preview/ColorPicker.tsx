"use client";

import { Template } from "@prisma/client";

export default function ColorPicker({
  value,
  i,
  template
}: {
  value: string;
  i: number;
  template:Template
}) {
  const variables = ["primary", "background", "secondary", "text"];

  function handleColorChange(color: string) {
    const root = document.querySelector(":root") as HTMLElement;
    const variable = "--" + variables[i] + "-mockup";
    if (root) {
      root.style.setProperty(variable, color);
    }
  }
  

  return (
    <input
      type="color"
      onChange={(e) => handleColorChange(e.target.value)}
      name={"color"}
      defaultValue={value}
      className="rounded-lg border-none appearance-none max-sm:w-10"
    />
  );
}
