import React from "react";
import { getOrderById } from "../../../_actions/orders";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import CheckAnimation from "@/components/CheckAnimation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatter";
import BackButton from "../_components/BackButton";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ order: string }>;
}) {
  const orderId = (await searchParams).order;
  const validOrder = await getOrderById(orderId);
  if (!validOrder) redirect("/unauthorized");
  return (
    <section className="h-screen flex-center  w-full">
      <div className="flex  flex-col items-center mx-5 w-full bg-secondary rounded-3xl p-6">
        <h2 className="text-3xl font-medium">Your Order is Ready!</h2>
        {/* <p className="text-foreground/50 font-normal mx-auto text-center mt-1">
          Please show the order number when collecting your order
        </p> */}
        <div className="my-4">
          <CheckAnimation />
        </div>
        <div className="w-full h-28 bg-background rounded-2xl flex-center text-primary text-3xl font-semibold">
          Order #{validOrder.id.substring(0, 5)}
        </div>
        <div className="w-full  bg-background rounded-2xl space-y-8 p-4 mt-5">
          <p>Order Summary</p>
          <div className="w-full space-y-3 ">
            {validOrder.orderItems.map((item, i) => (
              <div className="flex justify-between text-foreground/50" key={i}>
                <p>
                  {item.quantity}x {item.menuItem.name}
                </p>
                <p>{formatCurrency(item.price / 100)}</p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between">
              <p>Total Price</p>
              <p>{formatCurrency(validOrder.price/100)}</p>
            </div>
          </div>
        </div>
       <BackButton/>
      </div>
    </section>
  );
}
