import { Label } from "@/components/ui/label";
import React from "react";
import { useTranslations } from "next-intl";

export default function TranslateCheckBox({ name }: { name: string }) {
  const t = useTranslations("translateCheckBox");

  return (
    <div className="flex items-center  gap-5 border-b-2 border-background/10  ">
      <span className="text-foreground  capitalize text-sm">{t("label")}</span>
      <div className="flex gap-2">
        <Label
          className="  h-8 text-sm  text-foreground/20 gap-2 border-2 border-foreground/20 px-2 py-2 rounded-lg cursor-pointer has-checked:border-primary has-checked:text-primary min-w-10"
        >
          <input
            type="radio"
            defaultValue="yes"
            defaultChecked={true}
            name={name}
            className="peer hidden "
          />
          {t("yes")}
        </Label>
        <Label
          className=" h-8 justify-center  text-sm  text-foreground/20 gap-2 border-2 border-foreground/20 px-2 py-2 rounded-lg cursor-pointer has-checked:border-primary has-checked:text-primary w-12 text-center"
        >
          <input
            type="radio"
            defaultValue="no"
            name={name}
            className="peer hidden"
          />
          {t("no")}
        </Label>
      </div>
    </div>
  );
}
