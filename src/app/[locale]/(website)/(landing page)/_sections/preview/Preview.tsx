"use client";
import React, { useEffect, useState } from "react";
import Mockup from "../../../get-started/_components/mockup/Mockup";

import RadioGroup from "./RadioGroup";
import ColorPicker from "./ColorPicker";
import { useSearchParams } from "next/navigation";
import { Template } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { themes } from "@/data";


// const themes = {
//   T1: [
//     "#155E95,#FFFFFF,#111111,#FFFFFF",
//     "#111111,#161616,#591F5E,#F1F1F1",
//     "#E3DCD5,#483832,#735045,#f1f1f1",
//     "#CBD2A4,#E9EED9,#9A7E6F,#54473F",
//     // "#371330,#133086,#441b32#f1f1f1",
//   ],
//   T2: [
//     "#591F5E,#111111,#202020,#F1F1F1",
//     "#E3DCD5,#c1b2aa,#735045,#111111",
//     "#CBD2A4,#E9EED9,#9A7E6F,#54473F",
//     "#371330,#133086,#441b32#f1f1f1",
//   ],
// };

export default  function Preview() {
  const searchParams = useSearchParams();
  const template = (searchParams.get("t") as Template) || "T1";
  const [selectedTheme, setSelectedTheme] = useState(themes[template][0]);
  const t =  useTranslations("preview")

  function handleThemeChange(theme: string) {
    setSelectedTheme(theme);
    const themeColors = theme.split(",");
    const variables = ["background", "secondary", "primary", "text"];

    const root = document.querySelector(":root") as HTMLElement;
    themeColors.forEach((c, i) => {
      const variable = "--" + variables[i] + "-mockup";
      if (root) {
        root.style.setProperty(variable, c);
      }
    });
  }

  useEffect(() => {
    handleThemeChange(themes[template][0]);
  }, [template]);

  return (
    <section className="grid grid-rows-[auto_auto] lg:grid-cols-2 grid-cols-1  gap-20 relative w-full ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[120%] bg-foreground -z-10" />
      <div className="space-y-4 max-sm:hidden">
        <p className="font-medium text-5xl text-background capitalize leading-[1.2]">
          {t("title")}
        </p>
        <p className="text-xl font-normal  text-background/70">
        {t("subtitle")}
        </p>
      </div>
      <div className="w-fit h-fit relative overflow-visible mx-auto  place-self-center lg:col-start-2 lg:row-span-full">
        <div className="bg-radial from-primary/50 from-0% to-80% to-background/5 absolute -top-10 -left-20 w-80 h-48 blur-xl rounded-full" />
        <div className="bg-radial from-primary/40 from-0% to-80% to-background/5 absolute -bottom-10 right-0 [400px]:-right-10 w-80 h-48 blur-xl rounded-3xl" />

        <Mockup initialTemplate="T1" />
      </div>
      <div className="lg:row-start-2">
        <Setting title={t("settings.1")}>
          <RadioGroup
            searchParams={searchParams}
            name={"template"}
            values={[
              { param: "T1", name: t("Template 1") },
              { param: "T2", name: t("Template 2") },
            ]}
          />
        </Setting>
        <Setting title={t("settings.2")}>
          {themes[template].slice(0, 3).map((theme, i) => {
            const colors = theme.split(",", 3);
            return (
              <label key={theme} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  defaultChecked={i === 0}
                  className="hidden peer"
                  onChange={() => handleThemeChange(theme)}
                />
                <div
                  className={`sm:h-14 sm:w-20 w-16 h-12 overflow-hidden rounded-xl grid grid-cols-3 border-4 transition-all peer-checked:scale-110 border-transparent`}
                >
                  {colors.map((color) => (
                    <div key={color} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </label>
            );
          })}
        </Setting>
        <Setting title={t("settings.3")}>
          {selectedTheme?.split(",").map((t, i) => (
            <ColorPicker template={template} key={i} i={i} value={t} />
          ))}
        </Setting>
      </div>
    </section>
  );
}

function Setting({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2  sm:gap-5 border-b-2 border-background/10 h-20 md:h-22 ">
      <span className="text-background min-w-24 md:min-w-32 md:text-xl capitalize text-nowrap">
        {title}
      </span>
      <div className="flex gap-4 text-nowrap">{children}</div>
    </div>
  );
}
