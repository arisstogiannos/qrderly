import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className=" bg-foreground text-background rounded-t-3xl pt-10 mt-40 px-4 sm:px-0">
      <div className="my-container grid grid-rows-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-2">
        <div className="flex flex-col gap-y-2">
          <Image src={"/QrCodeWhite.svg"} height={80} width={80} alt="logo" />
          <p className="text-4xl">Qrderly</p>
          <a href="mailto:webmaster@example.com">qrderly@info.com</a>
          <Social />
        </div>
        <div className="flex gap-16 py-8 lg:col-start-3 xl:justify-end">
            <div className="capitalize flex flex-col gap-2">
                <p className="text-xl">products</p>
                <Link className="text-background/80 text-lg" href={"/"}>qR menu</Link>
                <Link className="text-background/80 text-lg" href={"/"}>qR menu with ordering</Link>
                <Link className="text-background/80 text-lg" href={"/"}>online ordering</Link>
                <Link className="text-background/80 text-lg" href={"/"}>full website</Link>
            </div>
            <div className="capitalize flex flex-col gap-2">
                <p className="text-xl">Sitemap</p>
                <Link className="text-background/80 text-lg" href={"/"}>Home</Link>
                <Link className="text-background/80 text-lg" href={"/"}>services</Link>
                <Link className="text-background/80 text-lg" href={"/pricing"}>pricing</Link>
                <Link className="text-background/80 text-lg" href={"/"}>FAQ</Link>
            </div>
        </div>
        <div className="h-full place-content-end overflow-hidden col-span-full">
            <div className="text-sm flex justify-between mt-auto pb-2">

            <p>Created By Aris Stogiannos</p>
            <p>©2025 orderly</p>
            </div>
            <hr />
            <p className="uppercase text-6xl font-semibold py-5 text-center xl:text-8xl">go digital</p>
        </div>
      </div>
    </footer>
  );
}




function Social() {
  return (
    <div className="flex gap-4">
      <div className="p-3 border border-background rounded-full">
        <Image
          src={"/icons/facebook.png"}
          width={20}
          height={20}
          alt="facebook logo"
        />
      </div>
      <div className="p-3 border border-background rounded-full">
        <Image
          src={"/icons/instagram.png"}
          width={20}
          height={20}
          alt="instagram logo"
        />
      </div>
      <div className="p-3 border border-background rounded-full">
        <Image
          src={"/icons/discord.png"}
          width={20}
          height={20}
          alt="discord logo"
        />
      </div>
    </div>
  );
}
