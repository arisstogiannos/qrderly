import { getTranslations } from 'next-intl/server';
import { productsData } from '@/data';
import Features from '../../products/_components/Features';

export default async function SomeFeatures() {
  const someFeatures = productsData[1].features.slice(0, 4);
  const t = await getTranslations('productsData.features');
  return (
    <div className="space-y-8">
      <h2 className="font-semibold text-primary">{t('title')}</h2>
      <Features features={someFeatures} theme="dark" />
    </div>
  );
}
