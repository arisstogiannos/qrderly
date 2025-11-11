import { getTranslations } from 'next-intl/server';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { OrdersProvider } from '@/context/OrdersProvider';
import { checkUserAuthorized } from '../../_actions/authorization';
import OrderDetails from '../_components/Order/OrderDetails';
import OrdersTable from '../_components/Order/OrderTable';

export default async function page({ params }: { params: Promise<{ businessName: string }> }) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  await checkUserAuthorized(businessName);
  const t = await getTranslations('admin.orders');

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">{t('liveOrders.title')}</h1>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
      </div>
      <OrdersProvider businessName={businessName}>
        <OrderDetails withAction />
        <OrdersTable />
      </OrdersProvider>
    </section>
  );
}
