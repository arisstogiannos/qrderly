import Image from "next/image";
import React from "react";
import { ProductURL } from "@/types";

import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Publish from "../../_components/Publish";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Lightbulb,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const product = (await params).product;
  const t = await getTranslations("publish");
  if (!product) notFound();

  const result = await checkUser(product);

  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result?.redirect === "businessWithoutMenu") {
    redirect("/get-started/" + product + "/menu-settings");
  }

  if (result.redirect === "noQR") {
    redirect("/get-started/" + product + "/customize-qr");
  }
  // if (result.redirect === "noUnsetBusiness") {
  //   redirect("/get-started/" + product + "/business-setup");
  // }

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* Confetti-style header */}
        <div className="relative mb-12 text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-64 h-64 rounded-full bg-green-200 blur-3xl"></div>
            <div className="w-64 h-64 rounded-full bg-amber-200 blur-3xl -ml-20"></div>
          </div>

          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t("heading")}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </div>

        <Card className="  mb-12 overflow-hidden border-amber-200 bg-gradient-to-r from-yellow-50 to-yellow-100 py-0">
          <div className="p-4 flex items-start gap-4">
            <div className="shrink-0 bg-amber-200 p-2 rounded-full">
              <Lightbulb className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                {" "}
                {t("proTipTitle")}
              </h3>
              <p className="text-amber-800">{t("proTipDescription")}</p>
              <div className="mt-4 flex flex-wrap gap-2 items-end">
                <span className="text-amber-800">{t("reviewLabel")}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  {t("reviewItemCategory")}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  {t("reviewPrices")}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  {t("reviewNamesDescriptions")}
                </span>
              </div>
            </div>
          </div>
        </Card>
        <Publish
          businessId={result.business.id}
          product={product}
          user={result.user}
        />
        {/* Publish Button */}
      </div>
    </div>
  );
}
