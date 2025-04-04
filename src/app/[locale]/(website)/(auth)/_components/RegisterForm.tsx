"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState, useState } from "react";
import { register } from "../_actions/register";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { Loader2 } from "lucide-react";
import { signIn as signInAuth } from "next-auth/react";

export default function RegisterForm() {
  const [state, registerAction, isPending] = useActionState(register, null);

  // Local state to manage form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const searchParams = useSearchParams();
  const registerError = searchParams.get("error");
  let registerErrorMessage = "An error has occured. Try again";
  if (registerError === "OAuthAccountNotLinked") {
    registerErrorMessage = "Try logging in the same way you signed up";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let passwordsMatch = formData.confirmPassword === formData.password

  return (
    <form action={registerAction}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
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
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
           
          </div>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={formData.confirmPassword.length>0?passwordsMatch?"ring-2 ring-green-500 focus-visible:ring-green-500":"ring-2 ring-red-500 focus-visible:ring-red-500 ":""}
          />

          {state?.errors?.password?.map((er) => {
            return (
              <ErrorMessage
                key={er}
                classNames="text-sm bg-transparent p-0 "
                msg={er}
              />
            );
          })}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="confirm-password">Confirm Password</Label>
          </div>
          <Input
            id="confirm-password"
            type="confirm-password"
            autoComplete="current-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={formData.confirmPassword.length>0?passwordsMatch?"ring-2 ring-green-500 focus-visible:ring-green-500":"ring-2 ring-red-500 focus-visible:ring-red-500 ":""}

            required
          />
           {state?.errors?.confirmPassword?.map((er) => {
            return (
              <ErrorMessage
                key={er}
                classNames="text-sm bg-transparent p-0 "
                msg={er}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          <Button disabled={isPending } type="submit" className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : "Sign up"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => signInAuth("google")}
            className="w-full"
          >
            Sign up with Google
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
      <div className="  space-y-5 pb-1 pt-5">
        {registerError && <ErrorMessage msg={registerErrorMessage} />}
        {state?.success && (
          <SuccessMessage msg="A verification code has been sent to your email" />
        )}
        <div className="mt-auto self-end text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 lg:hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </form>
  );
}
