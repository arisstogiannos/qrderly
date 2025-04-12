import React from "react";
import { getOrderById } from "../../../_actions/orders";
import { redirect } from "next/navigation";
import OrderTracking from "../_components/OrderTracking";
import BackButton from "../_components/BackButton";
import DisplayPrice from "@/components/DisplayPrice";

export default async function page({
  searchParams,
  params
}: {
  searchParams: Promise<{ order: string }>;
  params: Promise<{ businessName: string }>;
}) {
  const businessName = (await params).businessName.replaceAll("-", " ");
  const orderId = (await searchParams).order;
  const validOrder = await getOrderById(orderId);
  if (!validOrder) redirect("/unauthorized");
  return (
    <section className="h-screen flex-center  w-full">
      <div className="flex  flex-col items-center mx-5 w-full bg-secondary rounded-3xl p-6">
        <OrderTracking initial={validOrder} businessName={businessName} />
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
                <p>
                  <DisplayPrice price={item.price } />
                </p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between">
              <p>Total Price</p>
              <p>
                <DisplayPrice price={validOrder.price } />
              </p>
            </div>
          </div>
        </div>
        <BackButton />
      </div>
    </section>
  );
}
