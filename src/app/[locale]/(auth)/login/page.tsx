import { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import LoginForm from "../_components/LoginForm";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("loginPage");

  return (
    <FormWrapper title={t("title")} subtitle={t("subtitle")}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </FormWrapper>
  );
}
