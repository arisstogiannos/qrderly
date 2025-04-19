import React, { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import RegisterForm from "../_components/RegisterForm";
import Loader from "@/components/Loader";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function page({params}:{params: Promise<{locale: string}>}) {
  const locale = (await params).locale;
  setRequestLocale(locale)
  const t = await getTranslations("registerPage");

  return (
    <FormWrapper title={t("title")} subtitle={t("subtitle")}>
      <Suspense fallback={<div className="min-h-[350px] flex-center"><Loader className="size-20"/></div>}>
        <RegisterForm />
      </Suspense>
    </FormWrapper>
  );
}
