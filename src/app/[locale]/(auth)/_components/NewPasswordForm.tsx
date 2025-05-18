"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { newPassword } from "../_actions/reset-password";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { FormWrapper } from "./FormWrapper";
import Loader from "@/components/Loader";
import { useTranslations } from "next-intl";

export function NewPasswordForm({ token }: { token: string }) {
  const [state, newPasswordAction, isPending] = useActionState(newPassword, null);
  const t = useTranslations("newPasswordForm");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    formData.newPassword === formData.confirmPassword ||
    (formData.newPassword.length > 0 && formData.confirmPassword.length === 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (state?.success) {
    return (
      <FormWrapper title={t("title")} subtitle="">
        <div className="flex flex-col items-center justify-center space-y-6 p-6 md:p-8">
          <p className="text-center text-2xl font-medium ">
            {t("successMessage")}
          </p>
          <Button asChild className="mt-3 w-28 p-6 text-lg">
            <Link href={"/login"}>{t("signIn")}</Link>
          </Button>
        </div>
      </FormWrapper>
    );
  }
  return (
    <FormWrapper title={t("title")} subtitle="">
      <form action={newPasswordAction} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Input
              autoComplete="new-password"
              id="new-password"
              name="newPassword"
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              required
              value={formData.newPassword}
              onChange={handleChange}
            />
            {state?.errors?.newPassword?.map((er) => (
              <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
            ))}
          </div>
          <div className="grid gap-2">
            <Input
              autoComplete="new-password"
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("confirmPasswordPlaceholder")}
              className={`${!passwordsMatch ? " outline-1 outline-red-500 focus-visible:outline focus-visible:ring-0" : ""}`}
            />
            {state?.errors?.confirmPassword?.map((er) => (
              <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />
            ))}
          </div>
          <input type="hidden" name="token" value={token} />
          <Button
            disabled={isPending || !passwordsMatch}
            type="submit"
            className="mt-3 w-full p-6 text-lg"
          >
            {isPending ? <Loader /> : t("reset")}
          </Button>
        </div>
        {(state?.error || state?.errors?.token || state?.success) && (
          <div className="row-start-3 content-end space-y-10 pb-1">
            {state?.error && <ErrorMessage msg={state.error} />}
            {state?.errors?.token && <ErrorMessage msg={state.errors.token[0]} />}
            {state?.success && <SuccessMessage msg={state.success} />}
          </div>
        )}
      </form>
    </FormWrapper>
  );
}
