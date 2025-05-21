"use server";

import {
  translateTextToMultiple,
  translateTextToMultipleDeepL,
} from "@/app/translation";
import { db } from "@/db";
import { cache } from "@/lib/cache";
import type { Translation } from "@/types";
import type { SourceLanguageCode, TargetLanguageCode } from "deepl-node";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getMenuByBusinessName } from "./menu";

export async function getCategories(businessName: string) {
  const categories = await db.category.findMany({
    where: { menu: { business: { name: businessName } } },
  });

  return categories;
}
export async function getCategoriesWithItemCount(businessName: string) {
  const categories = await db.category.findMany({
    where: { menu: { business: { name: businessName } } },
    include: { _count: { select: { menuItems: true } } },
  });
  return categories;
}

const CategorySchema = z.object({
  name: z.string().min(1),
  translateName: z.string().max(2).optional(),
  description: z.string().optional(),
  id: z.string().optional(),
});
type Category = z.infer<typeof CategorySchema>;

export async function upsertCategory(
  businessName: string,
  prev: unknown,
  formData: FormData
) {
  const result = CategorySchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const rawData = Object.fromEntries(formData) as Partial<Category>;

    return {
      data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const { description, name, id, translateName } = result.data;

  try {
    const menu = await db.menu.findFirst({
      where: { business: { name: businessName } },
    });

    const translations: Translation = {};

    if (menu) {
      const languages = menu.languages.split(",") as TargetLanguageCode[];
      const srcLang = languages.reverse().pop() as SourceLanguageCode;

      if (srcLang) {
        const textToTranslate = translateName ? name : null;

        if (textToTranslate) {
          const translationResult = await translateTextToMultipleDeepL(
            textToTranslate,
            srcLang,
            languages,
            description
          );

          for (let i = 0; i < translationResult.length; i++) {
            const translation = translationResult[i];

            translations[languages[i]] = {
              name: translation !== "" ? translation : name,
              description: "",
              preferences: null,
            };
          }
        }
      }
      await db.category.upsert({
        where: { id: id ?? "" },
        create: {
          name,
          description,
          menuId: menu.id,
          translations: JSON.stringify(translations),
        },
        update: {
          name,
          description,
          translations: JSON.stringify(translations),
        },
      });
    }
  } catch (error) {
    console.error(`upsert category er: ${error}`);

    return {
      data: result.data,
      error: "Something went wrong!",
    };
  }

  revalidateTag(`categories${businessName}`);
  return { success: true };
  // redirect("/test/dashboard/menu-items");
}

const TranslationCategorySchema = z.object({
  name: z.string().min(1),
  id: z.string().optional(),
  translations: z.string().min(1),
  language: z.string().min(1),
});
export async function updateTranslationCategory(
  businessName: string,
  prev: unknown,
  formData: FormData
) {
  const result = TranslationCategorySchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    const rawData = Object.fromEntries(formData) as Partial<Category>;

    return {
      data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, id, translations, language } = result.data;
  try {
    const translationsJson: Translation = JSON.parse(translations);

    translationsJson[language].name = name;

    await db.category.update({
      where: { id },
      data: { translations: JSON.stringify(translationsJson) },
    });
  } catch (error) {
    console.error(`upsert category er: ${error}`);

    return {
      data: result.data,
      error: "Something went wrong!",
    };
  }

  revalidateTag(`categories${businessName}`);
  return { success: true };
  // redirect("/test/dashboard/menu-items");
}

export async function createCategories(
  businessName: string,
  categories: { name: string; description: string }[]
) {

  if(categories.length===0) return{data:[]}
  try {
    const menu = await db.menu.findFirst({
      where: { business: { name: businessName } },
    });

    const translations: { [index: number]: Translation } = {};

    if (menu) {
      const languages = menu.languages.split(",");
      const srcLang = languages.reverse().pop();

      if (srcLang) {
        for (let index = 0; index < categories.length; index++) {
          const category = categories[index];

          try {
            const translationResult = await translateTextToMultipleDeepL(
              category.name,
              srcLang as SourceLanguageCode,
              languages as TargetLanguageCode[],
              category.description
            );

            translations[index] = translations[index] || {};

            for (let i = 0; i < translationResult.length; i++) {
              translations[index][languages[i]] = {
                name:
                  translationResult[i] !== ""
                    ? translationResult[i]
                    : category.name,
                description: null,
                preferences: null,
              };
            }
          } catch (error) {
            console.error(`Error translating item "${category.name}":`, error);
          }
        }
      }

      const data = categories.map((category, i) => {
        return {
          name: category.name,
          menuId: menu.id,
          translations: JSON.stringify(translations[i]),
        };
      });

      const result = await db.category.createManyAndReturn({
        data: data,
      });
      revalidateTag(`categories${businessName}`);
      return { data: result };
    } 
      return {
        error: "Something went wrong!",
      };
    
  } catch (error) {
    console.error(`create item er: ${error}`);

    return {
      error: "Something went wrong!",
    };
  }

  // return categoriesNames;
  // redirect("/test/dashboard/menu-items");
}

export async function deleteCategory(id: string, businessName: string) {
  const category = await db.category.delete({ where: { id } });

  if (!category) return { success: false, error: "Something went wrong" };

  revalidateTag(`categories${businessName}`);
  return { success: true };
}
