"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BillingType } from "@prisma/client";
import { CreditCard, Stars } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function SubscriptionStatusCard({
  title,
  billing,
  price,
  scans,
}: {
  title: string;
  price: string;
  billing: BillingType;
  scans: number;
}) {
  const t = useTranslations('dashboard')
  const isFreeTrial = billing === "FREETRIAL";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("subscription.title")}</CardTitle>
        <CardDescription>{t("subscription.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              {isFreeTrial ? t("subscription.freeTrial") : t("subscription.proPlan")}
            </h3>
            {!isFreeTrial ? (
              <p className="text-sm text-muted-foreground">
                {price}, {t("subscription.billed")} {billing.toLowerCase()}
              </p>
            ) : null}
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                {t("subscription.trafficLimit")}: {isFreeTrial ? "200 scans" : t("subscription.unlimited")}
              </p>
              {isFreeTrial ?<p className="text-sm">{t("subscription.remaining")}: {200 - scans}</p> : null}

              <Button className="w-full mt-4" asChild>
                <Link
                  target="_blank"
                  href={
                    "https://billing.stripe.com/p/login/14kbLiaQugGt4bm4gg" 
                  }
                >
                  <Stars />
                  {t("subscription.manage")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
