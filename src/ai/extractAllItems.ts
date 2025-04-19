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
import { getImageBlob } from "@/cloudinary";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



export async function extractAllItems(
  businessName: string,
  cloudinaryIDs:string[],
  prevstate: any,
  formData: FormData
) {

  // const blob = await getImageBlob(cloudinaryID)
  //   if (!blob) {
  //     return { error: 'Error uploading image. Try again' };
  //   }

  //   const uploadedFile = await ai.files.upload({
  //     file: blob,
  //   });

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",");
    const srcLang = languages?.reverse().pop();

    let allMenuItems: MenuItemAI[] = [];

    for (const cloudinaryID of cloudinaryIDs) {
      const blob = await getImageBlob(cloudinaryID);
      if (!blob) {
        return { error: `Error fetching image from Cloudinary: ${cloudinaryID}` };
      }
  
      const uploadedFile = await ai.files.upload({ file: blob });
  
      const response = await extractAI(uploadedFile, languages);
      if (typeof response === "string") {
        return { error: response, success: false };
      }
  
      if (response.text?.includes("%%%Not a menu%%%")) {
        return {
          error: "One of the uploaded files is not a valid menu.",
          success: false,
        };
      }
  
      const { menuItems: parsedItems, names } = safeParse(response.text || "");
  
      if (names?.length && uploadedFile) {
        const revivedResponse = await partialExtractionAI(uploadedFile, languages, names);
  
        if (typeof revivedResponse === "string") {
          return { error: revivedResponse, success: false };
        }
  
        const { menuItems: remainingItems } = safeParse(revivedResponse.text || "");
        const deduped = remainingItems.filter((it) => !names.includes(it.name));
        allMenuItems.push(...parsedItems, ...deduped);
      } else {
        allMenuItems.push(...parsedItems);
      }
    }
  
    if (allMenuItems.length === 0) {
      return {
        error: "No menu items could be extracted from the uploaded files.",
        success: false,
        noNewItems: 0,
      };
    }

        const categories = Array.from(
          new Map(
            allMenuItems.map((item) => [
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
            allMenuItems,
            createdCategories.data
          );

          return {...result,success:true,noNewItems:allMenuItems.length};
        }
      
    
  return { success: "s" };
}
