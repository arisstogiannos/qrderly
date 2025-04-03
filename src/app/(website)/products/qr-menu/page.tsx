import React from "react";

import ProductPage from "../_components/ProductPage";
import { Brush } from "lucide-react";
import { productsData } from "@/data";



export default function page() {
    const smMenu = {...productsData[0]}
    smMenu.title = "QR Menu – Instant Access, Effortless Browsing"
  return (
    <ProductPage product={smMenu}/>
  );
}

