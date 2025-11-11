'use client';
import { BillingType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';
import { getSale } from '@/app/[locale]/banner';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { productMap } from '@/data';
import { Link } from '@/i18n/navigation';
import type { ProductURL } from '@/types';
import { createFreeSubscription, createSession } from '../../subscriptionActions';
import { usePlanContext } from './PlanContext';

type thisProps = {
  plan: {
    title: string;
    billing: {
      yearly: { price: string; payment_link: string; price_id: string };
      monthly: { price: string; payment_link: string; price_id: string };
    };
    bullets: string[];
  };
  index: number;
};

export const dynamic = 'error';

export default function Plan({ plan, index }: thisProps) {
  const { selectedPlanType } = usePlanContext();
  const t = useTranslations('plandata');
  const [showSale, setShowSale] = useState(false);

  const { data } = useQuery({
    queryFn: async () => {
      return await getSale();
    },
    queryKey: ['banner'],
  });

  // Show sale after component mounts for animation
  useEffect(() => {
    if (data) {
      const t = setTimeout(() => {
        setShowSale(true);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [data]);

  // Get the original price from translations
  const originalPrice = t(`${plan.title}.billing.${selectedPlanType}.price`);

  // Calculate the sale price (20% off)
  // This assumes the price is in a format like "$99/month" or "€50"
  const calculateSalePrice = (price: string) => {
    // Extract the numeric part using regex
    const numericMatch = price.match(/(\d+(\.\d+)?)/);
    if (!numericMatch) return price;

    const numericValue = Number.parseFloat(numericMatch[0]);
    const saleValue = numericValue * 0.8; // 20% off

    // Replace the original numeric value with the sale value
    return price.replace(numericMatch[0], saleValue.toFixed(2));
  };

  const salePrice = calculateSalePrice(originalPrice);

  return (
    <section className="bg-background border-2 border-primary/20 p-6 rounded-3xl flex flex-col gap-6 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-3xl">
      <h2 className="font-medium text-3xl h-20 ">{t(`${plan.title}.title`)}</h2>

      {data ? (
        <div className="flex  gap-2 flex-col mb-3">
          {/* Original price with strikethrough, fades out */}
          <span
            className={`text-3xl font-semibold  transition-all duration-500  origin-left ${
              showSale ? 'opacity-70 scale-80 line-through text-muted-foreground' : 'opacity-100'
            }`}
          >
            {originalPrice}
          </span>

          {/* Sale price, fades in */}
          <div className="flex items-center gap-2">
            <span
              className={`text-3xl font-bold text-primary transition-all duration-500  ${
                showSale ? 'opacity-100 scale-100' : 'opacity-0 scale-90 -translate-x-4'
              }`}
            >
              {salePrice}
            </span>

            {/* Sale badge */}
            <span
              className={`bg-primary text-background text-sm font-bold px-2 py-1 rounded-full transition-all duration-500 ${
                showSale ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              20% OFF
            </span>
          </div>
        </div>
      ) : (
        <span className="text-3xl font-semibold  transition-all duration-500  origin-left mb-3">
          {originalPrice}
        </span>
      )}

      <ul className="space-y-2 text-lg mb-10">
        {plan.bullets.map((bullet, i) => (
          <li key={bullet} className="flex gap-2 items-start">
            <span className="bg-accent text-background size-6 lg:size-8 rounded-full p-1 min-w-6 lg:min-w-8 flex-center">
              <span className="bg-primary text-background size-4 lg:size-5 rounded-full p-1 min-w-4 lg:min-w-5 flex-center">
                <Check />
              </span>
            </span>
            {t(`${plan.title}.bullets.${i + 1}`)}
          </li>
        ))}
      </ul>

      <Suspense fallback={<ButtonFallback />}>
        <Buttons plan={plan} />
      </Suspense>
    </section>
  );
}

function Buttons({
  plan,
}: {
  plan: {
    title: string;
    billing: {
      yearly: { price: string; payment_link: string; price_id: string };
      monthly: { price: string; payment_link: string; price_id: string };
    };
    bullets: string[];
  };
}) {
  const { selectedPlanType } = usePlanContext();
  const { data: session } = useSession();
  const t = useTranslations('plandata');
  const [loading, setLoading] = useState(false);
  const [loadingfree, setLoadingfree] = useState(false);
  const productUrl: ProductURL = plan.title.toLowerCase().replaceAll(' ', '-') as ProductURL;

  const billing = selectedPlanType === 'yearly' ? BillingType.YEARLY : BillingType.MONTHLY;
  const product = productMap[plan.title.toLowerCase().replaceAll(' ', '-') as ProductURL];

  const business = session?.user?.business.find(
    (b) => b.product === product && b.subscription && b.subscription.billing === 'FREETRIAL',
  );

  const businessId = business?.id ?? '';
  return (
    <div className=" flex flex-col gap-4 mt-auto">
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          createSession(
            plan.billing[selectedPlanType].price_id,
            billing,
            product,
            '',
            '',
            `/get-started/${productUrl}/business-setup`,
            'create your menu',
          );
        }}
        className="rounded-full bg-foreground text-xl py-6"
      >
        {loading ? <Loader className="text-xs h-6" /> : t('button')}
      </Button>

      {!business ? (
        <Button
          disabled={loadingfree}
          variant={'outline'}
          className="rounded-full  text-xl py-6 w-full"
          onClick={() => {
            setLoadingfree(true);
            createFreeSubscription(productUrl, businessId);
          }}
          asChild
        >
          <Link
            href={{
              pathname: '/get-started/[product]/business-setup',
              params: { product: productUrl },
            }}
          >
            {loadingfree ? <Loader className="text-xs h-6" /> : t('free')}
          </Link>
        </Button>
      ) : (
        <Button
          disabled={loadingfree}
          onClick={() => {
            setLoadingfree(true);
            createSession(
              plan.billing[selectedPlanType].price_id,
              billing,
              product,
              businessId,
              business?.subscription?.id ?? '',
              '/',
              'go back to homepage',
            );
          }}
          variant={'outline'}
          className="rounded-full  text-xl py-6 w-full whitespace-normal "
        >
          {loadingfree ? (
            <Loader className="text-xs h-6" />
          ) : (
            t('upgrade', { business: business.name })
          )}
        </Button>
      )}
    </div>
  );
}

function ButtonFallback() {
  return (
    <div className=" flex flex-col gap-4 mt-auto animate-pulse">
      <Button className="rounded-full bg-foreground text-xl py-6" />

      <Button variant={'outline'} className="rounded-full  text-xl py-6 w-full" />
    </div>
  );
}
