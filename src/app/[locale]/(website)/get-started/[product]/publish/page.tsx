import Image from "next/image";
import React from "react";
import { ProductURL } from "@/types";

import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Publish from "../../_components/Publish";

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
    <section className="flex flex-col lg:min-w-xl max-w-7xl gap-y-8 h-full">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold ">Your Menu is Ready to Go Live</h1>
      </div>

        <div className="space-y-6 xl:pr-20 pb-10 xl:pb-0">
          <p className="text-muted-foreground">
            After publishing, visit your menu items page to ensure everything is
            generated correctly. Our AI is powerful, but it's always good to
            review the results.
          </p>
        </div>

        <Publish
          product={product}
          user={result.user}
          businessId={result.business.id}
        />
    </section>
  );
}
