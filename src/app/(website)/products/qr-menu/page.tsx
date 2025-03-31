import React from "react";

import ProductPage from "../_components/ProductPage";
import { Brush } from "lucide-react";
import { productsData } from "@/data";



export default function page() {
  return (
    <ProductPage product={productsData[0]}/>
  );
}

