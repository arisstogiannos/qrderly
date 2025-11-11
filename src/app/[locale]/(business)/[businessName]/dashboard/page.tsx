import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { plandata } from '@/data';
import { Link } from '@/i18n/navigation';
import { cache } from '@/lib/cache';
import { checkUserAuthorized } from '../_actions/authorization';
import { getAllOrders } from '../_actions/orders';
import { AnalyticsCard, AnalyticsCardSkeleton } from './_components/Dashboard/analytics-card';
import { BusinessInfoCard } from './_components/Dashboard/business-info-card';
import Chart from './_components/Dashboard/Chart';
import { QrCodeCard } from './_components/Dashboard/qr-code-card';
import { StatsCards, StatsCardsLoadingSkeleton } from './_components/Dashboard/stats-cards';
import { SubscriptionStatusCard } from './_components/Dashboard/subscription-status-card';
export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const { business } = await checkUserAuthorized(businessName);
  const isOrderingMenu = business.product !== 'QR_MENU';

  const t = await getTranslations('dashboard');

  const plan = plandata.find((plan) => plan.product === business.product);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <h1 className="font-medium text-2xl">{t('title')}</h1>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
        <Button className="mt-2 hidden lg:flex" asChild>
          <Link
            //@ts-expect-error
            href={`/${business.name.replaceAll(' ', '-')}${business.menu?.type === 'QR_MENU' ? '/menu' : '/smart-menu'}`}
          >
            {t('visitLiveMenu')} <ArrowUpRight />
          </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-auto mt-2">
        <div className="grid gap-6">
          <Button className="mt-2 flex lg:hidden" asChild>
            <Link
              //@ts-expect-error
              href={`/${business.name.replaceAll(' ', '-')}${business.menu?.type === 'QR_MENU' ? '/menu' : '/smart-menu'}`}
            >
              {t('visitLiveMenu')} <ArrowUpRight />
            </Link>
          </Button>
          {/* Toggle for demo purposes */}

          {/* Quick stats */}
          {isOrderingMenu && (
            <Suspense fallback={<StatsCardsLoadingSkeleton isOrderingMenu={isOrderingMenu} />}>
              <StatsCards business={business} isOrderingMenu={isOrderingMenu} />
            </Suspense>
          )}

          {/* Analytics section */}
          <Suspense fallback={<AnalyticsCardSkeleton />}>
            <AnalyticsCard isOrderingMenu={isOrderingMenu} business={business} />
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
              billing: business.subscription?.billing ?? 'FREETRIAL',
              price:
                plan?.billing[business.subscription?.billing === 'MONTHLY' ? 'monthly' : 'yearly']
                  .price ?? '',
              title: business.product,
              scans: business.menu?.noScans ?? 0,
            }}
          />
        </div>
      </main>
    </div>
  );
}

async function RevenueChart({ businessName }: { businessName: string }) {
  const getAllOrdersCache = cache(getAllOrders, ['orders'], {
    tags: ['orders'],
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
