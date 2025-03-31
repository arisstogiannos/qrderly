import { Label } from "@/components/ui/label";

import React from "react";
import { ErrorMessage } from "@/components/Messages";

import LanguageInput from "./LanguageInput";
import { ComboBox } from "@/components/ComboBox";
import { Language } from "@/types";
import { Menu } from "@prisma/client";

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
  return (
    <div className="grid gap-3">
      <div>
        <Label>Deafult Language</Label>
        <p className="text-sm text-muted-foreground">
          The native language that you will write the menu items, categories...
        </p>
      </div>
      <ComboBox
        list={srcLanguages as Language[]}
        defaultValue={menu?.languages.split(",")[0]}
        labelKey="name"
        valueKey="code"
        placeholder="Select Language"
      />

      <Label>Languages</Label>
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
