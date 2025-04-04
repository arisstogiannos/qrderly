import React, { ReactNode, Suspense } from "react";
import { checkUserAuthorized } from "../_actions/authorization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./_components/Chart";
import { getAllOrders } from "../_actions/orders";
import { cache } from "@/lib/cache";
import { BusinessExtended } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Stars } from "lucide-react";
import { cn } from "@/lib/utils";
import QrDisplay from "./_components/Dashboard/QrDisplay";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const { business, user } = await checkUserAuthorized(
    businessName
  );

  return (
    <div className=" flex flex-col">
      <SidebarTrigger className="ml-auto mb-5"/>
    
      <div className="grid  xl:grid-cols-3 w-full gap-5">
        <DashboardSection title="Analytics" classNames="col-span-2">
          <Suspense
            fallback={
              <DashboardCard title="loading" classNames="cols-span-full">
                <div className="size-full bg-gray-300"></div>
              </DashboardCard>
            }
          >
            <RevenueChart businessName={businessName} />
          </Suspense>
        </DashboardSection>
        <DashboardSection classNames="max-md:col-span-2" title="QR">
          <Suspense
            fallback={
              <DashboardCard title="loading" classNames="cols-span-full">
                <div className="size-full bg-gray-300"></div>
              </DashboardCard>
            }
          >
            <QrCard business={business} />
          </Suspense>
        </DashboardSection>
      </div>
      <DashboardSection title="Information">
        <DashboardCard title="Business">
          <DashboardCardRow title="Name" value={businessName} />
          <DashboardCardRow title="Location" value={business.location} />
          <DashboardCardRow title="Type" value={business.type} />
          <Button className="w-full mt-3">
            Edit <Edit />
          </Button>
        </DashboardCard>
        <DashboardCard title="Billing">
          <DashboardCardRow
            title="Product"
            value={business.product.replaceAll("_", " ")}
          />
          <DashboardCardRow
            title="Last Payment"
            value={new Date(
              business.subscription.renewedAt
            ).toLocaleDateString()}
          />
          <DashboardCardRow
            title="Expires"
            value={
              (business.subscription.expiresAt &&
                new Date(
                  business.subscription.expiresAt
                )?.toLocaleDateString()) ??
              ""
            }
          />
          <Button className="w-full mt-3">
            Manage <Stars />
          </Button>
        </DashboardCard>
        <DashboardCard title="Personal">
          <DashboardCardRow title="Name" value={user?.name ?? ""} />
          <DashboardCardRow title="Email" value={user.email ?? ""} />
          <Button className="w-full mt-3">
            Edit <Edit />
          </Button>
        </DashboardCard>
      </DashboardSection>
    </div>
  );
}

async function QrCard({ business }: { business: BusinessExtended }) {
  return (
    <DashboardCard title="Qr Code" classNames="col-span-full w-full">
      <div className={cn("grid sm:grid-cols-2 grid-cols-1 gap-y-5",!business.tables&&"grid-cols-1")}>
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
