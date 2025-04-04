import React from "react";

import { OrdersProvider } from "@/context/OrdersProvider";
import { checkUserAuthorized } from "../../_actions/authorization";
import OrdersTable from "../_components/Order/OrderTable";
import OrderDetails from "../_components/Order/OrderDetails";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  await checkUserAuthorized(businessName);

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">Orders</h1>
        <SidebarTrigger className="xl:hidden" />
      </div>
      <OrdersProvider businessName={businessName}>
        <OrderDetails withAction />
        <OrdersTable />
      </OrdersProvider>
    </section>
  );
}
