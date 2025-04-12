import {Link} from "@/i18n/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import { NavigationDesktop, NavigationMobile } from "./Navigation";
import NavBackground from "./NavBackground";

export default  function Navbar() {
  return (
    <header className="flex items-center justify-between py-7 z-50 max-sm:px-3 my-container sticky top-0 ">
      <NavBackground />
      <Link href={"/"} className="text-2xl font-medium flex items-center gap-2">
        <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
        Scanby
      </Link>
      <Suspense>

      <div className="hidden lg:block">
        <NavigationDesktop  />
      </div>
      <div className="lg:hidden">
        <NavigationMobile  />
      </div>
      </Suspense>
    </header>
  );
}
