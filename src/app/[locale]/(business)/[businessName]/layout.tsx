import React, { type ReactNode } from "react";
import { cache } from "@/lib/cache";
import { getCurrency } from "./_actions/business";
import { CurrencyProvider } from "@/context/CurrencyProvider";

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");

  const getCurrencyCache = cache(getCurrency, [`currency${businessName}`], {
    tags: [`currency${businessName}`],
  });

  const result = await getCurrencyCache(businessName);

  return (
    <CurrencyProvider currency={result?.currency ?? "EUR"}>
      {children}
    </CurrencyProvider>
  );
}
