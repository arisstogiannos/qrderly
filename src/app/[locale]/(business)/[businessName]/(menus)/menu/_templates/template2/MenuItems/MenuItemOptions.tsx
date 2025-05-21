import DisplayPrice from "@/components/DisplayPrice";
import type { MenuItemRequired, Option, Translation } from "@/types";

/**
 * Deserializes the options string into an array of Option objects.
 * Expected format: "option1__value1---value2/+/option2__value3---value4"
 */
const deserializeOptions = (str: string | null): Option[] => {
	try {
		return str ? JSON.parse(str) : [];
	} catch {
		return [];
	}
};

export default function MenuItemOptions({
	menuItem,
	optionTranslations,
}: {
	menuItem: MenuItemRequired;
	optionTranslations :{
    name: string;
    values: string[];
}[] | null | undefined
}) {
	const deserializedOptions = deserializeOptions(menuItem.preferences);

	return (
		<div className="space-y-7">
			{deserializedOptions.map((option, index) => (
				<div key={index} className="grid gap-4">
          <p className="text-base font-normal capitalize">{optionTranslations?.[index].name ?? option.name}</p>
					<ul className="space-y-2 list-disc ">
						{option.values.map((value, i) => (
							<li
								key={i}
								className=" text-base font-light capitalize list-inside  list-item"
							>
								{optionTranslations?.[index].values[i] ?? value.name}{" "}
								{value.price && value.price !== "0" ? (
									<span className="text-muted">
										+ <DisplayPrice price={Number.parseInt(value.price)} />
									</span>
								) : (
									""
								)}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
