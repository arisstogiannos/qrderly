"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersContext } from "@/context/FiltersProvider";
import { ChevronsUpDown } from "lucide-react";
import React, { ReactNode } from "react";

export default function LanguageSelect() {
  const { language, languages, setLanguage } = useFiltersContext();
  const languagesList = languages.split(",");

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v)}>
        <SelectTrigger className="max-md:w-full uppercase">
        <SelectValue  placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent className="bg-background">
        {languagesList.map((l) => (
          <SelectItem value={l} className="uppercase text-foreground " key={l}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
