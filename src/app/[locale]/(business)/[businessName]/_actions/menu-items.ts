'use server';
import type { Category } from '@prisma/client';
import type { SourceLanguageCode, TargetLanguageCode } from 'deepl-node';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { translateTextArrayToMultipleDeepL } from '@/app/translation';
import { deleteImage, uploadImage } from '@/cloudinary';
import { db } from '@/db';
import type { MenuItemAI, Option, Translation, TranslationAI } from '@/types';
import { getMenuByBusinessName } from './menu';

export async function getMenuItems(businessName: string) {
  const menuItems = await db.menuItem.findMany({
    where: { menu: { business: { name: businessName } } },
    include: { category: { select: { name: true } } },
  });
  return menuItems;
}
export async function getActiveMenuItems(businessName: string) {
  const menuItems = await db.menuItem.findMany({
    where: { isAvailable: true, menu: { business: { name: businessName } } },
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

const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/'), {
  message: 'Not a valid image file',
});

// Function to extract text from options for translation
function extractOptionText(options: string): string {
  const parsed = JSON.parse(options) as Option[];
  return parsed
    .map((option) => {
      const optionName = option.name;
      const valueNames = option.values.map((value) => value.name);
      return `${optionName}-${valueNames.join('-')}`;
    })
    .join('-');
}

// Function to reconstruct options from translated text
function reconstructOptions(translatedText: string, originalOptions: Option[]): Option[] {
  const translatedParts = translatedText.split('-');
  let currentIndex = 0;

  return originalOptions.map((option) => {
    // Get the translated option name
    const translatedName = translatedParts[currentIndex++];

    // Get all translated values for this option
    const translatedValues = option.values.map(() => {
      const translatedValue = translatedParts[currentIndex++];
      return translatedValue;
    });

    // Create new option with translated names but preserve original structure
    return {
      name: translatedName,
      type: option.type, // Preserve original type
      values: option.values.map((value, index) => ({
        name: translatedValues[index],
        price: value.price, // Preserve original price
      })),
    };
  });
}

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

async function getCachedMenuByBusinessName(businessName: string) {
  'use cache';
  cacheTag(`menu${businessName}`);
  cacheLife({ revalidate: 60 * 60 });

  return getMenuByBusinessName(businessName);
}

export async function upsertMenuItem(
  businessName: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  prev: any,
  formData: FormData,
) {
  const result = MenuItemSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const rawData = Object.fromEntries(formData) as unknown as Partial<MenuItem>;
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
    const menu = await getCachedMenuByBusinessName(businessName);

    const translations: Translation = {};

    if (menu) {
      const languages = menu.languages.split(',');
      const srcLang = languages.reverse().pop();

      if (srcLang) {
        const textArayToTranslate: string[] = [];

        if (translateName) textArayToTranslate.push(name);
        if (translateDescription && description) textArayToTranslate.push(description);
        if (options) textArayToTranslate.push(extractOptionText(options));

        if (textArayToTranslate.length > 0) {
          const translationResult = await translateTextArrayToMultipleDeepL(
            textArayToTranslate,
            srcLang as SourceLanguageCode,
            languages as TargetLanguageCode[],
          );

          for (let i = 0; i < translationResult.length; i++) {
            const prefTranslation = options
              ? (reconstructOptions(
                  translationResult[i].findLast((el) => el.length > 0) ?? '',
                  JSON.parse(options ?? '') as Option[],
                ) as Option[])
              : null;

            translations[languages[i]] = {
              name: translateName ? translationResult[i][0] : name,
              description: translateDescription
                ? translateName
                  ? translationResult[i][1]
                  : translationResult[i][0]
                : description,
              preferences:
                prefTranslation?.map((pr) => ({
                  name: pr.name,
                  values: pr.values.map((v) => v.name),
                })) ?? null,
            };
          }
        } else {
          for (let i = 0; i < languages.length; i++) {
            translations[languages[i]] = {
              name: name,
              description: description,
              preferences: null,
            };
          }
        }
      }

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let uploadedImage: any;
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
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
        where: { id: id ?? '' },
        create: dataToUpsert,
        update: dataToUpsert,
      });
    } else {
      return {
        data: result.data,
        error: 'Something went wrong!',
      };
    }
  } catch (error) {
    console.error(`create item er: ${error}`);

    return {
      data: result.data,
      error: 'Something went wrong!',
    };
  }

  revalidateTag(`menu-items${businessName}`, 'max');
  revalidateTag(`categories${businessName}`, 'max');

  return { success: true };
}

const MenuItemTranslatedSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  translations: z.string().min(1),
  preferences: z.string().optional(),
  language: z.string().min(1),
  id: z.string().min(1),
});
type MenuItemTranslated = z.infer<typeof MenuItemSchema>;

// Usage example:
export async function updateItemTranslation(
  businessName: string,
  prev: unknown,
  formData: FormData,
) {
  const result = MenuItemTranslatedSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const rawData = Object.fromEntries(formData) as unknown as Partial<MenuItemTranslated>;
    return {
      data: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const { description, id, name, language, translations, preferences } = result.data;

  try {
    const translationsJson: Translation = JSON.parse(translations);

    translationsJson[language].name = name;
    translationsJson[language].description = description;
    translationsJson[language].preferences = preferences ? JSON.parse(preferences) : null;

    await db.menuItem.update({
      where: { id },
      data: { translations: JSON.stringify(translationsJson) },
    });
  } catch (error) {
    console.error(`create item er: ${error}`);

    return {
      data: result.data,
      error: 'Something went wrong!',
    };
  }

  revalidateTag(`menu-items${businessName}`, 'max');
  return { success: true };
}

export async function createMenuItems(
  businessName: string,
  menuItems: MenuItemAI[],
  categories: Category[],
) {
  try {
    const menu = await getCachedMenuByBusinessName(businessName);

    if (menu) {
      const data = menuItems.map((item, i) => {
        const { category, preferences, translations, categoryDescription, ...rest } = item; // Destructure to exclude the 'category' field
        const matchiingCategory = categories.find((c) => c.name === category);
        return {
          ...rest, // Spread the remaining properties
          menuId: menu.id,
          categoryId: matchiingCategory?.id ?? '',
          translations: JSON.stringify(convertTranslationFormat(translations)),
          preferences: preferences ? JSON.stringify(preferences) : null,
        };
      });

      await db.menuItem.createMany({
        data: data,
      });
    } else {
      return {
        error: 'Something went wrong!',
      };
    }
  } catch (error) {
    console.error(`create item er: ${error}`);

    return {
      error: 'Something went wrong!',
    };
  }

  revalidateTag(`menu-items${businessName}`, 'max');
  revalidateTag(`categories${businessName}`, 'max');
  revalidateTag(`generate-items${businessName}`, 'max');
  return { success: true };
}

function convertTranslationFormat(inputJson: TranslationAI[]): Translation | { error: string } {
  try {
    if (!Array.isArray(inputJson)) {
      return { error: 'Input JSON is not an array.' };
    }

    const outputJson: Translation = {};

    // biome-ignore lint/complexity/noForEach: <explanation>
    inputJson.forEach((translation) => {
      const { languageCode, name, description, preferences } = translation;
      if (languageCode) {
        outputJson[languageCode] = { name, description, preferences };
      }
    });

    return outputJson;
  } catch (error) {
    return { error: `An error occurred: ${error}` };
  }
}

export async function deleteMenuItem(id: string, businessName: string) {
  const menuItem = await db.menuItem.delete({ where: { id } });

  revalidateTag(`menu-items${businessName}`, 'max');
  revalidateTag(`categories${businessName}`, 'max');

  if (menuItem.imagePath) await deleteImage(menuItem.imagePath);

  return { success: true };
}

export async function toggleActive(id: string, active: boolean, businessName: string) {
  await db.menuItem.update({ where: { id }, data: { isAvailable: active } });
  revalidateTag(`menu-items${businessName}`, 'max');
}
