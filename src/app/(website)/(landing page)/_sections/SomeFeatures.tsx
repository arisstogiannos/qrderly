import React from "react";
import Features from "../../products/_components/Features";
import { productsData } from "@/data";

export default function SomeFeatures() {
  const someFeatures = productsData[0].features.slice(1);
  return (
    <div className="space-y-8">
      <h2 className="font-semibold text-primary">Some Features</h2>
      <Features features={someFeatures} />
    </div>
  );
}
