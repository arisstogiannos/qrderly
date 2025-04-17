import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTotalOrders,
  getTotalRevenue,
} from "../../_actions/stats";
import DisplayPrice from "@/components/DisplayPrice";
import { cache } from "@/lib/cache";
import { BusinessExtended } from "@/types";
import { getTranslations } from "next-intl/server";

interface StatsCardsProps {
  isOrderingMenu: boolean;
  business: BusinessExtended;
}

export async function StatsCards({
  business,
}: StatsCardsProps) {
  const getTotalOrdersCache = cache(
    getTotalOrders,
    ["orders-stats" + business.name],
    {
      tags: ["orders" + business.name],
      revalidate: 3600,
    }
  );

  const getTotalRevenueCache = cache(
    getTotalRevenue,
    ["totalRevenue" + business.name],
    {
      tags: ["orders" + business.name],
      revalidate: 3600,
    }
  );
  const totalScans = business.menu.noScans;

  const [totalOrders, totalRevenue] = await Promise.all([
    getTotalOrdersCache(business.id),
    getTotalRevenueCache(business.id),
  ]);

  const t = await getTranslations("dashboard")

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("qrCodeScans")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalScans}</div>
        </CardContent>
      </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("totalSales")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <DisplayPrice price={totalRevenue} />
            </div>
          </CardContent>
        </Card>

   
    </div>
  );
}

interface StatsCardsPropsSkeleton {
  isOrderingMenu: boolean;
}

export function StatsCardsLoadingSkeleton({
  isOrderingMenu,
}: StatsCardsPropsSkeleton) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">QR Code Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-accent animate-pulse h-7 w-20"></div>
        </CardContent>
      </Card>

      {isOrderingMenu && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-accent animate-pulse h-7 w-20"></div>
          </CardContent>
        </Card>
      )}

      {isOrderingMenu && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-accent animate-pulse h-7 w-20"></div>
          </CardContent>
        </Card>
      )}

      {/* Add replacement cards for non-ordering menus */}
      {!isOrderingMenu && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-accent animate-pulse h-7 w-20"></div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
