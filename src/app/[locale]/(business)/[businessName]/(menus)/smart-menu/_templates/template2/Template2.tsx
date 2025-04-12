import { Category, Menu, MenuItem } from "@prisma/client";
import { MenuItems } from "./MenuItems/MenuItems";
import Categories from "./Categories";
import { Navbar } from "./Nav/Navbar";
import { Suspense } from "react";

export default function Template2({
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

      <div className="flex flex-col space-y-0">
        <Suspense>
          <Categories categories={categories} />
        </Suspense>

        <div className="my-container pt-5">
        <Suspense>
          <MenuItems categories={categories} menuItems={menuItems} />
        </Suspense>
        </div>
      </div>
    </>
  );
}
