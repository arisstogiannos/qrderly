"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import updateSearchParams from "@/lib/updateSearchParams";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

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
  const router = useRouter();
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
      <DropdownMenuContent className="bg-background">
        {languagesList.map((l) => (
          <DropdownMenuItem
            onClick={() => updateSearchParams("l",l) }
            className="uppercase text-foreground"
            key={l}
          >
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
