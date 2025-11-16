import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { verifyToken } from '@/lib/tokens';
import { Suspense } from 'react';

export default async function AccountVerificationPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ token: string }>;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountVerificationPageContent searchParams={searchParams} locale={locale} />
    </Suspense>
  );
}

async function AccountVerificationPageContent({
  searchParams,
  locale,
}: {
  searchParams: Promise<{ token: string }>;
  locale: string;
}): Promise<React.ReactNode> {
  const t = await getTranslations({ locale, namespace: 'accountVerification' });
  const token = (await searchParams).token;
  let result: { success?: boolean; error?: string; email?: string; userName?: string } | undefined;
  if (token) {
    try {
      result = await verifyToken(token);
    } catch (error) {
      result = {
        error: 'Invalid token',
      };
    }
  }

  // after(async () => {
  //   if (result?.success && result.email && result.userName) {
  //     await sendWelcomeEmail(result.email, result.userName);
  //   }
  // });

  return (
    <div className="flex w-full items-center justify-center bg-background rounded-3xl p-6">
      <div className="flex flex-col items-center justify-center gap-5">
        {result?.success && (
          <>
            <h2 className="text-3xl font-medium text-foreground text-center">{t('success')}</h2>
            <p className="text-lg text-muted-foreground text-center">{t('continue')}</p>
            <Link
              href={'/login'}
              className="rounded-lg bg-primary px-7 py-3 text-xl text-primary-foreground"
            >
              {t('signIn')}
            </Link>
          </>
        )}
        {result?.error && <h2 className="text-xl font-medium">{result?.error}</h2>}
      </div>
    </div>
  );
}
