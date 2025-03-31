import React from "react";
import Features from "../_components/Features";
import { FeatureType, ProductType } from "@/types";



export default function ProductPage({product}:{product:ProductType}) {
  return (
    <section className="space-y-20 2xl:mx-20 mt-20">
      <header className="flex justify-between flex-col xl:flex-row gap-y-8 gap-x-20">
        <h1 className="text-5xl md:text-7xl font-medium  ">{product.title}</h1>
        <p className="text-2xl max-w-3xl">
          {product.desc}
        </p>
      </header>
      <div className="rounded-3xl bg-primary/30 text-foreground flex flex-col xl:gap-40 gap-20 p-4 xl:px-20 relative py-20">
        <h2 className="font-medium text-5xl md:text-7xl lg:mx-auto">Features</h2>
        <Features features={product.features}/>
      </div>
    </section>
  );
}

