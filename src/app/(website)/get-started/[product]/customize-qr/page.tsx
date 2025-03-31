import Image from "next/image";
import React from "react";
import { ProductURL } from "@/types";

import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import Publish from "../../_components/Publish";
import QrCreator from "../../_components/qr/QrCreator";

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const product = (await params).product;
  if (!product) notFound();

  const result = await checkUser(product);

  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result.redirect === "noUnsetBusiness") {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result?.redirect === "businessWithoutMenu") {
    redirect("/get-started/" + product + "/menu-settings");
  }
  // if (result.redirect === "emptyMenu") {
  //   redirect("/get-started/" + product + "/generate-items");
  // }
  if (result.redirect === "unpublishedMenu") {
    redirect("/get-started/" + product + "/publish");
  }

  const productPath = {
    "qr-menu": "menu",
    "smart-ordering-qr-menu": "smart-menu",
    "self-service-qr-menu": "smart-menu",
  };

  const url =
    process.env.NEXT_PUBLIC_SERVER_URL +
    "/" +
    result.business.name.replaceAll(" ", "-") +
    "/" +
    productPath[product];

  return (
    <section className="flex flex-col lg:min-w-xl max-w-7xl gap-y-6">
      <h1 className="text-2xl font-medium">Customize Your QR Code</h1>
      <QrCreator business={result.business} product={product}  url={url} />
    </section>
  );
}
