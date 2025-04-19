"use server";
import { GoogleGenAI } from "@google/genai";
import { createMenuItems } from "../app/[locale]/(business)/[businessName]/_actions/menu-items";
import { createCategories } from "../app/[locale]/(business)/[businessName]/_actions/categories";
import { getMenuByBusinessName } from "../app/[locale]/(business)/[businessName]/_actions/menu";
import { cache as cacheReact } from "react";
import { extractAI } from "./extractionModel";
import { partialExtractionAI } from "./partialExtractionModel";
import { safeParse } from "./helpers";
import { getImageBlob } from "@/cloudinary";
import { MenuItemAI } from "../types";
import { Category } from "@prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractSomeItems(
  businessName: string,
  existingCategories: Category[],
  existingItems: string[],
  cloudinaryIDs: string[], // now array
  prevstate: any,
  formData: FormData
) {
  const menu = await getMenuByBusinessName(businessName);
  const languages = menu?.languages.split(",");
  const srcLang = languages?.reverse().pop();

  let allMenuItems: MenuItemAI[] = [];

  for (const cloudinaryID of cloudinaryIDs) {
    const blob = await getImageBlob(cloudinaryID);
    if (!blob) {
      return { error: `Error uploading image: ${cloudinaryID}`, success: false };
    }

    const uploadedFile = await ai.files.upload({ file: blob });

    const response = await partialExtractionAI(uploadedFile, languages, existingItems);
    if (typeof response === "string") {
      return { error: response, noNewItems: 0, success: false };
    }

    if (response.text?.includes("%%%Not a menu%%%")) {
      return {
        error: "One of the uploaded files is not a valid menu.",
        noNewItems: 0,
        success: false,
      };
    }

    const { menuItems: firstPassItems, names } = safeParse(response.text || "");
    let menuItems: MenuItemAI[] = firstPassItems;

    if (names?.length && uploadedFile) {
      const revivedResponse = await partialExtractionAI(uploadedFile, languages, names);
      if (typeof revivedResponse === "string") {
        return { error: revivedResponse, noNewItems: 0, success: false };
      }

      const { menuItems: secondPassItems } = safeParse(revivedResponse.text || "");
      const deduped = secondPassItems.filter((it) => !names.includes(it.name));

      menuItems = menuItems.concat(deduped);
    }

    allMenuItems = allMenuItems.concat(menuItems);
  }

  if (allMenuItems.length === 0) {
    return {
      error: "No items could be extracted from the uploaded images.",
      noNewItems: 0,
      success: false,
    };
  }

  // Create merged and deduplicated categories
  const allCategories = new Map(
    allMenuItems.map((item) => [
      item.category,
      {
        name: item.category,
        description: item.categoryDescription || "",
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
    (c) => !existingCategories.find((existing) => existing.name === c.name)
  );

  const createdCategories = await createCategories(businessName, categoriesToCreate);

  const menuItemsToCreate = allMenuItems.filter(
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

    return {
      ...result,
      noNewItems: deduplicatedMenuItemsToCreate.length,
      success: true,
    };
  }

  return { error: "Failed to create categories", success: false };
}
