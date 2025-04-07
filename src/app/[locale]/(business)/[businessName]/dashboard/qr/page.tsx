import React from "react";
import { FiltersProvider } from "@/context/FiltersProvider";

import { checkUserAuthorized } from "../../_actions/authorization";
import { getMenuItems } from "../../_actions/menu-items";
import MenuItemsPage from "../_components/MenuItems/MenuItemsPage";
import { cache } from "@/lib/cache";
import { getCategoriesWithItemCount } from "../../_actions/categories";
import QrCreator from "@/app/[locale]/(website)/get-started/_components/qr/QrCreator";
import TablesSetup from "@/app/[locale]/(website)/get-started/_components/Business/TablesSetup";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Save } from "lucide-react";
import TablesForm from "../_components/TablesForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const { business } = await checkUserAuthorized(businessName);
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">Qr Settings</h1>
        <SidebarTrigger className="xl:hidden" />
      </div>
      <div className="grid gap-y-8 lg:grid-cols-2">
        <div className="max-w-xl space-y-5">
          <p>Customize</p>
          <QrCreator business={business} url={business.qr.link} />
        </div>
        <hr className="border-accent" />
        {business.product === "SMART_QR_MENU" && (
          <TablesForm business={business} />
        )}{" "}
      </div>
    </div>
  );
}
