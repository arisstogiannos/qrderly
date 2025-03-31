import React, { Suspense } from "react";
import AllOrdersTable from "../_components/Order/AllOrdersTable";
import { getAllOrders } from "../../_actions/orders";
import Loader from "@/components/Loader";
import { checkUserAuthorized } from "../../_actions/authorization";
import { cache } from "@/lib/cache";
import { SidebarTrigger } from "@/components/ui/sidebar";

// const getOrdersCache = unstable_cache(getAllOrders, ["all-orders-a-s"], {
//   tags: ["all-orders-a"],
//   revalidate: false,
// });
const getAllOrdersCache = cache(getAllOrders, ["orders"], {
  tags: ["orders"],
  revalidate: 3600,
});
export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  await checkUserAuthorized(businessName);

  const orders = await getAllOrdersCache(businessName);

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">All Orders</h1>
        <SidebarTrigger className="xl:hidden" />
      </div>
      <Suspense fallback={<Loader />}>
        <AllOrdersTable orders={orders} />
      </Suspense>
    </section>
  );
}
