import { Category, Menu, MenuItem } from "@prisma/client";
import { MenuItems } from "./MenuItems/MenuItems";
import Categories from "./Categories";
import { Navbar } from "./Nav/Navbar";

export default function Template2({
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

      <div className="flex flex-col space-y-0">
        <Categories categories={categories} lang={lang}/>

        <div className="my-container pt-5">
          <MenuItems
            lang={lang}
            categories={categories}
            menuItems={menuItems}
          />
        </div>
      </div>
    </>
  );
}
