import React from "react";
import BusinessSetupForm from "../../_components/Business/BusinessSetupForm";
import type { ProductURL } from "@/types";
import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ product: ProductURL }>;
  searchParams: Promise<{ b: string }>;
}) {
  const product = (await params).product;
  if (!product) notFound();

  const b = (await searchParams).b;

  const result = await checkUser(product);

  if (result && !b) {
    if (result.redirect === "businessWithoutMenu") {
      redirect(`/get-started/${product}/menu-settings`);
    }

    if (result.redirect === "noQR") {
      redirect(`/get-started/${product}/generate-items`);
    }
  
    if (result.redirect === "unpublishedMenu") {
      redirect(`/get-started/${product}/publish`);
    }
    if (result.redirect === "emptyMenu") {
      redirect(`/get-started/${product}/generate-items`);
    }
  }
  if(b && b!==result?.business.id){
    redirect("/unauthorized")
  }

  const t = await getTranslations("businessSetupForm")

  return (
    <section className="space-y-5 md:min-w-xl">
      <h1 className="text-2xl font-medium">{t("title")}</h1>
      <BusinessSetupForm existingBusiness={b ? result?.business : undefined} product={product} />
    </section>
  );
}
