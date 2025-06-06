"use client";
import type { MenuItem } from "@prisma/client";
import CloudImage from "@/components/CloudImage";
import type { Translation } from "@/types";
import DisplayPrice from "@/components/DisplayPrice";
import Link from "next/link";

export function SearchModal({
  products,
  setOpen,
  lang,
}: {
  products: MenuItem[];
  setOpen: (v: boolean) => void;
  lang: string;
}) {
  return (
    <div className="my-container absolute left-0 top-full mt-2 w-full gap-3 rounded-lg bg-background p-2 duration-300 animate-in fade-in-0 slide-in-from-top-3 shadow-lg shadow-primary">
      <div
        onClick={() => setOpen(false)}
        className="fixed top-0 left-0  w-full h-screen -z-10 "
      />
      {products.map((p) => {
        const translationsAsJson: Translation | null = p.translations
          ? JSON.parse(p.translations)
          : null;

        const existingTranslation = translationsAsJson?.[lang];

        return (
          <Link key={p.id} href={`#${p.name}`}>
            <div className="flex gap-3 border-t border-t-secondary/20 p-2 text-foreground first-of-type:border-t-0 hover:bg-foreground/10 transition-colors ">
              {p.imagePath && <div className="relative size-16 flex-shrink-0 place-content-center overflow-hidden rounded-lg">
                <CloudImage
                  src={p.imagePath ?? ""}
                  fill
                  alt={p.name}
                  className="object-cover"
                />
              </div>}
              <div>
                <p className="">
                  {existingTranslation ? translationsAsJson[lang].name : p.name}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {existingTranslation
                    ? translationsAsJson[lang].description
                    : p.description}
                </p>
              </div>
              <p className="ml-auto text-sm">
                <DisplayPrice price={p.priceInCents} />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
