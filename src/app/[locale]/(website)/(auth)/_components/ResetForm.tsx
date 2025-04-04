"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { resetPassword } from "../_actions/reset-password";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { FormWrapper } from "./FormWrapper";
import Loader from "@/components/Loader";

export default function ResetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, resetAction, isPending] = useActionState(resetPassword, null);

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormWrapper title="reset your password" subtitle="We will send you an email with a link. Click on it to change your password.">

     <form action={resetAction} className="min-h-[100px]">
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
            <Input
              autoComplete="email"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            {state?.errors?.email?.map((er) => {
              return (
                <ErrorMessage
                  key={er}
                  classNames="text-sm bg-transparent p-0 "
                  msg={er}
                />
              );
            })}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="mt-3 w-full p-6 text-lg"
          >
            {isPending ? (
              <Loader  />
            ) : (
              "Send reset code"
            )}
          </Button>
          {/* Other elements */}
        </div>
      {(state?.errors?.email || state?.success) &&<div className="mt-6  space-y-10 pb-1">
        {state?.errors?.email && <ErrorMessage msg={state?.errors.email[0]} />}
        {state?.success && (
          <SuccessMessage msg="A reset link has been sent to your email!" />
        )}
      </div>}
        </form>
        </FormWrapper>
  );
}
