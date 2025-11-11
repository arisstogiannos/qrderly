import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import DisplayPrice from '@/components/DisplayPrice';
import { getOrderById } from '../../../_actions/orders';
import BackButton from '../_components/BackButton';
import OrderTracking from '../_components/OrderTracking';

export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ order: string }>;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll('-', ' ');
  const orderId = (await searchParams).order;
  const validOrder = await getOrderById(orderId);
  const t = await getTranslations('menus.order');
  if (!validOrder) redirect('/unauthorized');
  return (
    <section className="h-screen flex-center  w-full md:max-w-xl md:mx-auto">
      <div className="flex  flex-col items-center mx-5 w-full bg-secondary rounded-3xl p-6">
        <OrderTracking initial={validOrder} businessName={businessName} />
        <div className="w-full h-28 bg-background rounded-2xl flex-center text-primary text-3xl font-semibold">
          {t('orderNumber', { orderId: validOrder.id.substring(0, 5) })}
        </div>
        <div className="w-full  bg-background rounded-2xl space-y-8 p-4 mt-5">
          <p>{t('orderSummary')}</p>
          <div className="w-full space-y-3 ">
            {validOrder.orderItems.map((item, i) => (
              <div className="flex justify-between text-foreground/50" key={i}>
                <p>
                  {item.quantity}x {item.menuItem.name}
                </p>
                <p>
                  <DisplayPrice price={item.price} />
                </p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between">
              <p>{t('totalPrice')}</p>
              <p>
                <DisplayPrice price={validOrder.price} />
              </p>
            </div>
          </div>
        </div>
        <BackButton />
      </div>
    </section>
  );
}
