import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { getCategories } from "../../_actions/categories";
import { getActiveMenuItems } from "../../_actions/menu-items";
import {
  getActiveMenuNotCached,
  getActiveMenusNotCached,
} from "../../_actions/menu";
import Template1 from "./_templates/template1/Template1";
import Template2 from "./_templates/template2/Template2";
import { cache } from "@/lib/cache";
import ScanTracker from "../_components/ScanTracker";
import ExpiredMenu from "../_components/ExpiredMenu";

export const dynamicParams = true; // or false, to 404 on unknown paths
// export const revalidate =60;

export async function generateStaticParams() {
  const menus = await getActiveMenusNotCached(["QR_MENU"]);

  return menus.flatMap((menu) =>
    ["en", "el"].map((locale) => ({
      locale,
      businessName: String(menu.business.name).replaceAll(" ", "-"),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  return {
    title: `${businessName} | Online Menu`,
    description: `Explore ${businessName}'s full menu online.`,
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
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
  const getActiveMenu = cache(
    getActiveMenuNotCached,
    [`active-menu${businessName}`],
    {
      tags: [`active-menu${businessName}`],
    }
  );

  const menu = await getActiveMenu(businessName);

  if (!menu) {
    return <ExpiredMenu />;
  }

  // if (menu.type === "SMART_QR_MENU" || menu.type === "SELF_SERVICE_QR_MENU") {
  //   redirect(
  //     "/" + businessName.replaceAll(" ", "-") + "/smart-menu?table=" +" table"
  //   );
  // }

  const [categories, products] = await Promise.all([
    getCachedCategories(businessName),
    getCachedMenuItems(businessName),
  ]);

  const colors = menu.theme.split(",");

  return (
    <main className="min-h-screen">
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
      <Suspense>
        <ScanTracker
          businessName={businessName}
          businessId={menu.businessId}
          menuId={menu.id}
        />
      </Suspense>

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
    </main>
  );
}
