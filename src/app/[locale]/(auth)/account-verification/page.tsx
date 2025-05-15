import { verifyToken } from "@/lib/tokens";
import { Link } from "@/i18n/navigation";
import React from "react";
import { sendWelcomeEmail } from "@/email/mail";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { after } from "next/server";

export default async function AccountVerificationPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ token: string }>;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("accountVerification");
  const token = (await searchParams).token;
  let result:
    | { success?: boolean; error?: string; email?: string; userName?: string }
    | undefined;
  if (token) {
    result = await verifyToken(token);
  }

  after(async () => {
    if (result?.success && result.email && result.userName) {
      await sendWelcomeEmail(result.email, result.userName);
    }
  });

  return (
    <div className="flex w-full items-center justify-center bg-background rounded-3xl p-6">
      <div className="flex flex-col items-center justify-center gap-5">
        {result?.success && (
          <>
            <h2 className="text-3xl font-medium text-foreground text-center">
              {t("success")}
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              {t("continue")}
            </p>
            <Link
              href={"/login"}
              className="rounded-lg bg-primary px-7 py-3 text-xl text-primary-foreground"
            >
              {t("signIn")}
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
