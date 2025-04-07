
import { Suspense } from "react";
import { SearchBar } from "./Search";
import LanguageSelect from "@/app/[locale]/(business)/[businessName]/(menus)/_components/LanguageSelect";
import Cart from "../../../_components/Cart/Cart";
import { Menu } from "@prisma/client";

export function Navbar({
  businessName,
  menu
}: {
  businessName: string;
  menu:Menu
}) {
  if (!menu.languages) return <div></div>;
  return (
    <nav className="my-container z-50 sticky block space-y-10 bg-myWhite/70 py-5 text-primary backdrop-blur-xl ">
      <div className="flex items-center justify-between">
        <h1 className=" w-fit  text-2xl font-semibold uppercase">coffeeshop</h1>
        <div className="flex items-center gap-x-4">
          <Suspense>
            <LanguageSelect languages={menu.languages} />
          </Suspense>
          <Cart menuType={menu.type} businessName={businessName} />
        </div>
      </div>

      <Suspense>
        <SearchBar businessName={businessName} />
      </Suspense>
    </nav>
  );
}
