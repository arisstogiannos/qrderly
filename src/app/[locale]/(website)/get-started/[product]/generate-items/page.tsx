import { ProductURL } from "@/types";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { checkUser } from "../../isAllowed";
import UploadingForm from "../../_components/generateItems/UploadingForm";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const t = await getTranslations("uploadingForm");
  const product = (await params).product;
  if (!product) notFound();

  const result = await checkUser(product);
  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result.redirect === "businessWithoutMenu") {
    redirect("/get-started/" + product + "/menu-settings");
  }
  if(result.redirect !=="emptyMenu" && result.redirect==="noQR"){
    redirect("/get-started/" + product + "/customize-qr");
  }
  if (
    result.redirect === "unpublishedMenu" ||
    result.redirect === "noUnsetBusiness"
  ) {
    redirect("/get-started/" + product + "/publish");
  }
  return (
    <div className="space-y-8">
      <header className="max-w-xl space-y-2">
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p>{t("description")}</p>
      </header>

      <UploadingForm businessName={result.business.name ?? ""} />
    </div>
  );
}
