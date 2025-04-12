import React from "react";
import { Modal } from "./Modal";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { BillingType, Product } from "@prisma/client";
import { BusinessExtended } from "@/types";
import { plandata } from "@/data";
import { createSession } from "@/app/[locale]/(website)/subscriptionActions";

export default function UpgradeSubModal({
  business,
}: {
  business: BusinessExtended;
}) {
  const t = useTranslations("admin.navbar");

  const product = plandata.find((plan) => plan.product === business.product);
  if (!product) return null;

  return (
    <Modal
      title="Upgrade To Pro"
      subtitle="Choose billing cycle"
      trigger={
        <Button variant={"ghost"} className="w-full text-left justify-start font-medium">
          <Sparkles />
          {t("Upgrade to Pro")}
        </Button>
      }
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <Plan
          price={product.billing.monthly.price}
          btnFn={createSession.bind(
            null,
            product.billing.monthly.price_id,
            BillingType.MONTHLY,
            product.product,
            business.id,
            business.subscription.id ?? "",
            "/"+business.name.replaceAll(" ","-")+"/dashboard",
            "go back to Dashboard"
          )}
        />
        <Plan
          price={product.billing.yearly.price}
          btnFn={createSession.bind(
            null,
            product.billing.yearly.price_id,
            BillingType.YEARLY,
            product.product,
            business.id,
            business.subscription.id ?? "",
            "/"+business.name.replaceAll(" ","-")+"/dashboard",
            "go back to Dashboard"
          )}
        />
      </div>
    </Modal>
  );
}

function Plan({ price, btnFn }: { price: string; btnFn: () => Promise<void> }) {
  return (
    <div className="bg-background border-2 border-primary/20 p-6 rounded-3xl flex flex-col gap-6 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-3xl">
      <p>{price}</p>
      <Button
        onClick={btnFn}
        // variant={"outline"}
        className="rounded-full  text-xl py-6 w-full whitespace-normal "
      >
        Up
      </Button>
    </div>
  );
}
