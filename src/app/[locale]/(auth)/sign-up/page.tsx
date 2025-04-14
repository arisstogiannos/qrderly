import React, { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import RegisterForm from "../_components/RegisterForm";
import { useTranslations } from "next-intl";
import Loader from "@/components/Loader";

export default function page() {
  const t = useTranslations("registerPage");

  return (
    <FormWrapper title={t("title")} subtitle={t("subtitle")}>
      <Suspense fallback={<div className="min-h-[350px] flex-center"><Loader className="size-20"/></div>}>
        <RegisterForm />
      </Suspense>
    </FormWrapper>
  );
}
