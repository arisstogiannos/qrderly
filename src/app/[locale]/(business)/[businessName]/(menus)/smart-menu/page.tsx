import { notFound, redirect } from "next/navigation";
import React from "react";
import { getCategories } from "../../_actions/categories";
import { getActiveMenuItems } from "../../_actions/menu-items";
import {
  getActiveMenuNotCached,
  getActiveMenusNotCached,
} from "../../_actions/menu";
import { cache } from "@/lib/cache";
import { CartContextProvider } from "@/context/CartContext";
import Template1 from "./_templates/template1/Template1";
import Template2 from "./_templates/template2/Template2";
import ScanTracker from "../_components/ScanTracker";
import ActiveOrder from "./_components/ActiveOrder";
import ExpiredMenu from "../_components/ExpiredMenu";

export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate =60; 

export async function generateMetadata({ params }:{params:Promise<{businessName:string}>}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  return {
    metadataBase: new URL('https://www.scanby.cloud'),
    title: `${businessName} | Online Menu`,
    description: 'Check out our menu',
    openGraph: {
      title: `${businessName} | Online Menu`,
      description: 'Check out our menu',
      url: `https://www.scanby.cloud/en/${businessName}/smart-menu`,
      siteName: 'Scanby',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export async function generateStaticParams() {
  const getActiveMenusCache = cache(getActiveMenusNotCached, ["active-menus"], {
    tags: ["active-menus"],
  });
  const menus = await getActiveMenusCache([
    "SMART_QR_MENU",
    "SELF_SERVICE_QR_MENU",
  ]);

  return menus.map((menu) => ({
    locale: "en",
    businessName: String(menu.business.name).replaceAll(" ", "-"),
  }));
}

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  const getActiveMenu = cache(
    getActiveMenuNotCached,
    [`active-menu${businessName}`],
    {
      tags: [`active-menu${businessName}`],
    }
  );
  const menu = await getActiveMenu(businessName);

  const getCachedCategories = cache(
    getCategories,
    [`categories${businessName}`],
    {
      tags: [`categories${businessName}`],
    }
  );
  const getCachedMenuItems = cache(
    getActiveMenuItems,
    [`active-menu-items${businessName}`],
    {
      tags: [`menu-items${businessName}`],
    }
  );

  if (!menu) {
    return <ExpiredMenu/>
  }

  if (menu.type === "QR_MENU") {
    redirect(`/en/${businessName}/menu`);
  }

  const [categories, products] = await Promise.all([
    getCachedCategories(businessName),
    getCachedMenuItems(businessName),
  ]);
  const colors = menu.theme.split(",");

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
      <ScanTracker businessName={businessName} menuId={menu.id} businessId={menu.businessId} />
      <CartContextProvider>
        {menu.template === "T1" ? (
          <Template1
            businessName={businessName}
            categories={categories}
            menu={menu}
            menuItems={products}
          />
        ) : (
          <Template2
            businessName={businessName}
            categories={categories}
            menu={menu}
            menuItems={products}
          />
        )}
      </CartContextProvider>
     <ActiveOrder menuType={menu.type} businessName={businessName}  />
    </main>
  );
}
