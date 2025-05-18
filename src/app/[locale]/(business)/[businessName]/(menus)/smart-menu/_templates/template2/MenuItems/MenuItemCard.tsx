"use client";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuItem } from "@prisma/client";
import { CardModalProvider } from "@/context/CardModalProvider";
import MenuItemModal, {
  ModalTrigger,
} from "../../../_components/MenuItemModal/MenuItemModal";
import type { Translation } from "@/types";
import { useSearchParams } from "next/navigation";
import DisplayPrice from "@/components/DisplayPrice";
import { useCartContext } from "@/context/CartContext";

export function MenuItemCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
  preferences,
  translations,
}: MenuItem) {
  const lang = useSearchParams().get("l");

  const { cartItems } = useCartContext();
  const productInCart = cartItems.filter((item) => item.menuItem.id === id);
  let quantity = 0;
  if (productInCart.length > 0) {
    for (let i = 0; i < productInCart.length; i++) {
      quantity += productInCart[i].quantity;
    }
  }

  const translationsAsJson: Translation | null = translations
    ? JSON.parse(translations)
    : null;

  const existingTranslation =
    lang && translationsAsJson && translationsAsJson[lang];
  name =
    existingTranslation &&
    translationsAsJson[lang].name &&
    translationsAsJson[lang].name !== "null"
      ? translationsAsJson[lang].name
      : name;
  description =
    existingTranslation &&
    translationsAsJson[lang].description &&
    translationsAsJson[lang].description !== "null"
      ? translationsAsJson[lang].description
      : description;
  return (
    <CardModalProvider>
      <ModalTrigger>
        <Card
          id={name}
          className={
            "flex py-2 px-2 flex-row border-0 border-b-2 border-foreground/10 shadow-none    rounded-none  min-[390px]:min-w-[350px] max-w-full relative  min-h-[100px]  overflow-hidden  text-foreground bg-transparent  transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary lg:min-w-full lg:max-w-full"
          }
        >
          <CardContent
            className={
              "flex w-full justify-between py-1 px-0 h-full border-0 shadow-none"
            }
          >
            <div className="space-y-1 lg:space-y-1  w-[80%]">
              <h3 className={"text-base lg:text-lg capitalize"}>{name}</h3>
              <p
                className={
                  "line-clamp-2 text-sm text-muted-foreground lg:text-sm "
                }
              >
                {description}
              </p>
            </div>
            <span className="lg:text-lg text-foreground">
              <DisplayPrice price={priceInCents } />
            </span>
            {quantity !== 0 && (
              <div className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-tl-xl bg-primary font-medium">
                {quantity}
              </div>
            )}
          </CardContent>
        </Card>
        </ModalTrigger>
        <MenuItemModal
          withImage={false}
          menuItem={{
            id,
            name,
            priceInCents,
            description,
            imagePath,
            preferences,
            translations,
          }}
        />
    </CardModalProvider>
  );
}

// export function ProductCardSkeleton({
//   direction = "vertical",
// }: {
//   direction?: "vertical" | "horizontal";
// }) {
//   return (
//     <Card className={directions[direction].card}>
//       <div
//         className={cn(
//           directions[direction].image,
//           "bg-primary/50 min-w-[140px] animate-pulse"
//         )}
//       ></div>
//       <CardContent className={cn(directions[direction].content, "w-full")}>
//         <div className="space-y-1 lg:space-y-1 w-full">
//           <div
//             className={cn(
//               directions[direction].name,
//               "w-1/2 h-4 rounded-full bg-primary/50 animate-pulse"
//             )}
//           ></div>
//           <div
//             className={cn(
//               directions[direction].description,
//               "w-2/3 h-3 rounded-full bg-primary/30 animate-pulse"
//             )}
//           ></div>
//         </div>
//         <span className="lg:text-lg w-1/3 h-3 rounded-full bg-primary/40 animate-pulse"></span>
//       </CardContent>
//     </Card>
//   );
// }
