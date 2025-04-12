"use server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { createMenuItems } from "../app/[locale]/(business)/[businessName]/_actions/menu-items";
import { MenuItemAI } from "../types";
import { createCategories } from "../app/[locale]/(business)/[businessName]/_actions/categories";
import { getMenuByBusinessName } from "../app/[locale]/(business)/[businessName]/_actions/menu";
import { cache as cacheReact } from "react";
import { extractAI } from "./extractionModel";
import { safeParse } from "./helpers";
import { partialExtractionAI } from "./partialExtractionModel";
import { Category } from "@prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) =>
    file.size > 0 &&
    (file.type.startsWith("image/") || file.type.startsWith("application/pdf")),
  { message: "Not a valid file.Please try again" }
);

const UploadSchema = z.object({
  file: imageSchema,
  //   overwrite: z.string(),
});

export async function extractSomeItems(
  businessName: string,
  existingCategories: Category[],
  existingItems: string[],
  prevstate: any,
  formData: FormData
) {
  const result = UploadSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    console.error(result.error.flatten().fieldErrors.file);
    return { error: result.error.flatten().fieldErrors.file?.[0] };
  }
  const { file } = result?.data;
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const uploadedFile = await ai.files.upload({
      file: blob, // Upload the Blob
    });

    const getMenuCached = cacheReact(getMenuByBusinessName);

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",");
    const srcLang = languages?.reverse().pop();

    let menuItems: MenuItemAI[] = [];

    if (uploadedFile && uploadedFile.uri && uploadedFile.mimeType && menu) {
      const response = await partialExtractionAI(
        uploadedFile,
        languages,
        existingItems
      );

      if (typeof response === "string") {
        return { error: response,noNewItems:0,success:false};
      }

      if (response.text) {
        if (response.text.includes("%%%Not a menu%%%"))
          return {
            error:
              "The provided file is not a menu. Please upload a valid file",success:false,noNewItems:0
          };

        const { menuItems: menuItemsFirst, names } = safeParse(response.text);
        if (menuItemsFirst.length === 0)
          return {
            error:
              "Your menu is too big. Try uploading a smaller part of your menu.",
          };

        menuItems = menuItemsFirst;

        if (names) {
          const revivedResponse = await partialExtractionAI(
            uploadedFile,
            languages,
            names
          );

          if (typeof revivedResponse === "string") {
            return { error: revivedResponse,noNewItems:0,success:false };
          }

          if (!revivedResponse.text) {
            return { error: "error",noNewItems:0,success:false };
          }
          const { menuItems: remainingMenuItems, names: names2 } = safeParse(
            revivedResponse.text
          );

          const deduplicatedremainingMenuItems = remainingMenuItems.filter(
            (it) => !names.includes(it.name)
          );

          menuItems = menuItems.concat(deduplicatedremainingMenuItems);
        }

        const allCategories = new Map(
          menuItems.map((item) => [
            item.category,
            {
              name: item.category,
              description: item.categoryDescription,
            },
          ])
        );

        existingCategories.forEach((c) =>
          allCategories.set(c.name, {
            name: c.name,
            description: c.description ?? "",
          })
        );

        const allCategoriesArray = Array.from(allCategories.values());

        const categoriesToCreate = allCategoriesArray.filter(
          (c) =>
            !existingCategories.find((existing) => existing.name === c.name)
        );

        const createdCategories = await createCategories(
          businessName,
          categoriesToCreate
        );
        const menuItemsToCreate = menuItems.filter(
          (item) => !existingItems.includes(item.name)
        );


        const deduplicatedMenuItemsToCreate = Array.from(
          new Map(menuItemsToCreate.map((item) => [item.name, item])).values()
        );

        if (createdCategories.data) {
          const result = await createMenuItems(
            businessName,
            deduplicatedMenuItemsToCreate,
            createdCategories.data.concat(existingCategories)
          );

          return {...result,noNewItems:deduplicatedMenuItemsToCreate.length,success:true};
        }
      }
    }
  }
  return { success: "s" };
}
