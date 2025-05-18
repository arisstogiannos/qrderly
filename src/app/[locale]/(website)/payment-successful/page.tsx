import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { GoogleTagManager } from "@next/third-parties/google";

import { notFound, redirect } from "next/navigation";
import React from "react";
import Stripe from "stripe";
import Confetti from "./Confetti";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id: string;
    successPageButton: string;
    successPageLink: string;
  }>;
}) {
  const user = (await auth())?.user;
  if (!user) return redirect("/sign-up");

  const paramSessionId = (await searchParams).session_id;
  const successPageButton = (await searchParams).successPageButton;
  const successPageLink = (await searchParams).successPageLink;

  try {
    const session = await stripe.checkout.sessions.retrieve(paramSessionId);

    if (session.id !== paramSessionId) return notFound();
    if (session.metadata?.userId !== user.id) {
      return notFound();
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return notFound();
  }

  //   const product = await db.product.findUnique({
  //     where: { id: paymentIntent.metadata.productId },
  //   });

  //   if (product == null) return notFound();

  //   const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="flex mt-20 items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Confetti />
      {/* <GoogleTagManager gtmId="GTM-W7D4ZMR5"  /> */}

      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base">
            Thank you for your subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2 pb-4">
          <p>Your subscription has been activated successfully.</p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href={successPageLink}>{successPageButton}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link
              href={
                `https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg?prefilled_email=${user.email}`
              }
            >
              View Subscription Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
