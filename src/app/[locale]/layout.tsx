import {setRequestLocale} from 'next-intl/server';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
 
export default async function Layout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params:Promise<{ locale: string}>
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      <NextIntlClientProvider >{children}</NextIntlClientProvider>
    </>
  );
}
