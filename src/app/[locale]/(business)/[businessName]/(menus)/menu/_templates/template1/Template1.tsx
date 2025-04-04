import { Category, Menu, MenuItem } from "@prisma/client";
import { Navbar } from "./Nav/Navbar";
import Categories from "./Categories";
import { MenuItems } from "./MenuItems/MenuItems";

export default function Template1({
  menu,
  categories,
  menuItems,
  businessName,
  lang,
}: {
  menu: Menu;
  categories: Category[];
  menuItems: MenuItem[];
  businessName: string;
  lang: string;
}) {
  return (
    <>
      <Navbar languages={menu?.languages} businessName={businessName} />
      <div className="flex flex-col space-y-6">
        <Categories categories={categories} lang={lang} />
        <MenuItems lang={lang} categories={categories} menuItems={menuItems} />
      </div>
    </>
  );
}
