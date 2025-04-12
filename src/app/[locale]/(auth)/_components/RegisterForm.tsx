"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import React, { useActionState, useState } from "react";
import { register } from "../_actions/register";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { Loader2 } from "lucide-react";
import { signIn as signInAuth } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
  const [state, registerAction, isPending] = useActionState(register, null);
  const t = useTranslations("registerForm");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const searchParams = useSearchParams();
  const registerError = searchParams.get("error");
  let registerErrorMessage = t("error.generic");
  if (registerError === "OAuthAccountNotLinked") {
    registerErrorMessage = t("error.oauth");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let passwordsMatch = formData.confirmPassword === formData.password;

  return (
    <form action={registerAction}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            required
            value={formData.email}
            onChange={handleChange}
          />
          {state?.errors?.email?.map((er) => (
            <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
          ))}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder={t("passwordPlaceholder")}
            className={
              formData.confirmPassword.length > 0
                ? passwordsMatch
                  ? "ring-2 ring-green-500 focus-visible:ring-green-500"
                  : "ring-2 ring-red-500 focus-visible:ring-red-500 "
                : ""
            }
          />
          {state?.errors?.password?.map((er) => (
            <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
          ))}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="current-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t("confirmPasswordPlaceholder")}
            className={
              formData.confirmPassword.length > 0
                ? passwordsMatch
                  ? "ring-2 ring-green-500 focus-visible:ring-green-500"
                  : "ring-2 ring-red-500 focus-visible:ring-red-500 "
                : ""
            }
            required
          />
          {state?.errors?.confirmPassword?.map((er) => (
            <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : t("signUp")}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => signInAuth("google",{redirectTo:"/"})}
            className="w-full"
          >
            {t("signUpWithGoogle")}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="underline underline-offset-4">
          {t("signIn")}
        </Link>
      </div>
      <div className="space-y-5 pb-1 pt-5">
        {registerError && <ErrorMessage msg={registerErrorMessage} />}
        {state?.success && <SuccessMessage msg={t("verificationSent")} />}
        <div className="mt-auto self-end text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 lg:hover:[&_a]:text-primary">
          {t("termsAndPrivacy")}
        </div>
      </div>
    </form>
  );
}
