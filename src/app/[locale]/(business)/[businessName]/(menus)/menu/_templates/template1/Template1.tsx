import type { Category, Menu, MenuItem } from "@prisma/client";
import { Navbar } from "./Nav/Navbar";
import Categories from "./Categories";
import { MenuItems } from "./MenuItems/MenuItems";
import { Suspense } from "react";

export default function Template1({
  menu,
  categories,
  menuItems,
  businessName,
}: {
  menu: Menu;
  categories: Category[];
  menuItems: MenuItem[];
  businessName: string;
}) {
  return (
    <>
      <Navbar languages={menu?.languages} businessName={businessName} />
      <div className="flex flex-col space-y-6">
        <Suspense>
          <Categories categories={categories} />
        </Suspense>
        <Suspense>
        <MenuItems categories={categories} menuItems={menuItems} />
        </Suspense>
      </div>
    </>
  );
}
