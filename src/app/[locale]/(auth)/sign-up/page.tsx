import React, { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import RegisterForm from "../_components/RegisterForm";
import { useTranslations } from "next-intl";

export default function page() {
  const t = useTranslations("registerPage");

  return (
    <FormWrapper title={t("title")} subtitle={t("subtitle")}>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </FormWrapper>
  );
}
