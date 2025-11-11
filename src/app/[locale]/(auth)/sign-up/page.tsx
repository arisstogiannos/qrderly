import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { FormWrapper } from '../_components/FormWrapper';
import RegisterForm from '../_components/RegisterForm';

export default async function page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const t = await getTranslations('registerPage');

  return (
    <FormWrapper title={t('title')} subtitle={t('subtitle')}>
      <Suspense
        fallback={
          <div className="min-h-[350px] flex-center">
            <Loader className="size-20" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </FormWrapper>
  );
}
