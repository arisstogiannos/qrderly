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
import { BusinessExtended, ProductURL } from "@/types";
import React from "react";

export default function SubscriptionExpired({
  business,
}: {
  business: BusinessExtended;
}) {
  const isExpired = business.subscription?.hasExpired;
  let currentPlan = null;
  if (isExpired) {
    currentPlan = plandata.find(
      (plan) =>
        productMap[
          plan.title.toLowerCase().replaceAll(" ", "-") as ProductURL
        ] === business.product
    );
  }
  return (
    currentPlan && (
      <Dialog defaultOpen={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your subscription has expired</DialogTitle>
            <DialogDescription>
              Please renew your subscription to make your menu live again
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              onClick={createSession.bind(
                null,
                currentPlan.billing.monthly.price_id,
                "MONTHLY",
                business.product,
                business.id,
                business?.subscription?.id ?? "",
                "/" + business.name.replaceAll(" ", "-") + "/dashboard",
                "Go Back to Dashboard"
              )}
            >
              Subscribe Monthly {currentPlan.billing.monthly.price}
            </Button>
            <Button
              onClick={createSession.bind(
                null,
                currentPlan.billing.yearly.price_id,
                "YEARLY",
                business.product,
                business.id,
                business.subscription?.id ?? "",
                "/" + business.name.replaceAll(" ", "-") + "/dashboard",
                "Go Back to Dashboard"
              )}
            >
              {/* <Link href={currentPlan.billing.yearly.payment_link}> */}
              Subscribe Yearly {currentPlan.billing.yearly.price}
              {/* </Link> */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
