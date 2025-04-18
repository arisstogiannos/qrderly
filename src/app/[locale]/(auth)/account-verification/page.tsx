
import { verifyToken } from "@/lib/tokens";
import {Link} from "@/i18n/navigation";

import React from "react";
import { sendWelcomeEmail } from "@/email/mail";

export default async function AccountVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;
  let result;
  if (token) {
    result = await verifyToken(token);
  }

  if(result?.success) await sendWelcomeEmail(result.email,result.userName)
 
  return (
    <div className="flex w-full items-center justify-center bg-background rounded-3xl p-6">
      <div className="flex flex-col items-center justify-center gap-5">
        {result?.success && (
          <>
            <h2 className="text-3xl font-medium text-foreground text-center">
              Your account has been verified succesfully!
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              Continue by signing in to your account
            </p>
            <Link
              href={"/login"}
              className="rounded-lg bg-primary px-7 py-3 text-xl text-primary-foreground"
            >
              Sign in
            </Link>
          </>
        )}
        {result?.error && (
          <h2 className="text-xl font-medium">{result?.error}</h2>
        )}
      </div>
    </div>
  );
}
