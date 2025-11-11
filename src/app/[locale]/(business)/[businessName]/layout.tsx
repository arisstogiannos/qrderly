import { cacheLife, cacheTag } from 'next/cache';
import { type ReactNode } from 'react';
import { CurrencyProvider } from '@/context/CurrencyProvider';
import { getCurrency } from './_actions/business';

async function getCurrencyCached(businessName: string) {
  'use cache';
  cacheTag(`currency${businessName}`);
  cacheLife({ revalidate: 60 * 60 * 24 });

  return getCurrency(businessName);
}

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll('-', ' ');

  const result = await getCurrencyCached(businessName);

  return <CurrencyProvider currency={result?.currency ?? 'EUR'}>{children}</CurrencyProvider>;
}
