import { cacheLife, cacheTag } from 'next/cache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BusinessExtended } from '@/types';
import { getOrdersPerDay, getPopularItems, getScansPerDay } from '../../_actions/stats';
import AnalyticsCharts from './AnalyticsCharts';

interface AnalyticsCardProps {
  isOrderingMenu: boolean;
  business: BusinessExtended;
}

async function getOrdersPerDayCached(businessId: string, businessName: string) {
  'use cache';
  cacheTag(`orders${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getOrdersPerDay(businessId);
}

async function getScansPerDayCached(businessId: string) {
  'use cache';
  cacheTag(`scans${businessId}`);
  cacheLife({ revalidate: 60 * 60 });

  return getScansPerDay(businessId);
}

async function getPopularItemsCached(businessId: string, businessName: string) {
  'use cache';
  cacheTag(`orders${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getPopularItems(businessId);
}

export async function AnalyticsCard({ isOrderingMenu, business }: AnalyticsCardProps) {
  const [orderData, visitData, menuItemData] = await Promise.all([
    isOrderingMenu ? getOrdersPerDayCached(business.id, business.name) : null,
    getScansPerDayCached(business.id),
    isOrderingMenu ? getPopularItemsCached(business.id, business.name) : null,
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
      <CardContent className="h-[300px] w-full"></CardContent>
    </Card>
  );
}
