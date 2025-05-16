import MenuSettingsForm from "@/app/[locale]/(website)/get-started/_components/MenuSettings/MenuSettingsForm";
import Mockup from "@/app/[locale]/(website)/get-started/_components/mockup/Mockup";
import React from "react";
import { checkUserAuthorized } from "../../_actions/authorization";
import {
  getSupportedLanguages,
  getSupportedSrcLanguagesDeepL,
  getSupportedTargetLanguagesDeepL,
} from "@/app/translation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
}: {
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName?.replaceAll("-", " ");
  const { business } = await checkUserAuthorized(businessName);
  const t = await getTranslations("menu settings");

  const srcLanguages = await getSupportedSrcLanguagesDeepL();
  const trgtLanguages = await getSupportedTargetLanguagesDeepL();

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">{t("title")}</h1>
        <SidebarTrigger className="lg:absolute top-3 left-2" />
        </div>
      <form className="flex lg:w-fit lg:flex-row gap-x-40 flex-col-reverse min-h-[600px] gap-y-20">
        <div className="flex flex-col gap-6 2xl:min-w-sm lg:max-w-lg max-h-full overflow-y-auto ">
          <MenuSettingsForm
            businessId={business.id}
            product={business.product}
            srcLanguages={srcLanguages}
            targetLanguages={trgtLanguages}
            menu={business.menu}
            setup={false}
          />
        </div>
        <Mockup initialTemplate={business.menu?.template ??"T1"} />
      </form>
    </div>
  );
}
