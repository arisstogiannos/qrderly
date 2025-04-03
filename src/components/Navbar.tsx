import Link from "next/link";
import React from "react";
import Image from "next/image";
import {   NavigationDesktop, NavigationMobile, } from "./Navigation";
import { auth } from "@/auth";
import getSession from "@/lib/getSession";
import NavBackground from "./NavBackground";

export default async function Navbar() {
  const session = await getSession();
  return (
    <header className="flex items-center justify-between py-7 z-50 max-sm:px-3 my-container sticky top-0 ">
<NavBackground/>      <Link href={"/"} className="text-2xl font-medium flex items-center gap-2">
        <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
        Scanly
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
