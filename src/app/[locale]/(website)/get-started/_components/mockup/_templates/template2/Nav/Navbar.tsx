"use client";

import { Suspense } from "react";
import { SearchBar } from "./Search";
import LanguageSelect from "@/app/[locale]/(business)/[businessName]/(menus)/_components/LanguageSelect";
import { SearchIcon, ShoppingBag } from "lucide-react";

export function Navbar() {
 
  return (
    <nav className=" z-50   space-y-2 bg-background-mockup/70  pt-4 text-text-mockup backdrop-blur-xl text-xs">
    <div className="flex items-center justify-between">
      <p className=" text-base  font-bold uppercase text-primary-mockup">Your Business</p>
      <div className="flex items-center gap-x-6 text-myWhite">
        <div className="relative rounded-full bg-foreground-mockup p-2 text-text-mockup">
          <ShoppingBag size={"1.5em"} />
          <div className="absolute left-0 top-3/4 size-5 place-content-center  rounded-full bg-primary-mockup text-center text-xs">
            1
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-4 py-4">
      <div className=" relative col-span-full mx-3 flex items-center gap-3 rounded-md px-2 py-1 outline-2 outline-primary-mockup/60 focus-within:outline-primary-mockup text-primary-mockup">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent placeholder:text-primary-mockup w-full focus:outline-none"
        />
      </div>
      {/* <Button>Search</Button> */}
    </div>
  </nav>
  );
}
