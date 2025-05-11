"use client";

import { useEffect, useState } from "react";
import OrderMenuForm from "./OrderMenuForm";
import Success from "./Success";



export default function OrderMenu() {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const menuOrderSubmitted = document.cookie.split('; ').find(row => row.startsWith('menu-order-submitted='));
    if (menuOrderSubmitted) {
      setSuccess(true);
    }
  }, []);

  return (
    <div
      id="order-menu-form"
      className="w-full relative py-10 text-foreground rounded-xl scroll-mt-20"
    >
      <div className="w-screen h-full bg-secondary left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 absolute -z-10" />
      <div className=" mx-auto ">
        {success ? <Success /> : <OrderMenuForm onSubmit={() => setSuccess(true)} />}
      </div>
    </div>
  );
}
