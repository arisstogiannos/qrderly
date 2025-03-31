"use client";

import { Suspense } from "react";
import { SearchBar } from "./Search";
import LanguageSelect from "@/app/(business)/[businessName]/(menus)/_components/LanguageSelect";
import Cart from "../../../_components/Cart/Cart";

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
        <div className="flex items-center gap-4">
          <Suspense>
            <LanguageSelect
              languages={languages}
              Trigger={(children) => (
                <div className="bg-secondary size-11 min-w-11 flex-center text-foreground  rounded-full p-2 cursor-pointer uppercase">
                  {children}
                </div>
              )}
            />
          </Suspense>
          <Suspense>
            <Cart businessName={businessName} />
          </Suspense>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Suspense>
          <SearchBar businessName={businessName} />
        </Suspense>
      </div>
    </nav>
  );
}
