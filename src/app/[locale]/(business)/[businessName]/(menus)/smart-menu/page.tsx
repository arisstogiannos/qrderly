import { notFound, redirect } from "next/navigation";
import React from "react";
import { getCategories } from "../../_actions/categories";
import { getMenuItems } from "../../_actions/menu-items";
import { unstable_cache } from "next/cache";
import {
  getActiveMenuNotCached,
  getActiveMenus,
  getActiveMenusNotCached,
} from "../../_actions/menu";
import { cache } from "@/lib/cache";
import { CartContextProvider } from "@/context/CartContext";
import Template1 from "./_templates/template1/Template1";
import Theme from "../_components/Theme";
import Template2 from "./_templates/template2/Template2";
import ScanTracker from "../_components/ScanTracker";
import ActiveOrder from "./_components/ActiveOrder";
import { cookies } from "next/headers";

export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  const description = `Check out our menu`;

  return {
    title: businessName + " | Online Menu",
    description,
  };
}

export async function generateStaticParams() {
  const getActiveMenusCache = cache(getActiveMenusNotCached, ["active-menus"], {
    tags: ["active-menus"],
  });
  const menus = await getActiveMenusNotCached(["SMART_QR_MENU","SELF_SERVICE_QR_MENU"]);

  return menus.map((menu) => ({
    locale: "en",
    businessName: String(menu.business.name).replaceAll(" ", "-"),
  }));
}

export default async function page({
  params,
  // searchParams,
}: {
  params: Promise<{ businessName: string }>;
  // searchParams: Promise<{ l: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const lang = "en"

  const getActiveMenu = cache(
    getActiveMenuNotCached,
    ["active-menu" + businessName],
    {
      tags: ["active-menu" + businessName],
    }
  );
  const menu = await getActiveMenu(businessName);

  const getCachedCategories = cache(
    getCategories,
    ["categories" + businessName],
    {
      tags: ["categories" + businessName],
    }
  );
  const getCachedMenuItems = cache(
    getMenuItems,
    ["menu-items" + businessName],
    {
      tags: ["menu-items" + businessName],
    }
  );

  if (!menu) {
    notFound();
  }

  if (menu.type === "QR_MENU") {
    redirect("/" + businessName + "/menu");
  }

  const [categories, products] = await Promise.all([
    getCachedCategories(businessName),
    getCachedMenuItems(businessName),
  ]);
  const colors = menu.theme.split(",");
      const activeOrder = (await cookies()).get("order")?.value;

  return (
    <main className="bg-background text-foreground">
      {/* <Theme theme={menu.theme}/> */}
      <style>{`
        :root {
          --background: ${colors[0]};
          --foreground: ${colors[3]};
          --primary: ${colors[2]};
          --secondary: ${colors[1]};
          --accent: ${colors[4]};
          }
          `}</style>
      <ScanTracker menuId={menu.id} />
      {}
      <CartContextProvider>
        {menu.template === "T1" ? (
          <Template1
          businessName={businessName}
          categories={categories}
          lang={lang}
          menu={menu}
          menuItems={products}
          />
        ) : (
          <Template2
          businessName={businessName}
          categories={categories}
          lang={lang}
          menu={menu}
          menuItems={products}
          />
        )}
      </CartContextProvider>
      <ActiveOrder activeOrder={activeOrder}/>
    </main>
  );
}
