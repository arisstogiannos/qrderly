import React from "react";
import { Navbar } from "./template2/Nav/Navbar";
import { MenuItemCard } from "./template2/MenuItems/MenuItemCard";

export default function Template2() {
  const categories = ["Category 1", "Category 2", "Category 3"];
  return (
    <div className="flex flex-col space-y-4 w-xs overflow-hidden h-[400px] sm:h-[600px] rounded-t-3xl sm:rounded-b-3xl drop-shadow-xl text-xs px-4 bg-background-mockup mx-auto  text-text-mockup">
      <Navbar />

      <div className="sticky top-0 z-10   font-medium  b ">
        <div className="scrollbar-hidden  flex items-center gap-4 overflow-auto py-2 text-lg capitalize  ">
          {categories.map((category, i) => (
            <div
            key={i}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors capitalize  text-nowrap xl:hover:bg-primary-mockup ${
                i === 0 ? "bg-primary-mockup" : "bg-primary-mockup/30"
              }`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <MenuItemCard key={i} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
