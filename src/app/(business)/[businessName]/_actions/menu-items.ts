"use server";
import { deleteImage, uploadImage } from "@/cloudinary";
import { db } from "@/db";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
  translateTextDeepL,
  translateTextToMultiple,
  translateTextToMultipleDeepL,
} from "@/app/translation";
import { MenuItemAI, Translation } from "@/types";
import { SourceLanguageCode, TargetLanguageCode } from "deepl-node";
import { cache } from "@/lib/cache";
import { Category } from "@prisma/client";
import { serializeOptions } from "@/lib/preferences";
import { getMenuByBusinessName } from "./menu";

export async function getMenuItems(businessName: string) {
  const menuItems = await db.menuItem.findMany({
    where: { menu: { business: { name: businessName } } },
    include: { category: { select: { name: true } } },
  });
  console.log(menuItems)
  return menuItems;
}
export async function getMenuItemsByMenuId(id: string) {
  const menuItems = await db.menuItem.findMany({
    where: { menuId: id },
    take: 1,
  });
  return menuItems;
}

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  { message: "Not a valid image file" }
);

const MenuItemSchema = z.object({
  name: z.string().min(1),
  translateName: z.string().min(1).max(3),
  description: z.string().optional(),
  translateDescription: z.string().min(1).max(3),
  categoryId: z.string().min(1),
  priceInCents: z.string().min(1),
  options: z.string().optional(),
  image: imageSchema.optional(),
  id: z.string().optional(),
  // language:z.string()
});
type MenuItem = z.infer<typeof MenuItemSchema>;

// Usage example:
export async function upsertMenuItem(
  businessName: string,
  prev: any,
  formData: FormData
) {
  const result = MenuItemSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const rawData = Object.fromEntries(
      formData
    ) as unknown as Partial<MenuItem>;
    return {
      data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const {
    description,
    // language,
    translateDescription,
    translateName,
    id,
    image,
    name,
    options,
    priceInCents,
    categoryId,
  } = result.data;

  try {
    const getCachedMenu = cache(getMenuByBusinessName,["menu"+businessName],{tags:["menu"+businessName]})

    const menu = await getCachedMenu(businessName)

    const translations: Translation = {};

    if (menu) {
      const languages = menu.languages.split(",");
      const srcLang = languages.reverse().pop();

      if (srcLang) {
        const textToTranslate =
          (translateName === "yes" ? name : "") +
          "_" +
          (translateDescription === "yes" ? description : "");

        if (textToTranslate !== "_") {
          // try {
          //   translationResult = await translateTextToMultiple(
          //     textToTranslate,
          //     srcLang,
          //     languages
          //   );
          // } catch (err) {
          const translationResult = await translateTextToMultipleDeepL(
            textToTranslate,
            srcLang as SourceLanguageCode,
            languages as TargetLanguageCode[]
          );
          // }
          for (let i = 0; i < translationResult.length; i++) {
            const translationArr = translationResult[i].split("_");
            const nameTranslation = translationArr[0];
            const descTranslation = translationArr[1];

            translations[languages[i]] = {
              name: nameTranslation !== "" ? nameTranslation : name,
              description:
                descTranslation !== "" ? descTranslation : description,
            };
          }
        }
      }

      let uploadedImage: any;
      let dataToUpsert;

      if (image && image.size > 0) {
        uploadedImage = await uploadImage(image, businessName);

        dataToUpsert = {
          name,
          description,
          priceInCents: Number(priceInCents),
          categoryId,
          menuId: menu.id,
          preferences: options,
          imagePath: uploadedImage.public_id,
          translations: JSON.stringify(translations),
        };
      } else {
        dataToUpsert = {
          name,
          description,
          priceInCents: Number(priceInCents),
          categoryId,
          menuId: menu.id,
          preferences: options,
          translations: JSON.stringify(translations),
        };
      }

      await db.menuItem.upsert({
        where: { id: id ?? "" },
        create: dataToUpsert,
        update: dataToUpsert,
      });
    } else {
      return {
        data: result.data,
        error: "Something went wrong!",
      };
    }
  } catch (error) {
    console.error("create item er: " + error);

    return {
      data: result.data,
      error: "Something went wrong!",
    };
  }

  revalidateTag("menu-items" + businessName);
  return { success: true };
}

const MenuItemTranslatedSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  translations: z.string().min(1),
  language: z.string().min(1),
  id: z.string().min(1),
});
type MenuItemTranslated = z.infer<typeof MenuItemSchema>;

