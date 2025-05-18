import type { MenuItemAI } from "@/types";

export function safeParse(jsonStr: string): {
    menuItems: MenuItemAI[];
    names?: string[];
  } {
    let menuItems: MenuItemAI[];
    let names: string[] | undefined;
  
    try {
      menuItems = JSON.parse(jsonStr);
    } catch (e) {
      try {
        const fixedStr = cutBrokenTailToValidJsonArray(jsonStr);
        menuItems = JSON.parse(fixedStr);
        names = menuItems.map((item) => item.name);
      } catch (e) {
        menuItems = [];
      }
    }
    return { menuItems: menuItems, names: names };
  }
  
 export  function cutBrokenTailToValidJsonArray(jsonStr: string): string {
    const endSequence = '},\n  {\n    "category"';
    const lastValidIndex = jsonStr.lastIndexOf(endSequence);
  
    if (lastValidIndex === -1) {
      // Couldn’t find a valid sequence, return an empty array
      return "[]";
    }
  
    // Keep everything up to the last valid object
    const validJsonPart = jsonStr.slice(0, lastValidIndex + 1); // include the final }
  
    return `${validJsonPart.trim()}\n]`; // Wrap in array brackets
  }
  