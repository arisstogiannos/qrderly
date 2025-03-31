import { Suspense } from "react";
import { FormWrapper } from "../_components/FormWrapper";
import LoginForm from "../_components/LoginForm";

export default function Page() {
  return (
    <FormWrapper title="Welcome back" subtitle="login to your account">
      <Suspense>
        <LoginForm />
      </Suspense>
    </FormWrapper>
  );
}
