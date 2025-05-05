"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { signIn as signInAuth } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { Loader2 } from "lucide-react";
import { login } from "../_actions/login";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";

export default function LoginForm() {
  const [state, loginAction, isPending] = useActionState(login, null);
  const t = useTranslations("loginForm");

  useEffect(() => {
    if (state?.loggedIn) {
      location.href = "/get-started";
    }
  }, [state]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const loginError = searchParams.get("error");
  let loginErrorMessage = t("error.generic");
  if (loginError === "OAuthAccountNotLinked") {
    loginErrorMessage = t("error.oauth");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form action={loginAction} className="min-h-[350px]">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              href="/reset-password"
              className=" inline-block text-sm underline-offset-4 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder={t("passwordPlaceholder")}
          />
          {state?.errors?.password?.map((er) => (
            <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : t("signIn")}
          </Button>
          <Button
            type="button"
            onClick={() => signInAuth("google", { callbackUrl: "/get-started" })}
            variant={"outline"}
          >
            {t("signInWithGoogle")}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        {t("dontHaveAccount")}{" "}
        <Link href="/sign-up" className="underline underline-offset-4 lg:hover:text-primary">
          {t("signUp")}
        </Link>
      </div>
      <div className="space-y-10 pb-1 mt-10">
        {loginError && <ErrorMessage msg={loginErrorMessage} />}
        {state?.error && <ErrorMessage msg={state?.error} />}
        {state?.success && <SuccessMessage msg={t("verificationSent")} />}
        <div className="mt-auto self-end text-balance text-center text-xs text-muted-foreground ">
          {t.rich('termsAndPrivacy', {
            termsAndPrivacy: (chunks) => <Link href="/terms-and-conditions" className="underline underline-offset-4 lg:hover:text-primary">{chunks}</Link>,
            privacyPolicy: (chunks) => <Link href="/privacy-policy" className="underline underline-offset-4 lg:hover:text-primary">{chunks}</Link>
          })}
        </div>
      </div>
    </form>
  );
}
