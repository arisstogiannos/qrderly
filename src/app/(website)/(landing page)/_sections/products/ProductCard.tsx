import { Button } from "@/components/ui/button";
import { ProductType } from "@/types";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export function ProductCard({
    isSelected,
    product,
    onClick,
  }: {
    isSelected: boolean;
    product: ProductType;
    onClick: () => void;
  }) {
    return (
      <div
        onClick={onClick}
        className={`rounded-4xl bg-accent flex flex-col justify-between gap-10 overflow-hidden transition-all duration-500 p-6 origin-top cursor-pointer ${
          isSelected ? "h-full" : "h-20 md:h-24 lg:h-28"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="md:text-3xl font-medium capitalize ">{product.title}</p>
          <ChevronDown />
        </div>
        <div className="flex lg:justify-between lg:items-end gap-4 lg:gap-24 xl:gap-20 2xl:gap-24 flex-col lg:flex-row">
          <p className="text-sm md:text-lg lg:text-xl xl:text-lg  3xl:text-xl">{product.shortDesc}</p>
          <Button asChild>
            <Link href={`/products/${product.title.replaceAll(" ","-").toLowerCase()}`}>
            Learn More <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    );
  }