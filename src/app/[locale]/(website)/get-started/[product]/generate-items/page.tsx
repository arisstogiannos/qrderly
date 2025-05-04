import { ProductURL } from "@/types";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { checkUser } from "../../isAllowed";
import UploadingForm from "../../_components/generateItems/UploadingForm";
import { getTranslations } from "next-intl/server";
import BackButton from "../../_components/BackButton";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ product: ProductURL }>;
  searchParams: Promise<{ b: string }>;
}) {
  const t = await getTranslations("uploadingForm");
  const product = (await params).product;
  if (!product) notFound();

  const result = await checkUser(product);
  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }

  const b = (await searchParams).b;

  if (!b) {
    if (result.redirect === "businessWithoutMenu") {
      redirect("/get-started/" + product + "/menu-settings");
    }
    if (result.redirect !== "emptyMenu" && result.redirect === "noQR") {
      redirect("/get-started/" + product + "/customize-qr");
    }
    if (
      result.redirect === "unpublishedMenu" ||
      result.redirect === "noUnsetBusiness"
    ) {
      redirect("/get-started/" + product + "/publish");
    }
  } else {
    if (b !== result.business.id) {
      redirect("/unauthorized");
    }
  }
  return (
    <div className="space-y-8">
      <header className="max-w-xl space-y-2">
        <div className="flex items-center gap-x-5">
          <h1 className="text-2xl font-medium">{t("title")}</h1>
          <BackButton
            href={`/get-started/${product}/menu-settings`}
            businessId={result.business.id}
          />
        </div>
        <p>{t("description")}</p>
      </header>

      <UploadingForm businessName={result.business.name ?? ""} />
    </div>
  );
}
