"use client"
import React, { useState } from "react";
import VideoContainer from "./VideoContainer";
import { ProductCard } from "./ProductCard";
import { productsData } from "@/data";
import { useTranslations } from "next-intl";


export default function Products() {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
const t = useTranslations("productsData")
  return (
    <section className="space-y-6 lg:space-y-12 ">
      {/* <h4 className="mx-auto md:text-2xl lg:text-4xl max-w-5xl text-center">
        Seamlessly manage menus, orders, and online sales with our powerful
        digital tools. Choose the perfect solution for your business and enhance
        your customer experience today!
      </h4> */}
       <h2 className="font-semibold text-primary md:text-lg 2xl:text-xl">
          {t("title")}
        </h2>
      <div className="grid grid-cols-1 xl:grid-cols-[auto_auto] grid-rows-[auto_auto] xl:grid-rows-1 gap-5 lg:gap-5 3xl:gap-10  xl:h-[510px] ">
        <div className="flex flex-col gap-2 xl:gap-5  h-[380px] md:h-[500px] xl:h-[510px]">
          {productsData.map((product, i) => (
            <ProductCard
              key={product.title}
              product={product}
              isSelected={i === selectedProductIndex}
              onClick={() => setSelectedProductIndex(i)}
            />
          ))}
        </div>
        <div className=" relative 2xl:w-[800px] xl:w-2xl w-full max-sm:h-[250px] max-lg:h-[500px] max-xl:h-[700px] max-xl:row-start-1">
            <VideoContainer selectedProduct={selectedProductIndex} setSelectedProductIndex={setSelectedProductIndex}/>
        </div>
      </div>
    </section>
  );
}

