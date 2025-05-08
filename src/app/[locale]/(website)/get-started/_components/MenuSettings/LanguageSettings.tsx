import { Label } from "@/components/ui/label";

import React from "react";
import { ErrorMessage } from "@/components/Messages";

import LanguageInput from "./LanguageInput";
import { ComboBox } from "@/components/ComboBox";
import type { Language } from "@/types";
import type { Menu } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function LanguageSettings({
  menu,
  errors,
  srcLanguages,
  targetLanguages,
}: {
  srcLanguages: readonly Language[];
  targetLanguages: readonly Language[];
  menu?: Menu;
  errors: string[] | undefined;
}) {
    const t = useTranslations("menu settings")
  
  return (
    <div className="grid gap-3">
      <div>
        <Label>{t("Default Language")}</Label>
        <p className="text-sm text-muted-foreground">
        {t("Default Language Desc")}
        </p>
      </div>
      <ComboBox
        list={srcLanguages as Language[]}
        defaultValue={menu?.languages.split(",")[0]}
        labelKey="name"
        valueKey="code"
        placeholder="Select Language"
      />
      <div>
        <Label>{t("Languages")}</Label>
        <p className="text-sm text-muted-foreground">
          {t("Languages Desc")}
        </p>
      </div>
      <LanguageInput
        existingLanguages={menu?.languages}
        languages={targetLanguages}
      />
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
