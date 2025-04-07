"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ActiveOrder({
  activeOrder,
}: {
  activeOrder: string | undefined;
}) {
  return activeOrder ? (
    <motion.div
      drag
      whileDrag={{ scale: 1.2 }}
      className="size-20 bg-primary rounded-full fixed top-5 left-10 z-50 animate-pulse "
      dragConstraints={{ left: 0, right: 300, top: 0, bottom: 500 }}
    >
      <Link
        href={"smart-menu/order?order=" + activeOrder}
        className="size-full flex-center"
      >
        Order
      </Link>
    </motion.div>
  ) : null;
}
