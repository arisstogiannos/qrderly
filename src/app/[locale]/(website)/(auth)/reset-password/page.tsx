import React, { Suspense } from "react";
import ResetForm from "../_components/ResetForm";
import { FormWrapper } from "../_components/FormWrapper";
import { NewPasswordForm } from "../_components/NewPasswordForm";
import { verifyResetToken } from "@/lib/tokens";
import { ErrorMessage } from "@/components/Messages";

async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <Suspense>
        <ResetForm />
      </Suspense>
    );
  } else {
    const result = await verifyResetToken(token);

    if (!result.success) {
      return <ErrorMessage msg="An error ocuured. Try again!" />;
    }
  

    return (
      <Suspense>
        <NewPasswordForm token={result.token}  />
      </Suspense>
    );
  }
}

export default ResetPage;
