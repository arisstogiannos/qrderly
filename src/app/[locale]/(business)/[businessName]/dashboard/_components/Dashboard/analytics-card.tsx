import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cache } from "@/lib/cache";

import {
  getOrdersPerDay,
  getPopularItems,
  getScansPerDay,
} from "../../_actions/stats";
import AnalyticsCharts from "./AnalyticsCharts";
import type { BusinessExtended } from "@/types";

interface AnalyticsCardProps {
  isOrderingMenu: boolean;
  business: BusinessExtended;
}

export async function AnalyticsCard({
  isOrderingMenu,
  business,
}: AnalyticsCardProps) {
  // Sample data for charts
  const getOrdersPerDayCache = cache(
    getOrdersPerDay,
    [`ordersPerDay${business.name}`],
    {
      tags: [`orders${business.name}`],
      revalidate: 3600,
    }
  );
  const getScansPerDayCache = cache(
    getScansPerDay,
    [`scansPerDay${business.id}`],
    {
      tags: [`scans${business.id}`],
      revalidate: 3600,
    }
  );
  const getPopularItemsCache = cache(
    getPopularItems,
    [`popular-items${business.name}`],
    {
      tags: [`orders${business.name}`],
      revalidate: 3600,
    }
  );

  const [orderData, visitData, menuItemData] = await Promise.all([
    isOrderingMenu ? getOrdersPerDayCache(business.id) : null,
    getScansPerDayCache(business.id),
    isOrderingMenu ? getPopularItemsCache(business.id) : null,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <AnalyticsCharts
          menuItemData={menuItemData}
          orderData={orderData}
          visitData={visitData}
          totalScans={!isOrderingMenu ? business.menu?.noScans : undefined}
        />
      </CardContent>
    </Card>
  );
}
export function AnalyticsCardSkeleton() {


  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
       
      </CardContent>
    </Card>
  );
}
