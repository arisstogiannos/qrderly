"use client";
import { Card, CardContent } from "@/components/ui/card";
import CloudImage from "@/components/CloudImage";
import { MenuItem } from "@prisma/client";
import { CardModalProvider } from "@/context/CardModalProvider";
import MenuItemModal, { ModalTrigger } from "./MenuItemModal";
import MenuItemOptions from "./MenuItemOptions";
import MenuItemModalHeader from "./MenuItemModalHeader";
import { Translation } from "@/types";
import { useSearchParams } from "next/navigation";
import DisplayPrice from "@/components/DisplayPrice";

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

  const translationsAsJson: Translation | null = translations
    ? JSON.parse(translations)
    : null;

  const existingTranslation = lang && translationsAsJson && translationsAsJson[lang];
  name =
    existingTranslation && translationsAsJson[lang].name && translationsAsJson[lang].name !== "null"
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
            "flex p-2 flex-row border-0  min-[390px]:min-w-[350px] max-w-full relative  h-[150px]  overflow-hidden bg-secondary text-background shadow-lg transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary lg:min-w-full lg:max-w-full"
          }
        >
          <div
            className={
              "relative aspect-video min-w-[140px] max-w-[140px] h-full overflow-hidden rounded-xl"
            }
          >
            <CloudImage
              src={imagePath ?? ""}
              fill
              className="absolute inset-0 object-cover"
              alt={name}
              sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
            />
          </div>
          <CardContent
            className={"flex flex-col justify-between py-1 pl-0 pr-2  h-full"}
          >
            <div className="space-y-1 lg:space-y-1">
              <h3 className={"text-base lg:text-lg capitalize text-foreground line-clamp-2"}>
                {name}
              </h3>
              <p
                className={
                  "line-clamp-2 text-sm text-muted-foreground max-w-full"
                }
              >
                {description}
              </p>
            </div>
            <span className="lg:text-lg text-foreground">
              <DisplayPrice price={priceInCents } />
            </span>
          </CardContent>
        </Card>
        <MenuItemModal
          menuItem={{
            id,
            name,
            priceInCents,
            description,
            imagePath,
            preferences,
            translations: null,
          }}
        >
          <MenuItemModalHeader
            menuItem={{
              id,
              name,
              priceInCents,
              description,
              imagePath,
              preferences,
              translations: null,
            }}
          />
          <MenuItemOptions
            menuItem={{
              id,
              name,
              priceInCents,
              description,
              imagePath,
              preferences,
              translations: null,
            }}
          />
        </MenuItemModal>
      </ModalTrigger>
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
