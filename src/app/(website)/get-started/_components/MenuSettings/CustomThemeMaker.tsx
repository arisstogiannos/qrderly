import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

export default function CustomThemeMaker({
  defaultColors,
}: {
  defaultColors?: string[];
}) {
  const variables = ["background", "secondary", "primary", "text"];
  const [defaultValues, setDefaultValues] = useState<string[]>(
    defaultColors ?? []
  );

  useEffect(() => {
    if (!defaultColors) {
      const root = document.querySelector(":root") as HTMLElement;
      var rs = getComputedStyle(root);
      const defaultValuesArr: string[] = [];
      variables.forEach((varName) => {
        const variable = "--" + varName + "-mockup";
        const color = rs.getPropertyValue(variable);
        defaultValuesArr.push(color);
      });

      setDefaultValues(defaultValuesArr);
    }
  }, []);

  function handleColorChange(color: string, varName: string) {
    const root = document.querySelector(":root") as HTMLElement;
    const variable = "--" + varName + "-mockup";
    if (root) {
      root.style.setProperty(variable, color);
    }
  }

  return (
    <div className="grid gap-3 w-52 transition-all">
      <p className="text-sm sm:text-base text-muted-foreground">Custom</p>
      {variables.map((v, i) => (
        <div key={v} className="flex gap-2">
          <Label
            htmlFor={v}
            className="cursor-pointer flex justify-between w-full"
          >
            {v}
            <Input
              onChange={(e) => handleColorChange(e.target.value, v)}
              name={v}
              defaultValue={defaultValues[i]}
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
