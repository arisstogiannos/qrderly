"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";
import { createSession } from "../../subscriptionActions";
import { BillingType } from "@prisma/client";
import { ExtendedUser, ProductURL } from "@/types";
import { productMap } from "@/data";
import Loader from "@/components/Loader";

type thisProps = {
  plan: {
    title: string;
    billing: {
      yearly: { price: string; payment_link: string; price_id: string };
      monthly: { price: string; payment_link: string; price_id: string };
    };
    bullets: string[];
    free: string[];
    pro: string[];
  };
  businessId: string;
  user?: ExtendedUser;
  action: () => void;
};

export function ChooseTier({ plan, user, businessId, action }: thisProps) {
  const [billingState, setBillingState] = useState<BillingType>("YEARLY");
  const [isPending, setIsPending] = useState(false);

  const product = plan.title.toLowerCase().replaceAll(" ", "-") as ProductURL;

  const unpublishedTrial = user?.subscriptions.find(
    (s) =>
      s.businessId == null &&
      s.billing === "FREETRIAL" &&
      s.product === productMap[product]
  );
  const hasActiveFreeTrial = user?.business.find(
    (b) =>
      b.subscription &&
      b.subscription.billing === "FREETRIAL" &&
      b.product === productMap[product] &&
      b.menu &&
      b.menu.published
  );

  return (
    <form className="grid md:grid-cols-2 lg:grid-rows-[auto_auto] grid-rows-[auto_auto_auto] gap-x-10 gap-y-5  rounded-2xl  lg:w-xl  overflow-y-auto">
      <Switch billing={billingState} setBilling={setBillingState} />
      {!hasActiveFreeTrial && (
        <div className="p-4 border-primary border-2 rounded-xl gap-y-4 flex flex-col h-full ">
          <p className="text-xl font-semibold">Trial</p>
          <p className="text-xl font-medium">Free</p>
          <ul className="space-y-3">
            {plan.free.map((bullet) => (
              <li key={bullet} className="flex gap-3 items-center">
                <span className="bg-foreground text-background size-6 rounded-full p-1 min-w-6  flex-center">
                  <Check />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <Button formAction={action} className="w-full mt-auto">
            Continue
          </Button>
        </div>
      )}
      <div className="p-4 border-primary border-2 rounded-xl gap-y-4 flex flex-col h-full ">
        <p className="text-xl font-medium">Pro</p>

        <p className="text-xl font-semibold">
          {
            plan.billing[billingState === "MONTHLY" ? "monthly" : "yearly"]
              .price
          }
        </p>
        <ul className="space-y-3">
          {plan.pro.map((bullet) => (
            <li key={bullet} className="flex gap-3 items-center">
              <span className="bg-foreground text-background size-6 rounded-full p-1 min-w-6  flex-center">
                <Check />
              </span>
              {bullet}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => setIsPending(true)}
          disabled={isPending}
          formAction={createSession.bind(
            null,
            plan.billing[billingState === "MONTHLY" ? "monthly" : "yearly"]
              .price_id,
            billingState,
            productMap[product],
            businessId,
            unpublishedTrial?.id ?? "",
            "/get-started/" + product + "/publish",
            "procceed to publishing"
          )}
          className="w-full mt-auto"
        >
          {isPending ? <Loader /> : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Switch({
  setBilling,
  billing,
}: {
  setBilling: (v: BillingType) => void;
  billing: BillingType;
}) {
  return (
    <div className="relative  bg-background w-fit rounded-full px-1 py-1 col-span-full mx-auto border-2 border-primary">
      <div className="relative w-full h-full">
        <div
          className={`absolute w-1/2 h-full bg-primary rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
            billing === "YEARLY" ? "left-0" : "left-1/2"
          }`}
        ></div>
        <div className=" grid grid-cols-2 gap-10 items-center  bg-background w-fit rounded-full px-3 py-2">
          <button
            type="button"
            className={`z-10 text-center cursor-pointer transition-colors duration-300 delay-75 ${
              billing === "YEARLY" ? "text-background" : "text-foreground"
            }`}
            onClick={() => setBilling("YEARLY")}
          >
            Yearly (save 20%)
          </button>
          <button
            type="button"
            className={`z-10 text-center cursor-pointer transition-colors duration-300 delay-75 ${
              billing === "MONTHLY" ? "text-background" : "text-foreground"
            }`}
            onClick={() => setBilling("MONTHLY")}
          >
            Monthly
          </button>
        </div>
      </div>
    </div>
  );
}
