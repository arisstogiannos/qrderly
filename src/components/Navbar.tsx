import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Menu, NavLinks } from "./NavLinks";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth()
  return (
      <header className="flex items-center justify-between py-7 z-50 max-sm:px-3 my-container">
        <Link
          href={"/"}
          className="text-2xl font-medium flex items-center gap-2"
        >
          <Image src={"/QrCode.svg"} width={30} height={30} alt="logo" />
          Qrderly
        </Link>
        <div className="hidden lg:block">
          <NavLinks session={session} />
        </div>
        <Menu session={session} />
      </header>
  );
}


