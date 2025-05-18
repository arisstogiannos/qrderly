"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useCartContext } from "@/context/CartContext";
import CloudImage from "@/components/CloudImage";
import type { MenuItem } from "@prisma/client";
import { CardModalProvider } from "@/context/CardModalProvider";
import MenuItemModal, {
	ModalTrigger,
} from "../../../_components/MenuItemModal/MenuItemModal";
import { useSearchParams } from "next/navigation";
import type { Translation } from "@/types";
import DisplayPrice from "@/components/DisplayPrice";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
export function MenuItemCard({
	id,
	name,
	priceInCents,
	description,
	imagePath,
	preferences,
	translations,
}: MenuItem) {
	const { cartItems, addToCart } = useCartContext();
	const t = useTranslations("menus.order");
	const lang = useSearchParams().get("l");
	const productInCart = cartItems.filter((item) => item.menuItem.id === id);
	const translationsAsJson: Translation | null = translations
		? JSON.parse(translations)
		: null;

	const existingTranslation =
		lang && translationsAsJson && translationsAsJson[lang];
	name =
		existingTranslation &&
		translationsAsJson[lang]?.name &&
		translationsAsJson[lang]?.name !== "null"
			? translationsAsJson[lang]?.name
			: name;
	description =
		existingTranslation &&
		translationsAsJson[lang]?.description &&
		translationsAsJson[lang]?.description !== "null"
			? translationsAsJson[lang]?.description
			: description;

	let quantity = 0;
	if (productInCart.length > 0) {
		for (let i = 0; i < productInCart.length; i++) {
			quantity += productInCart[i].quantity;
		}
	}

	return (
		<CardModalProvider>
			<ModalTrigger>
				<Card
					id={name}
					className={cn(
						"flex p-2 flex-row border-0  min-[390px]:min-w-[350px] max-w-full relative  h-[140px]  overflow-hidden bg-secondary text-foreground shadow-lg transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary lg:min-w-full lg:max-w-full",
						!imagePath && "max-sm:h-fit",
					)}
				>
					{imagePath && (
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
								sizes={
									"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
								}
							/>
						</div>
					)}
					<CardContent
						className={cn(
							"flex flex-col justify-between py-1 px-3  h-full",
							!imagePath && "pl-2",
						)}
					>
						<div className="space-y-1 lg:space-y-1">
							<h3 className={"text-base lg:text-lg capitalize"}>{name}</h3>
							<p
								className={cn(
									"line-clamp-2 text-sm text-foreground/60 tracking-wide lg:text-sm",
									imagePath ? " max-w-[140px]" : "max-w-5/6",
								)}
							>
								{description}
							</p>
						</div>
						<span
							className={cn("lg:text-lg text-foreground", !imagePath && "mt-3")}
						>
							<DisplayPrice price={priceInCents} />
						</span>
						{quantity !== 0 ? (
							<div className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-tl-md bg-primary font-medium shadow-3xl">
								{quantity}
							</div>
						) : (
							<button
								onClick={(e) => {
									if (!preferences) {
										e.preventDefault();
										e.stopPropagation();
										addToCart(
											{
												id,
												name,
												priceInCents,
												description,
												imagePath,
												preferences,
												translations,
											},
											"",
											1,
										);
										toast.success(t("toast"), {
											duration: 1500,
										});
									}
								}}
								type="button"
								className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-tl-md bg-primary font-medium cursor-pointer shadow-3xl"
							>
								<Plus />
							</button>
						)}
					</CardContent>
				</Card>
			</ModalTrigger>
			<MenuItemModal
				withImage
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
