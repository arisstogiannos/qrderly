import { Button } from "@/components/ui/button";
import { productsData } from "@/data";
import { ProductType } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MainButton } from "../(landing page)/_sections/hero/MainButton";

export default async function page() {
  return (
    <div className="flex flex-col gap-10 3xl:px-20">
      <h1 className="mx-auto font-medium text-2xl  max-w-xl text-center">
        Choose the product you want to pocceed with. Get started for free and
        see what’s right for you!
      </h1>
      <div className="grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 gap-x-16 gap-y-8">
        {productsData.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductType }) {
  return (
    <div className="gap-y-2 bg-accent p-6 rounded-3xl flex flex-col hover:scale-105 transition-transform duration-300">
      <h2 className="md:text-xl font-medium capitalize ">{product.title}</h2>
      <p className="mb-5">{product.shortDesc}</p>
      <MainButton className="mt-auto shadow-none bg-primary hover:text-background" >
        <Link className="flex justify-between w-full" href={"/get-started/"+product.title.toLowerCase().replaceAll(" ","-")+"/business-setup"}>
          Get Started <ArrowRight />
        </Link>
      </MainButton>
    </div>
  );
}
