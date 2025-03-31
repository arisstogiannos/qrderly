import React from "react";
import MenuSettingsForm from "../../_components/MenuSettings/MenuSettingsForm";

import { ProductURL } from "@/types";

import Mockup from "../../_components/mockup/Mockup";
import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import {
  getSupportedLanguages,
  getSupportedSrcLanguagesDeepL,
  getSupportedTargetLanguagesDeepL,
  translateText,
} from "@/app/translation";
import { productMap } from "@/data";

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const product = (await params).product;
  if (!product) notFound();

  const srcLanguages = await getSupportedSrcLanguagesDeepL();
  const trgtLanguages = await getSupportedTargetLanguagesDeepL();

  const result = await checkUser(product);

  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result.redirect === "unpublishedMenu") {
    redirect("/get-started/" + product + "/publish");
  }
  if (result.redirect === "emptyMenu") {
    redirect("/get-started/" + product + "/generate-items");
  }
  if (result.redirect === "noUnsetBusiness") {
    redirect("/get-started/" + product + "/business-setup");
  }

  return (
    <form className="flex lg:justify-between lg:flex-row gap-x-40 flex-col min-h-[600px] gap-y-20">
      <div className="space-y-8">
        <h1 className="text-2xl font-medium">Menu Settings</h1>
        <div className="flex flex-col gap-6 2xl:min-w-sm lg:max-w-xs max-h-[550px] overflow-y-auto ">
          <MenuSettingsForm
            businessId={result.business.id}
            product={productMap[product]}
            srcLanguages={srcLanguages}
            targetLanguages={trgtLanguages}
          />
        </div>
      </div>
      <Mockup initialTemplate="T1" />
    </form>
  );
}