// Usage example:
export async function updateItemTranslation(
  businessName: string,
  prev: any,
  formData: FormData
) {
  const result = MenuItemTranslatedSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    const rawData = Object.fromEntries(
      formData
    ) as unknown as Partial<MenuItemTranslated>;
    return {
      data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const { description, id, name, language, translations } = result.data;

  try {

    const translationsJson: Translation = JSON.parse(translations);

      translationsJson[language].name = name;
      translationsJson[language].description = description;

      await db.menuItem.update({
        where: { id },
        data: { translations: JSON.stringify(translationsJson) },
      });
    
  } catch (error) {
    console.error("create item er: " + error);

    return {
      data: result.data,
      error: "Something went wrong!",
    };
  }

  revalidateTag("menu-items" + businessName);
  return { success: true };
}

export async function createMenuItems(
  businessName: string,
  menuItems: MenuItemAI[],
  categories: Category[]
) {
  try {
    const menu = await db.menu.findFirst({
      where: { business: { name: businessName } },
    });

    const translations: { [index: number]: Translation } = {};

    if (menu) {
      const languages = menu.languages.split(",");
      const srcLang = languages.reverse().pop();

      if (srcLang) {
        // Use a for...of loop to handle async operations properly
        for (let index = 0; index < menuItems.length; index++) {
          const item = menuItems[index];
          const textToTranslate = item.name + "_" + item.description;

          if (textToTranslate !== "_") {
            try {
              // Fetch translations for the item
              const translationResult = await translateTextToMultipleDeepL(
                textToTranslate,
                srcLang as SourceLanguageCode,
                languages as TargetLanguageCode[]
              );

              // Initialize translations for the current item
              translations[index] = translations[index] || {};

              for (let i = 0; i < translationResult.length; i++) {
                const translationArr = translationResult[i].split("_");
                const nameTranslation = translationArr[0];
                const descTranslation = translationArr[1];

                translations[index][languages[i]] = {
                  name: nameTranslation !== "" ? nameTranslation : item.name,
                  description:
                    descTranslation !== "" ? descTranslation : item.description,
                };
              }
            } catch (error) {
              console.error(`Error translating item "${item.name}":`, error);
              // Handle error in translation (you may decide to log or skip)
            }
          }
        }
      }

      const data = menuItems.map((item, i) => {
        const { category, preferences, categoryDescription, ...rest } = item; // Destructure to exclude the 'category' field
        const matchiingCategory = categories.find((c) => c.name === category);
        return {
          ...rest, // Spread the remaining properties
          menuId: menu.id,
          categoryId: matchiingCategory?.id ?? "",
          translations: JSON.stringify(translations[i]),
          preferences: preferences ? serializeOptions(preferences) : null,
        };
      });

      await db.menuItem.createMany({
        data: data,
      });
    } else {
      return {
        error: "Something went wrong!",
      };
    }
  } catch (error) {
    console.error("create item er: " + error);

    return {
      error: "Something went wrong!",
    };
  }

  revalidateTag("menu-items" + businessName);
  return { success: true };
}

export async function deleteMenuItem(id: string, businessName: string) {
  const menuItem = await db.menuItem.delete({ where: { id } });

  if (!menuItem.imagePath)
    return { success: false, error: "Something went wrong" };

  await deleteImage(menuItem.imagePath);
  revalidateTag("menu-items" + businessName);
  return { success: true };
}
