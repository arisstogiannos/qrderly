"use client";
import PreparingAnimation from "@/components/PreparingAnimation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getOrderById } from "../../../_actions/orders";
import CheckAnimation from "@/components/CheckAnimation";
import type { RequiredOrder } from "@/types";
import { useTranslations } from "next-intl";


export default function OrderTracking({
  initial,
  businessName,
}: {
  initial: RequiredOrder;
  businessName: string;
}) {
  const { data: order, isLoading } = useQuery({
    queryKey: [initial.id],
    queryFn: async () => await getOrderById(initial.id),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 5000 : false,
    initialData: initial,
  });
  const t = useTranslations("menus.order");
  useEffect(() => {
    if (order?.status === "COMPLETED") {
      document.cookie = `${businessName}order=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

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

  if (!order) return null;
  return order.status === "PENDING" || isLoading ? (
    <>
      <h2 className="text-3xl font-medium">{t("orderReceived")}</h2>
      <p className="text-foreground/50 font-normal">
        {t("orderReceivedDescription")}
      </p>
      <div className="my-4">
        <PreparingAnimation />
      </div>
    </>
  ) : (
    <>
      <h2 className="text-3xl font-medium">{t("orderReady")}</h2>
      <p className="text-foreground/50 font-normal mx-auto text-center mt-1">
        {t("orderReadyDescription")}
      </p>
      <div className="my-4">
        <CheckAnimation />
      </div>
    </>
  );
}
