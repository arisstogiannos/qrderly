"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Product } from "@prisma/client";

export default function ActiveOrder({businessName,menuType}:{businessName:string;  menuType: Product;
}) {
  const [activeOrder,setActiveOrder] = useState<string | undefined>(undefined);
  useEffect(() => {
    const orderCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${businessName}order=`))
      ?.split("=")[1];

    setActiveOrder(orderCookie)
  });
  return activeOrder ? (
    <motion.div
      drag
      whileDrag={{ scale: 1.2 }}
      className="size-20 bg-primary rounded-full fixed top-5 left-10 z-50  shadow-2xl animate-pulse"
      dragConstraints={{ left: 0, right: 300, top: 0, bottom: 500 }}
    >
      <Link
        href={`smart-menu/${menuType==="SELF_SERVICE_QR_MENU"?"order":"order-placed"}?order=${activeOrder}`}
        className="size-full flex-center text-center "
      >
        Active
        Order
      </Link>
    </motion.div>
  ) : null;
}
