import { notFound, redirect } from "next/navigation";
import React from "react";
import { getCategories } from "../../_actions/categories";
import { getMenuItems } from "../../_actions/menu-items";
import {
  getActiveMenuNotCached,
  getActiveMenusNotCached,
} from "../../_actions/menu";
import Template1 from "./_templates/template1/Template1";
import Template2 from "./_templates/template2/Template2";
import { cache } from "@/lib/cache";
import ScanTracker from "../_components/ScanTracker";
import Theme from "../_components/Theme";

export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const menus = await getActiveMenusNotCached("QR_MENU");

  return menus.map((menu) => ({locale:
    businessName: String(menu.business.name).replaceAll(" ", "-"),
  }));
}

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

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ businessName: string }>;
  searchParams: Promise<{ l: string,table:string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
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
  const getActiveMenu = cache(
    getActiveMenuNotCached,
    ["active-menu" + businessName],
    {
      tags: ["active-menu" + businessName],
    }
  );

  const lang = (await searchParams).l;
  const table = (await searchParams).table;
  const menu = await getActiveMenu(businessName);

  if (!menu) {
    notFound();
  }

  if (menu.type === "SMART_QR_MENU" || menu.type === "SELF_SERVICE_QR_MENU" ) {
    redirect("/" + businessName.replaceAll(" ", "-") + "/smart-menu?table="+table);
  }

  const [categories, products] = await Promise.all([
    getCachedCategories(businessName),
    getCachedMenuItems(businessName),
  ]);

  const colors = menu.theme.split(",");

  return (
    <main

      className="min-h-screen"
    >
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
    </main>
  );
}
