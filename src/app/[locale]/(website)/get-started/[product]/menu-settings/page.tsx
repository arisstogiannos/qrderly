import React from "react";
import MenuSettingsForm from "../../_components/MenuSettings/MenuSettingsForm";
import type { ProductURL } from "@/types";
import Mockup from "../../_components/mockup/Mockup";
import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import {
  getSupportedSrcLanguagesDeepL,
  getSupportedTargetLanguagesDeepL,
} from "@/app/translation";
import { productMap } from "@/data";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import BackButton from "../../_components/BackButton";

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

  const srcLanguages = await getSupportedSrcLanguagesDeepL();
  const trgtLanguages = await getSupportedTargetLanguagesDeepL();
  const t = await getTranslations("menu settings");

  const result = await checkUser(product);

  if (!result) {
    redirect(`/get-started/${product}/business-setup`);
  }

  if (!b) {
    if (result.redirect === "unpublishedMenu") {
      redirect(`/get-started/${product}/publish`);
    }
    if (result.redirect === "emptyMenu") {
      redirect(`/get-started/${product}/generate-items`);
    }
    if (result.redirect === "noUnsetBusiness") {
      redirect(`/get-started/${product}/business-setup`);
    }
  } else {
    if (b !== result.business.id) {
      redirect("/unauthorized");
    }
  }
  return (
    <form className="flex lg:justify-between lg:flex-row gap-x-40 flex-col-reverse min-h-[600px] gap-y-6">
      <div className="space-y-8">
        <div className="flex items-center gap-x-5">
          <h1 className="text-2xl font-medium">{t("title")}</h1>
          <BackButton
            href={`/get-started/${product}/business-setup`}
            businessId={result.business.id}
          />
        </div>
        <div className="flex flex-col gap-6 2xl:min-w-sm lg:pr-10 lg:max-w-sm max-h-[550px] overflow-y-auto ">
          <MenuSettingsForm
            businessId={result.business.id}
            product={productMap[product]}
            srcLanguages={srcLanguages}
            targetLanguages={trgtLanguages}
            menu={result.business.menu}
            setup={true}
          />
        </div>
      </div>
      <Mockup initialTemplate={result.business.menu?.template ?? "T1"} />
    </form>
  );
}
