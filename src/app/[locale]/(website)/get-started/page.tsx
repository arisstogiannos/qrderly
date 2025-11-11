import { ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Suspense } from 'react';
import { productsData } from '@/data';
import type { ProductType } from '@/types';
import { MainButtonLinkAuth } from '../(landing page)/_sections/hero/MainButton';

export const dynamic = 'error';

export default async function page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;
  setRequestLocale(locale);

  const t = await getTranslations('get started');
  return (
    <div className="flex flex-col gap-10 3xl:px-20">
      <h1 className="mx-auto font-medium text-2xl  max-w-xl text-center">{t('title')}</h1>
      <div className="grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 gap-x-16 gap-y-8">
        {productsData.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </div>
  );
}

async function ProductCard({ product }: { product: ProductType }) {
  const t = await getTranslations('productsData');

  return (
    <div className="gap-y-2 bg-accent p-6 rounded-3xl flex flex-col hover:scale-105 transition-transform duration-300">
      <h2 className="md:text-xl font-medium capitalize ">{t(`${product.title}.title`)}</h2>
      <h3 className="mb-5">{t(`${product.title}.shortDesc`)}</h3>
      <Suspense>
        <MainButtonLinkAuth
          className="mt-auto shadow-none bg-primary hover:text-background"
          href={`/get-started/${product.link}/business-setup`}
          redirectUrl={`/get-started/${product.link}/business-setup`}
        >
          {t('button')} <ArrowRight />
        </MainButtonLinkAuth>
      </Suspense>
    </div>
  );
}
