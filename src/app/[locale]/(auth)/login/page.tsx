import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { FormWrapper } from '../_components/FormWrapper';
import LoginForm from '../_components/LoginForm';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'loginPage' });
  return (
    <FormWrapper title={t('title')} subtitle={t('subtitle')}>
      <Suspense
        fallback={
          <div className="min-h-[350px] flex-center">
            <Loader />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </FormWrapper>
  );
}
