import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { notFound, redirect } from "next/navigation";
import React from "react";
import Stripe from "stripe";

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
    <section className="h-[80vh] flex items-center justify-center w-full">
      <div className="flex  flex-col items-center text-myBlack gap-y-2">
        <CheckCircle2 className="size-40 text-green-500 mb-4 " />
        <h1 className="text-3xl font-bold text-center">Payment Successful</h1>
        <p className="text-center max-w-lg">
          Thank you for your purchase! You will receive an email with your receipt and subscription information.
        </p>
        <Button asChild>

        <Link
          href={successPageLink}
          className=" capitalize mt-6"
          >
          {successPageButton}
        </Link>
          </Button>
      </div>
    </section>
  );
}
