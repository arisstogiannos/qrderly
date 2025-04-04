"use client";

import { Suspense } from "react";
import { SearchBar } from "./Search";
import LanguageSelect from "@/app/[locale]/(business)/[businessName]/(menus)/_components/LanguageSelect";

export function Navbar({
  languages,
  businessName,
}: {
  languages: string | undefined;
  businessName: string;
}) {
  if (!languages) return <div></div>;
  return (
    <nav className="my-container z-50 sticky block space-y-10 bg-background/70 py-5 text-foreground backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between">
        <h1 className=" w-fit  text-2xl font-semibold uppercase text-primary">
          coffeeshop
        </h1>
        <Suspense>
          <LanguageSelect
            languages={languages}
            Trigger={(children) => (
              <div className="bg-background size-11 min-w-11 flex-center text-foreground border border-foreground rounded-full p-2 cursor-pointer uppercase">
                {children}
              </div>
            )}
          />
        </Suspense>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Suspense>
          <SearchBar businessName={businessName} />
        </Suspense>
      </div>
    </nav>
  );
}
