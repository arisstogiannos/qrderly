import React, { Suspense } from "react";
import { checkUserAuthorized } from "../_actions/authorization";
import Chart from "./_components/Dashboard/Chart";
import { getAllOrders } from "../_actions/orders";
import { cache } from "@/lib/cache";
import { getTranslations } from "next-intl/server";
import {
  StatsCards,
  StatsCardsLoadingSkeleton,
} from "./_components/Dashboard/stats-cards";
import { BusinessInfoCard } from "./_components/Dashboard/business-info-card";
import { QrCodeCard } from "./_components/Dashboard/qr-code-card";
import {
  AnalyticsCard,
  AnalyticsCardSkeleton,
} from "./_components/Dashboard/analytics-card";
import { SubscriptionStatusCard } from "./_components/Dashboard/subscription-status-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { plandata } from "@/data";
export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const { business } = await checkUserAuthorized(businessName);
  const isOrderingMenu = business.product !== "QR_MENU";


  const t = await getTranslations("dashboard");

  const plan = plandata.find((plan) => plan.product === business.product);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <h1 className="font-medium text-2xl">{t("title")}</h1>
        <SidebarTrigger className="lg:hidden" />
      </header>
      <main className="flex-1 overflow-auto mt-2">
        <div className="grid gap-6">
          {/* Toggle for demo purposes */}

          {/* Quick stats */}
          {isOrderingMenu && (
            <Suspense
              fallback={
                <StatsCardsLoadingSkeleton isOrderingMenu={isOrderingMenu} />
              }
            >
              <StatsCards business={business} isOrderingMenu={isOrderingMenu} />
            </Suspense>
          )}

          {/* Analytics section */}
          <Suspense fallback={<AnalyticsCardSkeleton />}>
            <AnalyticsCard
              isOrderingMenu={isOrderingMenu}
              business={business}
            />
          </Suspense>

          {/* Business and QR section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <BusinessInfoCard business={business} />
            <QrCodeCard business={business} />
          </div>

          {/* Menu management section */}
          {/* <MenuManagementCard /> */}

          {/* Recent activity and feedback */}
          {/* <div className="grid gap-6 lg:grid-cols-2">
            <ActivityFeedCard isOrderingMenu={business.product === "QR_MENU"} />
            {isOrderingMenu && <CustomerFeedbackCard />}
          </div> */}

          {/* Subscription status */}
          <SubscriptionStatusCard
            {...{
              billing: business.subscription?.billing??"FREETRIAL",
              price:
                plan?.billing[
                  business.subscription?.billing === "MONTHLY"
                    ? "monthly"
                    : "yearly"
                ].price ?? "",
              title: business.product,
              scans: business.menu?.noScans ??0,
            }}
          />
        </div>
      </main>
    </div>
  );
}

async function RevenueChart({ businessName }: { businessName: string }) {
  const getAllOrdersCache = cache(getAllOrders, ["orders"], {
    tags: ["orders"],
    revalidate: 3600,
  });

  const orders = await getAllOrdersCache(businessName);
  const chartData = orders.map((order) => ({
    createdAt: order.createdAt,
    pricePaidInCents: order.price,
  }));
  return <Chart chartData={chartData} />;
}
// async function ScansChart({ scans }: { scans: number[] }) {
//   const getAllOrdersCache = cache(getAllOrders, ["orders"], {
//     tags: ["orders"],
//     revalidate: 3600,
//   });

//   const chartData = scans.map((order) => ({
//     createdAt: order.createdAt,
//     pricePaidInCents: order.price,
//   }));
//   return <Chart chartData={chartData} />;
// }
