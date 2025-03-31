"use server";
import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  Type,
} from "@google/genai";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { createMenuItems } from "./app/(business)/[businessName]/_actions/menu-items";
import { MenuItemAI } from "./types";
import { createCategories } from "./app/(business)/[businessName]/_actions/categories";
import { serializeOptions } from "./lib/preferences";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const fileSchema = z.instanceof(File, { message: "Required" });

// const imageOrPdfSchema = fileSchema.refine(
//   (file) => file.size === 0 || file.type.startsWith("image/") || file.type === "application/pdf",
//   { message: "File must be an image or a PDF" }
// );
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

export async function extractMenuItemsFromImage(
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
    // const fileBuffer = Buffer.from(await file.arrayBuffer()).toString("base64")

    await fs.mkdir("menus", { recursive: true });
    const filePath = `menus/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    // const arrayBuffer = await image.arrayBuffer();
    // const imageBytes = Buffer.from(arrayBuffer).toString("base64");
    console.log(file.type);
    //   const fileBuffer =  Buffer.from(await imageFile.arrayBuffer());


    const uploadedFile = await ai.files.upload({
      file: filePath,
      // config:{
      //   mimeType:"image/jpeg"
      // }
    });
    console.log(uploadedFile);

    if (uploadedFile && uploadedFile.uri && uploadedFile.mimeType) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          createUserContent([
            `Extract all menu items from the provided image or pdf and structure them in the JSON format below.
                  
                  - If image or pdf is not a menu your response should be <%%%Not a menu%%%>.
                  - Identify all menu items and categorize them properly using the categories in the menu.
                  - Ensure you dont skip any items.
                  - Ensure the output strictly follows the JSON structure.
                  - Convert all prices to cents (remove symbols like "$").
                  - If any description or preferences are missing, return them as null.
                  - Ignore non-menu text such as restaurant names or disclaimers.
                  - If category specifies any prefernces or extras include them to the preference of each item that belong to this category. Example 1: If inside the category area there is text saying served with rice or fries you have to add a prefernce to each item of the category like: {name:"side",values:["rice","fries"]}. Example 2: If inside the category area there is text saying add bacon +1.50 , add egg or whatever looks like an option include it as well in prefences like: {name:"extras",values:["bacon +150","egg"]} . Example 3: If inside the category area there is text saying add syrop, chocolate chips or caramel +3.90 whatever looks like an option include it as well in prefences like: {name:"extras",values:["syrop + 390","chocolate chips +390", "caramel +390"]}
                  `,
            createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
          ]),
        ],
        config: {
          systemInstruction:
            "You are an AI designed to extract structured menu data from images of restaurant,bar or cafeteria menus.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                  description: "The name of the product",
                },
                description: {
                  type: Type.STRING,
                  nullable: true,
                  description: "The name of the product",
                },
                priceInCents: {
                  type: Type.NUMBER,
                  nullable: false,
                  description: "The price of the product in cents",
                },
                category: {
                  type: Type.STRING,
                  nullable: false,
                  description: "The category the product belongs to",
                },
                categoryDescription: {
                  type: Type.STRING,
                  nullable: false,
                  description:
                    "Describe the category of the product with a few words to provide context to translation ai",
                },
                // preferences: { type: Type.STRING, nullable: true, description:"The options the customers have when ordering the product" },
                preferences: {
                  type: Type.ARRAY,
                  nullable: true,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING,
                        nullable: false,
                        description:
                          "The name of the prefernce, e.g sugar:sweet,medium,none the prefernce name is sugar",
                      },
                      values: {
                        type: Type.ARRAY,
                        nullable: false,
                        items: {
                          type: Type.STRING,
                        },
                        description:
                          "The values of the prefernce, e.g sugar:sweet,medium,none the prefernce values are sweet,meduim,none",
                      },
                    },
                  },
                  description:
                    "The options or extras the customers can specify when ordering the product. This can be options or prefernces of the item itself or from the category that th item belongs to.",
                },
              },
              required: [
                "name",
                "priceInCents",
                "category",
                "categoryDescription",
              ],
            },
          },
        },
      });

      if (response.text) {
        if (response.text.includes("%%%Not a menu%%%"))
          return {
            error:
              "The provided file is not a menu. Please upload a valid file",
          };
        const menuItems: MenuItemAI[] = JSON.parse(response.text);

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
          categories.splice(0,5)
        );

        // const itemsWithPreferances = menuItems.map((it)=>it.preferences?it.preferences = serializeOptions(it.preferences):null)

        if (createdCategories.data) {
          const result = await createMenuItems(
            businessName,
            menuItems.splice(0,5),
            createdCategories.data
          );
          return result
        }
      }
    }
  }
}
