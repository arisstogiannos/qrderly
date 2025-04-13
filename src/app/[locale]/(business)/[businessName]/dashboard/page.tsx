import React, { ReactNode, Suspense } from "react";
import { checkUserAuthorized } from "../_actions/authorization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./_components/Dashboard/Chart";
import { getAllOrders } from "../_actions/orders";
import { cache } from "@/lib/cache";
import { BusinessExtended } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Stars } from "lucide-react";
import { cn } from "@/lib/utils";
import QrDisplay from "./_components/Dashboard/QrDisplay";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const { business, user } = await checkUserAuthorized(businessName);
  const t = await getTranslations("dashboard");

  return (
    <div className=" flex flex-col">
      <SidebarTrigger className="ml-auto mb-5" />
      <div className="grid xl:grid-cols-3 w-full gap-5">
        <DashboardSection title={t("analytics")} classNames="col-span-2">
          <Suspense
            fallback={
              <DashboardCard title={t("loading")} classNames="cols-span-full">
                <div className="size-full bg-gray-300"></div>
              </DashboardCard>
            }
          >
            <RevenueChart businessName={businessName} />
          </Suspense>
        </DashboardSection>
        <DashboardSection classNames="max-md:col-span-2" title={t("qr")}>
          <Suspense
            fallback={
              <DashboardCard title={t("loading")} classNames="cols-span-full">
                <div className="size-full bg-gray-300"></div>
              </DashboardCard>
            }
          >
            <QrCard business={business} />
          </Suspense>
        </DashboardSection>
      </div>
      <DashboardSection title={t("information")}>
        <DashboardCard title={t("business")}>
          <DashboardCardRow title={t("name")} value={businessName} />
          <DashboardCardRow title={t("location")} value={business.location} />
          <DashboardCardRow title={t("type")} value={business.type} />
          <Button className="w-full mt-3">
            {t("edit")} <Edit />
          </Button>
        </DashboardCard>
        <DashboardCard title={t("billing")}>
          <DashboardCardRow
            title={t("product")}
            value={business.product.replaceAll("_", " ")}
          />
          <DashboardCardRow
            title={t("lastPayment")}
            value={new Date(
              business.subscription.renewedAt
            ).toLocaleDateString()}
          />
          <DashboardCardRow
            title={t("expires")}
            value={
              (business.subscription.expiresAt &&
                new Date(
                  business.subscription.expiresAt
                )?.toLocaleDateString()) ??
              ""
            }
          />
          <Button className="w-full mt-3">
            {t("manage")} <Stars />
          </Button>
        </DashboardCard>
        <DashboardCard title={t("personal")}>
          <DashboardCardRow title={t("name")} value={user?.name ?? ""} />
          <DashboardCardRow title={t("email")} value={user.email ?? ""} />
          <Button className="w-full mt-3">
            {t("edit")} <Edit />
          </Button>
        </DashboardCard>
      </DashboardSection>
    </div>
  );
}

async function QrCard({ business }: { business: BusinessExtended }) {
  return (
    <DashboardCard title="Qr Code" classNames="col-span-full w-full">
      <div className={cn("grid sm:grid-cols-2 grid-cols-1 gap-y-5",!business.tables&&" sm:grid-cols-1")}>
        {/* <div className="gap-y-2 items-center flex flex-col"> */}
        <QrDisplay business={business} />
        {business.tables && (
          <div className="w-full pl-5 space-y-3">
            <p>tables</p>
            <div className="flex flex-wrap gap-2  overflow-y-auto max-h-[250]">
              {business.tables.split(",").map((t) => (
                <div
                  className="px-2 py-1 size-fit bg-accent border-primary/20 border rounded-md"
                  key={t}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* <DashboardCardRow
          title="Total Scans"
          value={business.menu.noScans.toString()}
          /> */}
        {/* </div> */}
      </div>
    </DashboardCard>
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

function DashboardCardRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex justify-between items-center mt-1 w-full">
      <p>{title}</p>
      <p>{value}</p>
    </div>
  );
}

function DashboardSection({
  title,
  classNames,
  children,
}: {
  title: string;
  classNames?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn("space-y-5  bg-accent/50 rounded-3xl p-4 md:p-8 mb-5", classNames)}
    >
      <h3 className="text-xl font-medium">{title}</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 ">
        {children}
      </div>
    </section>
  );
}

function DashboardCard({
  title,
  classNames,
  children,
}: {
  title: string;
  classNames?: string;
  children: ReactNode;
}) {
  return (
    <Card className={classNames}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">{children}</CardContent>
    </Card>
  );
}
