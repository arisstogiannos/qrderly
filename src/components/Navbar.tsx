"use client"
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {   NavigationDesktop, NavigationMobile, } from "./Navigation";
import { useSession } from "next-auth/react";


export default  function Navbar() {
  const session = useSession().data
  return (
    <header className="flex items-center justify-between py-7 z-50 max-sm:px-3 my-container">
      <Link href={"/"} className="text-2xl font-medium flex items-center gap-2">
        <Image src={"/QrCode.svg"} width={30} height={30} alt="logo" />
        Qrderly
      </Link>
      <div className="hidden lg:block">
        <NavigationDesktop session={session} />
      </div>
      <div className="lg:hidden">
      <NavigationMobile session={session} />
      </div>
    </header>
  );
}
