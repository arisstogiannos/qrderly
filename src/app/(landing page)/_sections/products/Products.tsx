"use client"
import React, { useState } from "react";
import VideoContainer from "./VideoContainer";
import { ProductCard } from "./ProductCard";
import { productsData } from "@/data";



export default function Products() {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  return (
    <section className="space-y-10 lg:space-y-16 ">
      <h4 className="mx-auto md:text-2xl lg:text-4xl max-w-5xl text-center">
        Seamlessly manage menus, orders, and online sales with our powerful
        digital tools. Choose the perfect solution for your business and enhance
        your customer experience today!
      </h4>
      <div className="grid grid-cols-1 xl:grid-cols-[auto_auto] grid-rows-[auto_auto] xl:grid-rows-1 gap-5 lg:gap-5 3xl:gap-10  xl:h-[510px] ">
        <div className="flex flex-col gap-5  h-[450px] md:h-[500px] xl:h-[510px]">
          {productsData.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              isSelected={i === selectedProductIndex}
              onClick={() => setSelectedProductIndex(i)}
            />
          ))}
        </div>
        <div className=" relative 2xl:w-4xl xl:w-2xl w-full rounded-3xl overflow-hidden max-sm:h-[250px] max-lg:h-[500px] max-xl:h-[700px] max-xl:row-start-1">
            <VideoContainer selectedProduct={selectedProductIndex}/>
        </div>
      </div>
    </section>
  );
}

