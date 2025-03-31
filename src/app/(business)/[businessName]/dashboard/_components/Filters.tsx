import React from "react";
import Categories from "./Categories/Categories";
import Search from "./Search";
import LanguageSelect from "./LanguageSelect";

export default function Filters() {
  return (
    <div className="md:flex lg:gap-6 grid grid-cols-2 grid-rows-2 gap-3">
      <div className="">

      <LanguageSelect />
      </div>
      <div className="col-span-full">

      <Search />
      </div>
      <div className="col-start-2 row-start-1">

      <Categories />
      </div>
    </div>
  );
}
