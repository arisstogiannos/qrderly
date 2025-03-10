import React, { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import RegisterForm from "../_components/RegisterForm";

export default function page() {
  return (
    <FormWrapper title="register" subtitle="create an account">
      <Suspense>

      <RegisterForm />
      </Suspense>
    </FormWrapper>
  );
}
