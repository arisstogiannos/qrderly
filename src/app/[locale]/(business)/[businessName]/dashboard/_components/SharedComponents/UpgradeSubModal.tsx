import React, { startTransition, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { BillingType, Product } from "@prisma/client";
import { BusinessExtended } from "@/types";
import { plandata } from "@/data";
import { createSession } from "@/app/[locale]/(website)/subscriptionActions";
import Loader from "@/components/Loader";

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
      title={t("Upgrade to Pro")}
      subtitle={t("Choose billing cycle")}
      trigger={
        <Button variant={"ghost"} className="w-full text-left justify-start font-medium">
          <Sparkles />
          {t("Upgrade to Pro")}
        </Button>
      }
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <Plan
        title={t("monthly")}
        btn={t("continue")}
          price={product.billing.monthly.price}
          btnFn={createSession.bind(
            null,
            product.billing.monthly.price_id,
            BillingType.MONTHLY,
            product.product,
            business.id,
            business.subscription.id ?? "",
            "/"+business.name.replaceAll(" ","-")+"/dashboard",
            "Go Back to Dashboard"
          )}
        />
        <Plan
        title={t("yearly")}
        btn={t("continue")}
          price={product.billing.yearly.price}
          btnFn={createSession.bind(
            null,
            product.billing.yearly.price_id,
            BillingType.YEARLY,
            product.product,
            business.id,
            business.subscription.id ?? "",
            "/"+business.name.replaceAll(" ","-")+"/dashboard",
            "Go Back to Dashboard"
          )}
        />
      </div>
    </Modal>
  );
}

function Plan({ price, btnFn ,title,btn}: { price: string; btnFn: () => Promise<void>,title:string,btn:string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
      setLoading(true);

    btnFn().finally(() => {
      setLoading(false);
    });
  };
  return (
    <div className="bg-background border-2 border-primary/20 p-6 rounded-3xl flex flex-col gap-6 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-3xl">
      <p className="text-lg font-bold">{title}</p>
      <p className="font-medium text-xl">{price}</p>
      <Button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg text-xl  w-full whitespace-normal"
      >
        {loading ? <Loader className="text-xs " /> : btn}
      </Button>
    </div>
  );
}
