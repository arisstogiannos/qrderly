import { cacheLife, cacheTag } from 'next/cache';
import { type ReactNode } from 'react';
import { CurrencyProvider } from '@/context/CurrencyProvider';
import { getCurrency } from './_actions/business';

async function getCurrencyCached(businessName: string) {
  'use cache';
  cacheTag(`currency${businessName}`);
  cacheLife('max');

  return getCurrency(businessName);
}

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  'use cache';
  const businessName = (await params).businessName.replaceAll('-', ' ');
  cacheTag(`${businessName}`);
  cacheLife('max');

  const result = await getCurrencyCached(businessName);

  return <CurrencyProvider currency={result?.currency ?? 'EUR'}>{children}</CurrencyProvider>;
}
