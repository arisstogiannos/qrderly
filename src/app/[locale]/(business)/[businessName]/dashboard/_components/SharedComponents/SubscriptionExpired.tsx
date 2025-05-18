"use client";
import { createSession } from "@/app/[locale]/(website)/subscriptionActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { plandata, productMap } from "@/data";
import type { BusinessExtended, ProductURL } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";

export default function SubscriptionExpired({
  business,
}: {
  business: BusinessExtended;
}) {
  const isExpired =
    business.subscription?.hasExpired ||
    (business.subscription?.billing === "FREETRIAL" &&
      business.menu &&
      business.menu?.noScans >= 200);
  let currentPlan = null;
  if (isExpired) {
    currentPlan = plandata.find(
      (plan) =>
        productMap[
          plan.title.toLowerCase().replaceAll(" ", "-") as ProductURL
        ] === business.product
    );
  }
  const t = useTranslations("subExpired");
  return (
    currentPlan && (
      <Dialog defaultOpen={!!currentPlan}>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 flex-col mt-4">
            <Button
              onClick={createSession.bind(
                null,
                currentPlan.billing.monthly.price_id,
                "MONTHLY",
                business.product,
                business.id,
                business?.subscription?.id ?? "",
                `/${business.name.replaceAll(" ", "-")}/dashboard`,
                "Go Back to Dashboard"
              )}
              className="h-12 lg:h-12"
            >
              {t("monthly", { price: currentPlan.billing.monthly.price })}
            </Button>
            <Button
              onClick={createSession.bind(
                null,
                currentPlan.billing.yearly.price_id,
                "YEARLY",
                business.product,
                business.id,
                business.subscription?.id ?? "",
                `/${business.name.replaceAll(" ", "-")}/dashboard`,
                "Go Back to Dashboard"
              )}
              className="h-12 lg:h-12"
            >
              {t("yearly", { price: currentPlan.billing.yearly.price })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
