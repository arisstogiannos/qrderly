"use client";

import { Template } from "@prisma/client";
import { useEffect, useState } from "react";
import { set } from "zod";

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
  const [currColor, setCurrColor] = useState(value);
  useEffect(() => {
    setCurrColor(value);
  }, [value]);

  function handleColorChange(color: string) {
    const root = document.querySelector(":root") as HTMLElement;
    const variable = "--" + variables[i] + "-mockup";
    if (root) {
      root.style.setProperty(variable, color);
    }
    setCurrColor(color);
  }
  

  return (
    <input
      type="color"
      onChange={(e) => handleColorChange(e.target.value)}
      name={"color"}
      value={currColor}
      className="rounded-lg border-none appearance-none max-sm:w-10"
    />
  );
}
