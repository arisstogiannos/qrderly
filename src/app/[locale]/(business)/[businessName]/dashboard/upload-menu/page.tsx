import React from "react";
import { checkUserAuthorized } from "../../_actions/authorization";
import { getTranslations } from "next-intl/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UploadingForm from "@/app/[locale]/(website)/get-started/_components/generateItems/UploadingForm";
import { getMenuItems, getMenuItemsByMenuId } from "../../_actions/menu-items";
import { cache } from "@/lib/cache";
import { getCategories } from "../../_actions/categories";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName?.replaceAll("-", " ");
  await checkUserAuthorized(businessName);

  const getMenuItmesCached = cache(
    getMenuItems,
    ["menu-items" + businessName],
    {
      tags: ["menu-items" + businessName],
    }
  );
  const getCachedCategories = cache(
    getCategories,
    ["categories" + businessName],
    {
      tags: ["categories" + businessName],
    }
  );

  const t = await getTranslations();
  const menuItems = await getMenuItmesCached(businessName);

  const existingItemsNames = menuItems.map((it) => it.name);
  const existingCategories = await getCachedCategories(businessName);
  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">{t("uploadMenuPage.title")}</h1>
        <SidebarTrigger className="xl:hidden" />
      </div>
      <div className="max-w-fit">
        <UploadingForm
          businessName={businessName}
          existingItems={existingItemsNames}
          existingCategories={existingCategories}
        />
      </div>
    </div>
  );
}
