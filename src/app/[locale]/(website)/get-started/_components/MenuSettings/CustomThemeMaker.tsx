import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

export default function CustomThemeMaker({
  defaultColors,
}: {
  defaultColors: string[];
}) {
  const variables = ["background", "secondary", "primary", "text"];
  const [colors, setColors] = useState<string[]>(defaultColors);

  useEffect(() => {
    setColors(defaultColors);
  }, [defaultColors]);

  function handleColorChange(color: string, index: number, varName: string) {
    const root = document.querySelector(":root") as HTMLElement;
    const variable = "--" + varName + "-mockup";
    if (root) {
      root.style.setProperty(variable, color);
    }

    const updatedColors = [...colors];
    updatedColors[index] = color;
    setColors(updatedColors);
  }

  return (
    <div className="grid gap-3 w-52 transition-all">
      <p className="text-sm sm:text-base text-muted-foreground">Customize</p>
      {variables.map((v, i) => (
        <div key={v} className="flex gap-2">
          <Label
            htmlFor={v}
            className="cursor-pointer flex justify-between w-full"
          >
            {v}
            <Input
              value={colors[i]}
              onChange={(e) => handleColorChange(e.target.value, i, v)}
              name={v}
              type="color"
              id={v}
              className=" w-28"
            />
          </Label>
        </div>
      ))}
    </div>
  );
}
