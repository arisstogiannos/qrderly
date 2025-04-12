import Image from "next/image";
import { Link } from "@/i18n/navigation";

import React from "react";

const products = [
  {
    title: "QR Menu",
    href: "/products/qr-menu",
    description:
      "Let your customers scan a QR code and instantly access your digital menu",
  },
  {
    title: "Smart QR Menu",
    href: "/products/smart-ordering-qr-menu",
    description:
      "Allow your customers to browse and order directly from their phones",
  },
  {
    title: "Self Service QR Menu",
    href: "/products/self-service-smart-menu",
    description:
      "Your customers order through the menu and will be notified when its ready",
  },
];

export default function Footer() {
  return (
    <footer className=" bg-foreground text-background rounded-t-3xl pt-10 mt-40 px-4 sm:px-0">
      <div className="my-container grid grid-rows-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-2">
        <div className="flex flex-col gap-y-2">
          <Image src={"/QrCodeWhite.svg"} height={80} width={80} alt="logo" />
          <p className="text-4xl">Scanby</p>
          <a href="mailto:webmaster@example.com">scanby@info.com</a>
          <Social />
        </div>
        <div className="flex gap-16 py-8 lg:col-start-3 xl:justify-end">
          <div className="capitalize flex flex-col gap-2">
            <p className="text-xl">products</p>
            {products.map((p) => (
              <Link
                key={p.title}
                className="text-background/80 text-lg"
                href={
                  p.href as
                    | "/products/self-service-smart-menu"
                    | "/products/smart-ordering-qr-menu"
                    | "/products/qr-menu"
                }
              >
                {p.title}
              </Link>
            ))}
          </div>
          <div className="capitalize flex flex-col gap-2">
            <p className="text-xl">Sitemap</p>
            <Link className="text-background/80 text-lg" href={"/"}>
              Home
            </Link>
            <Link className="text-background/80 text-lg" href={"/"}>
              Products
            </Link>
            <Link className="text-background/80 text-lg" href={"/pricing"}>
              pricing
            </Link>
            <Link className="text-background/80 text-lg" href={"/"}>
              FAQ
            </Link>
          </div>
        </div>
        <div className="h-full place-content-end overflow-hidden col-span-full">
          <div className="text-sm flex justify-between mt-auto pb-2">
            <p>Created By Aris Stogiannos</p>
            <p>©2025 scanby</p>
          </div>
          <hr />
          <p className="uppercase text-6xl font-semibold py-5 text-center xl:text-8xl">
            go digital
          </p>
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
