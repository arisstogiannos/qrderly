import { inngest } from "@/inngest/client";
import { getImageBlob } from "@/cloudinary";
import { createCategories } from "../app/[locale]/(business)/[businessName]/_actions/categories";
import { createMenuItems } from "../app/[locale]/(business)/[businessName]/_actions/menu-items";
import { getMenuByBusinessName } from "../app/[locale]/(business)/[businessName]/_actions/menu";
import { GoogleGenAI } from "@google/genai";
import { extractAI } from "@/ai/extractionModel";
import { safeParse } from "@/ai/helpers";
import { partialExtractionAI } from "@/ai/partialExtractionModel";
import { MenuItemAI } from "@/types";
import { Category } from "@prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractAllItemsJob = inngest.createFunction(
  {
    id: "extract-all-items",
    name: "Extract All Items",
    concurrency: 5,
    timeouts: { finish: "20m" },
  },
  { event: "app/extractall.items" },
  async ({ event, step }) => {
    const { businessName, cloudinaryIDs , formData } = event.data as {businessName:string, cloudinaryIDs:string[], formData:FormData};

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",") || [];
    const srcLang = languages.reverse().pop();

    // Step 1: Process each image in parallel
    const processedImages = await Promise.all(
      cloudinaryIDs.map((cloudinaryID, index) =>
        step.run(`process-image-${index}`, async () => {
          const blob = await getImageBlob(cloudinaryID);
          if (!blob) {
            throw new Error(`Error fetching image from Cloudinary: ${cloudinaryID}`);
          }

          const uploadedFile = await ai.files.upload({ file: blob }).catch((err) => {
            console.error("Error uploading file to AI:", err);
            return null;
          });

          if (!uploadedFile) {
            throw new Error("Error uploading file to AI");
          }

          const response = await extractAI(uploadedFile, languages);
          if (typeof response === "string") {
            throw new Error(response);
          }

          if (response.text?.includes("%%%Not a menu%%%")) {
            throw new Error("One of the uploaded files is not a valid menu.");
          }

          const { menuItems: parsedItems, names } = safeParse(response.text || "");

          if (names?.length && uploadedFile) {
            const revivedResponse = await partialExtractionAI(uploadedFile, languages, names);

            if (typeof revivedResponse === "string") {
              throw new Error(revivedResponse);
            }

            const { menuItems: remainingItems } = safeParse(revivedResponse.text || "");
            const deduped = remainingItems.filter((it) => !names.includes(it.name));
            return [...parsedItems, ...deduped];
          } else {
            return parsedItems;
          }
        })
      )
    );

    // Flatten the array of arrays
    const allMenuItems = processedImages.flat();

    if (allMenuItems.length === 0) {
      return {
        error: "No menu items could be extracted from the uploaded files.",
        success: false,
        noNewItems: 0,
      };
    }

    // Step 2: Create categories
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

    const createdCategories = await step.run("create-categories", async () => {
      return await createCategories(businessName, categories);
    });

    

    // Step 3: Create menu items
    if ("data" in createdCategories && createdCategories.data) {
    const result = await step.run("create-menu-items", async () => {
      return await createMenuItems(
        businessName,
        allMenuItems as MenuItemAI[],
        (createdCategories.data).map((category) => ({
          ...category,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt),
        }))
      );
    })
    
    return {
        ...result,
        success: true,
        noNewItems: allMenuItems.length,
    };
}
  }
);



export const extractSomeItemsJob = inngest.createFunction(
  {
    id: "extract-some-items",
    name: "Extract Some Items",
    concurrency: 5,
    timeouts: { finish: "20m" },
  },
  { event: "app/extractsome.items" },
  async ({ event, step }) => {
    const { businessName, cloudinaryIDs, existingCategories, existingItems } = event.data as {
        businessName: string,
        existingCategories: Category[],
        existingItems: string[],
        cloudinaryIDs: string[], // now array
    }

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",") || [];
    const srcLang = languages.reverse().pop();


    // Step 1: Process each image in parallel
    const processedImages = await Promise.all(
      cloudinaryIDs.map((cloudinaryID, index) =>
        step.run(`process-image-${index}`, async () => {
          const blob = await getImageBlob(cloudinaryID);
          if (!blob) {
            throw new Error(`Error fetching image from Cloudinary: ${cloudinaryID}`);
          }

          const uploadedFile = await ai.files.upload({ file: blob }).catch((err) => {
            console.error("Error uploading file to AI:", err);
            return null;
          });

          if (!uploadedFile) {
            throw new Error("Error uploading file to AI");
          }

          const response = await extractAI(uploadedFile, languages);
          if (typeof response === "string") {
            throw new Error(response);
          }

          if (response.text?.includes("%%%Not a menu%%%")) {
            throw new Error("One of the uploaded files is not a valid menu.");
          }

          const { menuItems: parsedItems, names } = safeParse(response.text || "");

          if (names?.length && uploadedFile) {
            const revivedResponse = await partialExtractionAI(uploadedFile, languages, names);

            if (typeof revivedResponse === "string") {
              throw new Error(revivedResponse);
            }

            const { menuItems: remainingItems } = safeParse(revivedResponse.text || "");
            const deduped = remainingItems.filter((it) => !names.includes(it.name));
            return [...parsedItems, ...deduped];
          } else {
            return parsedItems;
          }
        })
      )
    );

    // Flatten the array of arrays
    const allMenuItems = processedImages.flat();

    if (allMenuItems.length === 0) {
      return {
        error: "No menu items could be extracted from the uploaded files.",
        success: false,
        noNewItems: 0,
      };
    }

    // Step 2: Merge categories
    const allCategories = new Map(
      allMenuItems.map((item) => [
        item.category,
        {
          name: item.category,
          description: item.categoryDescription,
        },
      ])
    );

    // Add existing categories to the map
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

    const createdCategories = await step.run("create-categories", async () => {
      return await createCategories(businessName, categoriesToCreate);
    }) 

    // Step 3: Create menu items
    if ("data" in createdCategories && createdCategories.data) {
      const menuItemsToCreate = allMenuItems.filter(
        (item) => !existingItems.includes(item.name)
      );

      const deduplicatedMenuItemsToCreate = Array.from(
        new Map(menuItemsToCreate.map((item) => [item.name, item])).values()
      );

      const result = await step.run("create-menu-items", async () => {
        return await createMenuItems(
          businessName,
          deduplicatedMenuItemsToCreate as MenuItemAI[],
          [...createdCategories.data, ...existingCategories].map((category) => ({
            ...category,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt),
          }))
        );
      });

      return {
        ...result,
        success: true,
        noNewItems: deduplicatedMenuItemsToCreate.length,
      };
    }

    return { error: "Failed to create categories", success: false };
  }
);
