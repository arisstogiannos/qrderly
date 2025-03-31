import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/Messages";
import { Menu, Template } from "@prisma/client";
import CustomThemeMaker from "./CustomThemeMaker";

const themes = {
  T1: [
    "#111111,#161616,#591F5E,#F1F1F1",
    "#E3DCD5,#483832,#735045,#f1f1f1,#2a1d11",
    "#CBD2A4,#E9EED9,#9A7E6F,#54473F",
    "#371330,#133086,#441b32#f1f1f1",
  ],
  T2: [
    "#111111,#202020,#591F5E,#F1F1F1",
    "#E3DCD5,#c1b2aa,#735045,#111111,#2a1d11",
    "#CBD2A4,#E9EED9,#9A7E6F,#54473F",
    "#371330,#133086,#441b32#f1f1f1",
  ],
};

export default function ThemeSettings({
  menu,
  template,
  errors,
}: {
  menu?: Menu;
  template: Template;
  errors: string[] | undefined;
}) {
  const [selectedTheme, setSelectedTheme] = useState<string>(
    menu?.theme ?? themes[template][0]
  );

  function handleThemeChange(theme: string) {
    const themeColors = theme.split(",");
    const variables = ["background", "secondary", "primary", "text"];

    const root = document.querySelector(":root") as HTMLElement;
    themeColors.forEach((c, i) => {
      const variable = "--" + variables[i] + "-mockup";
      if (root) {
        root.style.setProperty(variable, c);
      }
    });
    setSelectedTheme(theme);
  }

  useEffect(() => {
    handleThemeChange(menu?.theme ?? themes[template][0]);
  }, [template]);

  return (
    <div className="grid gap-3 ">
      <div>
        <p>Theme</p>
        {/* <p className="text-sm sm:text-base text-muted-foreground">
        Change the appearance of your menu by selecting between light, dark
        and custom themes for a more personalized look
        </p> */}
        <p className="text-sm sm:text-base text-muted-foreground">Default</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {themes[template].map((theme) => {
          const colors = theme.split(",", 3);
          return (
            <label key={theme} className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={selectedTheme === theme}
                className="hidden peer"
                onChange={() => handleThemeChange(theme)}
              />
              <div
                className={`size-24 overflow-hidden rounded-3xl grid grid-cols-3 border-4 transition-all peer-checked:border-black border-transparent`}
              >
                {colors.map((color) => (
                  <div key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
            </label>
          );
        })}
        <label key={"custom"} id="custom-theme" className="cursor-pointer">
          <input
            type="radio"
            name="theme"
            value={"custom"}
            checked={selectedTheme === "custom"}
            className="hidden peer"
            onChange={(e) => setSelectedTheme("custom")}
          />
          <div
            className={`size-24 overflow-hidden rounded-3xl peer-checked:text-black  border-4 transition-all peer-checked:border-black border-muted-foreground/50 flex-center text-muted-foreground/50`}
          >
            <Plus strokeWidth={"3px"} />
          </div>
        </label>
      </div>
      {selectedTheme === "custom" && (
        <CustomThemeMaker defaultColors={menu?.theme.split(",")} />
      )}
      {errors?.map((er) => {
        return (
          <ErrorMessage
            key={er}
            classNames="text-sm bg-transparent p-0 "
            msg={er}
          />
        );
      })}
    </div>
  );
}
