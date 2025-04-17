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
import { MenuItemAI, Translation, TranslationAI } from "@/types";
import { SourceLanguageCode, TargetLanguageCode } from "deepl-node";
import { cache } from "@/lib/cache";
import { Category } from "@prisma/client";
import { serializeOptions } from "@/lib/preferences";
import { getMenuByBusinessName } from "./menu";

export async function getMenuItems(businessName: string) {
  const menuItems = await db.menuItem.findMany({
    where: {menu: { business: { name: businessName } } },
    include: { category: { select: { name: true } } },
  });
  return menuItems;
}
export async function getActiveMenuItems(businessName: string) {
  const menuItems = await db.menuItem.findMany({
    where: {isAvailable:true, menu: { business: { name: businessName } } },
    include: { category: { select: { name: true } } },
  });
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
  translateName: z.string().max(2).optional(),
  description: z.string().optional(),
  translateDescription: z.string().max(2).optional(),
  categoryId: z.string().min(1),
  priceInCents: z.string().min(1),
  options: z.string().optional(),
  image: imageSchema.optional(),
  id: z.string().optional(),
});
type MenuItem = z.infer<typeof MenuItemSchema>;

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
    const getCachedMenu = cache(
      getMenuByBusinessName,
      ["menu" + businessName],
      { tags: ["menu" + businessName] }
    );

    const menu = await getCachedMenu(businessName);

    const translations: Translation = {};

    if (menu) {
      const languages = menu.languages.split(",");
      const srcLang = languages.reverse().pop();

      if (srcLang) {
        const textToTranslate =
          (translateName  ? name : "") +
          "_" +
          (translateDescription ? description : "");

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
        } else {
          for (let i = 0; i < languages.length; i++) {
            translations[languages[i]] = {
              name: name,
              description: description,
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
  revalidateTag("categories" + businessName);

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
  const getMenuCached = cache(getMenuByBusinessName, ["menu" + businessName], {
    tags: ["menu" + businessName],
  });
  try {
    const menu = await getMenuByBusinessName(businessName);

    if (menu) {
      const data = menuItems.map((item, i) => {
        const {
          category,
          preferences,
          translations,
          categoryDescription,
          ...rest
        } = item; // Destructure to exclude the 'category' field
        const matchiingCategory = categories.find((c) => c.name === category);
        return {
          ...rest, // Spread the remaining properties
          menuId: menu.id,
          categoryId: matchiingCategory?.id ?? "",
          translations: JSON.stringify(convertTranslationFormat(translations)),
          preferences: preferences ? JSON.stringify(preferences) : null,
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
  revalidateTag("categories" + businessName);
  revalidateTag("generate-items" + businessName);
  return { success: true };
}

function convertTranslationFormat(
  inputJson: TranslationAI[]
): Translation | { error: string } {
  try {
    if (!Array.isArray(inputJson)) {
      return { error: "Input JSON is not an array." };
    }

    const outputJson: Translation = {};

    inputJson.forEach((translation) => {
      const { languageCode, name, description } = translation;
      if (languageCode) {
        outputJson[languageCode] = { name, description };
      }
    });

    return outputJson;
  } catch (error) {
    return { error: `An error occurred: ${error}` };
  }
}

export async function deleteMenuItem(id: string, businessName: string) {
  const menuItem = await db.menuItem.delete({ where: { id } });

  revalidateTag("menu-items" + businessName);
  revalidateTag("categories" + businessName);

  if (menuItem.imagePath) await deleteImage(menuItem.imagePath);
  
  return { success: true };
}


export async function toggleActive(id:string,active:boolean,businessName:string){
  await db.menuItem.update({where:{id},data:{isAvailable:active}})
  revalidateTag("menu-items"+businessName)
}