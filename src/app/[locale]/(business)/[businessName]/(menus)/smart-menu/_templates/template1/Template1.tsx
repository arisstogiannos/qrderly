import { Category, Menu, MenuItem } from "@prisma/client";
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
      <Navbar menu={menu} businessName={businessName} />
      <div>
        <div className="flex flex-col space-y-2">
          <Suspense>
            <Categories categories={categories} />
          </Suspense>
          <Suspense>
            <MenuItems categories={categories} menuItems={menuItems} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
