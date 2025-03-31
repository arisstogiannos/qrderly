import { productsData } from "@/data";
import React from "react";
import Product from "./_components/Product";
import Background from "@/components/Background";

export default function page() {
  
  return (
    <section className="space-y-24 mt-10 ">
      <Background />
      <header className="space-y-5 bg-primary/20 p-8 backdrop-blur-3xl rounded-3xl">
        <h1 className="text-4xl sm:text-5xl font-medium">Our Products</h1>
        <p className="text-lg md:text-2xl text-balance xl:pr-20">
          Transform the way you serve customers with our powerful digital
          solutions. Whether you need a QR menu, self-ordering system, online
          ordering platform, or a fully branded website, we provide the tools to
          streamline operations, boost sales, and enhance customer experience.
        </p>
        
      </header>
      <div className="space-y-40 xl:space-y-16">
        {productsData.map((product) => (
          <Product key={product.title} {...product} />
        ))}
      </div>
    </section>
  );
}


