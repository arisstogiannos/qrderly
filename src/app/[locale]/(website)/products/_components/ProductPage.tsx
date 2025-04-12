import React from "react";
import Features from "./Features";
import { ProductType } from "@/types";
import { MainButton } from "../../(landing page)/_sections/hero/MainButton";
import { Link } from "@/i18n/navigation";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ProductPage({
  product,
}: {
  product: ProductType;
}) {
  const t = await getTranslations("productsData");
  return (
    <section className="space-y-20  mt-20">
      <header className="flex justify-between flex-col  sm:text-center gap-y-3 sm:gap-y-6 mx-auto">
        <h1 className="text-[28px] sm:text-3xl md:text-7xl font-semibold  text-balance lg:px-40">
          {t(product.title + ".longTitle")}
        </h1>
        <p className="text-base sm:text-2xl max-w-3xl mx-auto">
          {t(product.title + ".desc")}
        </p>
        <MainButton className="w-fit md:mx-auto my-5 md:mb-10">
          <Link
           href={{pathname:"/get-started/[product]/business-setup",params:{product:product.link}} }
            className="flex gap-4  items-center text-xl"
          >
            {t("button")} <ArrowRight />
          </Link>
        </MainButton>
      </header>

      <div className=" text-foreground flex flex-col xl:gap-40 gap-20 w-full  relative  py-10">
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#040404] w-screen h-[101%] rounded-3xl  py-20 -z-10">
          <div className="absolute inset-0  w-full overflow-hidden">
            {product.features.map((_, i) => (
              <div
                key={i}
                style={{ top: i * 500 }}
                className="absolute top-5 odd:left-full even:left-0 -translate-x-1/2 size-[680px] bg-radial from-primary/20 to-60% to-transparent rounded-full "
              ></div>
            ))}
            {product.features.map((_, i) => (
              <div
                key={i}
                style={{ top: i * 600 }}
                className="absolute top-5 even:left-1/3 odd:left-2/3 -translate-x-1/2 size-[480px] bg-radial from-primary/10 to-60% to-transparent rounded-full "
              ></div>
            ))}
          </div>
        </div>
        <div className="p-4 xl:px-20">
          <Features features={product.features} />
        </div>
      </div>
    </section>
  );
}
