"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Modal } from "../../../dashboard/_components/Modal";

export default function LastOrder({businessName}:{businessName:string}) {
  const [lastOrder,setLastOrder] = useState<string | undefined>(undefined);
  useEffect(() => {
    const orderCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(businessName+"order="))
      ?.split("=")[1];

    setLastOrder(orderCookie)
  });
  return (
    <Modal title="Last Order" subtitle="Continiue from your last order?" trigger={null}  >LastOrder</Modal>
  )
}
