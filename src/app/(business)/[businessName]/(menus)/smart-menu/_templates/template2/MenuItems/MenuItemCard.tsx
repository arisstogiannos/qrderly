import { formatCurrency } from "@/lib/formatter";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem } from "@prisma/client";
import { CardModalProvider } from "@/context/CardModalProvider";

import MenuItemModal, {
  ModalTrigger,
} from "../../../_components/MenuItemModal/MenuItemModal"

export function MenuItemCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
  preferences,
  translations,
}: MenuItem) {
  return (
    <CardModalProvider>
      <ModalTrigger>
        <Card
          id={name}
          className={
            "flex py-2 px-2 flex-row border-0 border-b-2 border-foreground/10 shadow-none  rounded-none  min-[390px]:min-w-[350px] max-w-full relative  min-h-[100px]  overflow-hidden  text-foreground bg-transparent  transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary lg:min-w-full lg:max-w-full"
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
              {formatCurrency(priceInCents / 100)}
            </span>
          </CardContent>
        </Card>
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
