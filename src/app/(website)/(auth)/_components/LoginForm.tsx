"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { signIn as signInAuth } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { Loader2 } from "lucide-react";
import { login } from "../_actions/login";

export default function LoginForm() {
  const [state, loginAction, isPending] = useActionState(login, null);
  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const loginError = searchParams.get("error");
  let loginErrorMessage = "";
  if (loginError === "OAuthAccountNotLinked") {
    loginErrorMessage = "Try logging in the same way you signed up";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <form action={loginAction}>
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
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
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
        <div className="flex flex-col gap-3">
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : "Sign in"}
          </Button>
          <Button
            type="button"
            onClick={() => signInAuth("google", { callbackUrl: "/" })}
            variant={"outline"}
          >
            Sign in with Google
          </Button>{" "}
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
      <div className=" space-y-10 pb-1 mt-10">
        {loginError && <ErrorMessage msg={loginErrorMessage} />}
        {state?.error && <ErrorMessage msg={state?.error} />}
        {state?.success && (
          <SuccessMessage msg="A verification code has been sent to your email!" />
        )}
        <div className="mt-auto self-end text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 lg:hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </form>
  );
}
