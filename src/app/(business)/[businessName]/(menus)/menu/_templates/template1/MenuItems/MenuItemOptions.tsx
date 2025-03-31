import { MenuItemRequired } from "@/types";

// Define a simple Option type
type Option = {
  name: string;
  values: string[];
};

/**
 * Deserializes the options string into an array of Option objects.
 * Expected format: "option1__value1---value2/+/option2__value3---value4"
 */
const deserializeOptions = (str: string | null): Option[] => {
  if (!str) return [];
  return str.split("/+/").map((opt) => {
    const [name, values] = opt.split("__");
    return { name, values: values ? values.split("---") : [] };
  });
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
               {value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
