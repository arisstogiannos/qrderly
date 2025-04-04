"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { usePlanContext } from "./PlanContext";

import { BusinessExtended, ProductURL } from "@/types";
import { BillingType, Business, Product, UserRole } from "@prisma/client";
import { productMap } from "@/data";
import { User } from "next-auth";
import { createFreeSubscription, createSession } from "../../subscriptionActions";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

type thisProps = {
  plan: {
    title: string;
    billing: {
      yearly: { price: string; payment_link: string; price_id: string };
      monthly: { price: string; payment_link: string; price_id: string };
    };
    bullets: string[];
  };
  user?: {
    role: UserRole;
    business: BusinessExtended[];
  } & User;
};

export default function Plan({ plan, user }: thisProps) {
  const { selectedPlanType } = usePlanContext();

  const productUrl: ProductURL = plan.title
    .toLowerCase()
    .replaceAll(" ", "-") as ProductURL;

  const billing =
    selectedPlanType === "yearly" ? BillingType.YEARLY : BillingType.MONTHLY;
  const product =
    productMap[plan.title.toLowerCase().replaceAll(" ", "-") as ProductURL];

  const business = user?.business.find(
    (b) =>
      b.product === product &&
      b.subscription &&
      b.subscription.billing === "FREETRIAL"
  );

  const businessId = business?.id ?? "";

  // const [state, action, isPending] = useActionState(
  //   createFreeSubscription.bind(null,  productUrl, businessId),
  //   null
  // );
  const t = useTranslations("plandata."+plan.title)

  return (
    <section className="bg-background border-2 border-primary/20 p-6 rounded-3xl flex flex-col gap-6 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-3xl">
      <h2 className="font-medium text-3xl">{t('title')}</h2>
      <span className="text-3xl font-semibold">
      {t('billing.'+selectedPlanType+".price")}
      </span>
      <ul className="space-y-2 text-lg mb-10">
        {plan.bullets.map((bullet,i) => (
          <li key={bullet} className="flex  gap-2 items-start">
            {/* <span className="bg-foreground size-3 shrink-0 rounded-full mt-2" /> */}
            <span className="bg-accent  text-background size-6 lg:size-8 rounded-full p-1 min-w-6 lg:min-w-8  flex-center ">
        <span className="bg-primary text-background size-4 lg:size-5 rounded-full p-1 min-w-4 lg:min-w-5  flex-center ">
          <Check />
        </span>
      </span>
            {t("bullets."+(i+1))}
          </li>
        ))}
      </ul>
      <div className=" flex flex-col gap-4 mt-auto">
        <Button
          onClick={createSession.bind(
            null,
            plan.billing[selectedPlanType].price_id,
            billing,
            product,
            "",
           "",
           "/get-started/"+productUrl+"/business-setup",
           "create your menu"
          )}
          className="rounded-full bg-foreground text-xl py-6"
        >
          Choose
        </Button>
        {!business ? (
          <Button
            variant={"outline"}
            className="rounded-full  text-xl py-6 w-full"
            onClick={createFreeSubscription.bind(null, productUrl, businessId)}
            asChild
          >
            <Link href={"/get-started/" + productUrl + "/business-setup"}>
              Free Trial
            </Link>
          </Button>
        ) : (
          <Button
            onClick={createSession.bind(
              null,
              plan.billing[selectedPlanType].price_id,
              billing,
              product,
              businessId,
              business?.subscription.id ?? "",
              "/",
              "go back to homepage"
            )}
            variant={"outline"}
            className="rounded-full  text-xl py-6 w-full whitespace-normal "
            
          >
            Upgrade {business.name} To Pro
          </Button>
        )}
      </div>
    </section>
  );
}
