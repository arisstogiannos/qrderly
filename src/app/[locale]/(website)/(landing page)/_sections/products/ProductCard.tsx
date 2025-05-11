import { Button } from "@/components/ui/button";
import type { ProductType } from "@/types";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ProductCard({
  isSelected,
  product,
  onClick,
}: {
  isSelected: boolean;
  product: ProductType;
  onClick: () => void;
}) {
  const t = useTranslations(`productsData.${product.title}`);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`md:rounded-4xl rounded-3xl bg-accent flex flex-col text-left justify-between gap-4 md:gap-10  overflow-hidden transition-all duration-500 p-6 origin-top cursor-pointer ${
        isSelected ? "h-full" : "h-20 md:h-24 lg:h-28"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="md:text-3xl font-medium capitalize ">{t("title")}</p>
        <ChevronDown />
      </div>
      <div className="flex lg:justify-between lg:items-end gap-4 lg:gap-24 xl:gap-20 2xl:gap-24 flex-col lg:flex-row">
        <p className="text-sm md:text-lg lg:text-xl xl:text-lg  3xl:text-xl">
          {t("shortDesc")}
        </p>
        <Button asChild>
          <Link
            href={
              `/products/${product.title.replaceAll(" ", "-").toLowerCase()}` as
                | "/products/qr-menu"
                | "/products/smart-ordering-qr-menu"
                | "/products/self-service-smart-menu"
            }
          >
            Learn More <ArrowRight />
          </Link>
        </Button>
      </div>
    </button>
  );
}
