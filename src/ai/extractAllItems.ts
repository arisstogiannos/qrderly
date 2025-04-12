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
});

export async function extractAllItems(
  businessName: string,
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
    // const blob = await getImageBlob('ifbgsql6v6xapcjooypt')
    // if (!blob) {
    //   throw new Error("Failed to fetch image from Cloudinary");
    // }

    // ✅ Convert the fetched image to Blob
    // const blob = await response.blob();

    // ✅ Convert File to Blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // ✅ Upload to Gemini API
    const uploadedFile = await ai.files.upload({
      file: blob, // Upload the Blob
    });

    const getMenuCached = cacheReact(getMenuByBusinessName);

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",");
    const srcLang = languages?.reverse().pop();

    let menuItems: MenuItemAI[] = [];

    if (uploadedFile && uploadedFile.uri && uploadedFile.mimeType && menu) {
      const response = await extractAI(uploadedFile, languages);

      if (typeof response === "string") {
        return { error: response,noNewItems:3 };
      }

      if (response.text) {
        if (response.text.includes("%%%Not a menu%%%"))
          return {
            error:
              "The provided file is not a menu. Please upload a valid file",
          };

        const { menuItems: menuItemsFirst, names } = safeParse(response.text);
        if (menuItemsFirst.length === 0)
          return {
            error:
              "Your menu is too big. Try uploading a smaller part of your menu.",noNewItems:3,success:false
          };

        menuItems = menuItemsFirst;

        if (names) {
          console.log(names);
          const revivedResponse = await partialExtractionAI(
            uploadedFile,
            languages,
            names
          );

          if (typeof revivedResponse === "string") {
            return { error: revivedResponse,success:false,noNewItems:0 };
          }

          if (!revivedResponse.text) {
            return { error: "error",success:false,noNewItems:0 };
          }
          const { menuItems: remainingMenuItems, names: names2 } = safeParse(
            revivedResponse.text
          );

          console.log(remainingMenuItems.length);

          const deduplicatedremainingMenuItems = remainingMenuItems.filter(
            (it) => !names.includes(it.name)
          );
          console.log(deduplicatedremainingMenuItems.length);

          menuItems = menuItems.concat(deduplicatedremainingMenuItems);
          console.log(menuItems);
        }

        const categories = Array.from(
          new Map(
            menuItems.map((item) => [
              item.category,
              {
                name: item.category,
                description: item.categoryDescription,
              },
            ])
          ).values()
        );

        const createdCategories = await createCategories(
          businessName,
          categories
        );

        if (createdCategories.data) {
          const result = await createMenuItems(
            businessName,
            menuItems,
            createdCategories.data
          );

          return {...result,success:true,noNewItems:menuItems.length};
        }
      }
    }
  }
  return { success: "s" };
}
