import DisplayPrice from "@/components/DisplayPrice";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatCurrencyFromCents } from "@/lib/formatter";
import Image from "next/image";
import React from "react";

export default function MenuItem({ index }: { index: number }) {
  return (
    <Card
      className={
        "flex p-2 flex-row border-0 w-full relative  h-[100px] gap-1  overflow-hidden bg-foreground-mockup text-text-mockup shadow-lg  "
      }
    >
      <div
        className={
          "relative  w-[90px] h-full overflow-hidden rounded-xl"
        }
      >
        <Image loading="lazy"  src={"/image-placeholder.png"} sizes="90px" alt="placeholder" fill />
      </div>
      <CardContent
        className={"flex flex-col justify-between py-1 px-3  h-full"}
      >
        <div className="space-y-0.5 ">
          <h3 className={"  capitalize"}>Product {index}</h3>
          <p className={"line-clamp-2 text-text-mockup/50  max-w-[140px]"}>
            Description {index}
          </p>
        </div>
        {formatCurrencyFromCents(230, "EUR")}

        {index === 2 && (
          <div className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-xl bg-primary-mockup font-medium">
            {1}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
