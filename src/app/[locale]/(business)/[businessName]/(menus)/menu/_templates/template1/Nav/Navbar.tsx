"use client";

import { Suspense } from "react";
import { SearchBar } from "./Search";
import LanguageSelect from "@/app/[locale]/(business)/[businessName]/(menus)/_components/LanguageSelect";

export function Navbar({languages,businessName}:{languages:string | undefined, businessName:string}) {
  if(!languages) return <div></div>
  return (
    <nav className="my-container z-50 sticky block space-y-6 bg-myWhite/70 pb-10 pt-4 text-primary backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between">
              <h1 className=" w-fit  text-2xl font-semibold uppercase">coffeeshop</h1>
              <Suspense>

                <LanguageSelect languages={languages} />
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
