import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cache } from '@/lib/cache';
import { checkUserAuthorized } from '../../_actions/authorization';
import { getAllOrders } from '../../_actions/orders';
import AllOrdersTable from '../_components/Order/AllOrdersTable';

// const getOrdersCache = unstable_cache(getAllOrders, ["all-orders-a-s"], {
//   tags: ["all-orders-a"],
//   revalidate: false,
// });
export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  await checkUserAuthorized(businessName);

  const getAllOrdersCache = cache(getAllOrders, [`orders${businessName}`], {
    tags: [`orders${businessName}`],
    revalidate: 3600,
  });
  const t = await getTranslations('admin.orders');

  const orders = await getAllOrdersCache(businessName);

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">{t('allOrders.title')}</h1>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
      </div>
      <Suspense fallback={<Loader className="w-20 mx-auto" />}>
        <AllOrdersTable orders={orders} />
      </Suspense>
    </section>
  );
}
