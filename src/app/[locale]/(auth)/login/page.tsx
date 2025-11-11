import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { FormWrapper } from '../_components/FormWrapper';
import LoginForm from '../_components/LoginForm';

export default function Page() {
  const t = useTranslations('loginPage');

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
