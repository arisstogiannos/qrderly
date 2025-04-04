"use client";
import PreparingAnimation from "@/components/PreparingAnimation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getOrderById } from "../../../_actions/orders";
import CheckAnimation from "@/components/CheckAnimation";
import { Order } from "@prisma/client";
import { OrderWithItems, RequiredOrder } from "@/types";

export default function OrderTracking({ initial }: { initial:RequiredOrder }) {
  const { data: order,isLoading } = useQuery({
    queryKey: [initial.id],
    queryFn: async () => await getOrderById(initial.id),
    refetchInterval:(query)=>query.state.data?.status==="PENDING"? 5000:false,
    initialData:initial
  });
 useEffect(() => {
  if (order?.status==="COMPLETED") {
    

    const playAudio = async () => {
      try {
        const audio = new Audio("/new-order-audio.mp3"); // Ensure the file exists in public/
        await audio.play(); // Handle promise rejection properly
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    };

    playAudio(); // Call the async function
  }
}, [order]);
  
  if (!order) return <div></div>;
  return order.status === "PENDING" || isLoading ? (
    <>
      <h2 className="text-3xl font-medium">Order Received!</h2>
      <p className="text-foreground/50 font-normal">
        We'll notify you when your order is ready!
      </p>
      <div className="my-4">
        <PreparingAnimation />
      </div>
    </>
  ) : (
    <>
      <h2 className="text-3xl font-medium">Your Order is Ready!</h2>
      <p className="text-foreground/50 font-normal mx-auto text-center mt-1">
      Please show the order number when collecting your order
      </p>
      <div className="my-4">
        <CheckAnimation />
      </div>
    </>
  );
}
