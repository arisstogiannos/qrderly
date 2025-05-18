"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import updateSearchParams from "@/lib/updateSearchParams";
import {  useSearchParams } from "next/navigation";
import React, { type ReactNode } from "react";

export default function LanguageSelect({
  languages,
  Trigger,
}: {
  languages: string;
  Trigger?: (children: ReactNode) => ReactNode;
}) {
  const languagesList = languages.split(",");
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("l");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
      {Trigger ? (
          Trigger(currentLang || languagesList[0])
        ) : (
          <div className="bg-secondary size-11 min-w-11 flex-center text-foreground rounded-full p-2 cursor-pointer uppercase">
            {currentLang || languagesList[0]}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border border-primary/50 shadow-2xl">
        {languagesList.map((l) => (
          <DropdownMenuItem
            onClick={() => updateSearchParams("l",l) }
            className="uppercase text-foreground hover:text-primary"
            key={l}
          >
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
