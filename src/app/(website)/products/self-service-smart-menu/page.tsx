import React from "react";

import ProductPage from "../_components/ProductPage";
import { productsData } from "@/data";



export default function page() {
    const smMenu = {...productsData[2]}
    // smMenu.title = "QR Menu – Instant Access, Effortless Browsing"
  return (
    <ProductPage product={smMenu}/>
  );
}

