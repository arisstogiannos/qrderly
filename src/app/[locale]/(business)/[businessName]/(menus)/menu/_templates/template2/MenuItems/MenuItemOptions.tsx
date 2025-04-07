import { formatCurrency } from "@/lib/formatter";
import { MenuItemRequired, Option } from "@/types";


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
}: {
  menuItem: MenuItemRequired;
}) {
  const deserializedOptions = deserializeOptions(menuItem.preferences);


  return (
    <div className="space-y-7">
      {deserializedOptions.map((option, index) => (
        <div key={index} className="grid gap-4">
          <p className="text-base font-normal capitalize">{option.name}</p>
          <ul className="space-y-2 list-disc ">
            {option.values.map((value, i) => (
              <li key={i} className=" text-base font-light capitalize list-inside  list-item">
               {value.name} {value.price!=="0"&&<span className="text-foreground/60 font-normal ml-1">+{formatCurrency(Number(value.price)/100)}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
