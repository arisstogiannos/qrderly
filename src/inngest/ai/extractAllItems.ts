import { inngest } from "@/inngest/client";
import { getImageBlob } from "@/cloudinary";
import { GoogleGenAI } from "@google/genai";
import { extractAI } from "@/inngest/ai/extractionModel";
import { safeParse } from "@/inngest/ai/helpers";
import { partialExtractionAI } from "@/inngest/ai/partialExtractionModel";
import { MenuItemAI } from "@/types";
import { Category } from "@prisma/client";
import { getMenuByBusinessName } from "@/app/[locale]/(business)/[businessName]/_actions/menu";
import { createCategories } from "@/app/[locale]/(business)/[businessName]/_actions/categories";
import { createMenuItems } from "@/app/[locale]/(business)/[businessName]/_actions/menu-items";
import { string } from "zod";
import { InngestRun } from "../status";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ExtractAllItemsJob = {
  noNewItems: number;
  success: boolean;
  faildImages?: string[];
  error?: string;
};

export const extractAllItemsJob = inngest.createFunction(
  {
    id: "extract-all-items",
    name: "Extract All Items",
    concurrency: 5,
    timeouts: { finish: "2m" },
    retries: 2,
  },
  { event: "app/extractall.items" },
  async ({ event, step }): Promise<ExtractAllItemsJob | undefined> => {
    const { businessName, cloudinaryIDs } = event.data as {
      businessName: string;
      cloudinaryIDs: string[];
      formData: FormData;
    };

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",") || [];
    const srcLang = languages.reverse().pop();

    
    // Step 1: Process each image in parallel
    const processedImages = await Promise.all(
      cloudinaryIDs.map((cloudinaryID, index) =>
        step.run(`process-image-${index}`, async () => {
          // wrap your real work in a promise...
          const firstItemsArray:MenuItemAI[] = []
          const work = (async () => {
            const blob = await getImageBlob(cloudinaryID);
            if (!blob) return [];

            const uploadedFile = await ai.files.upload({ file: blob });
            if (!uploadedFile) return [];

            const response = await extractAI(uploadedFile, languages);
            if (typeof response !== "string") return [];

            if (response.includes("%%%Not a menu%%%")) return [];

            const { menuItems: parsedItems, names } = safeParse(
              response || ""
            );

            firstItemsArray.push(...parsedItems);

            if (names?.length) {
              const revived = await partialExtractionAI(
                uploadedFile,
                languages,
                names
              );
              if (typeof revived !== "string") return parsedItems;
              const { menuItems: more } = safeParse(revived || "");
              return [
                ...parsedItems,
                ...more.filter((i) => !names.includes(i.name)),
              ];
            }
            return parsedItems;
          })();

          return await Promise.race<MenuItemAI[] | string>([
            work,
            new Promise<MenuItemAI[] >((resolve) =>
              setTimeout(() => resolve(firstItemsArray), 51000)
            ),
          ]);
        })
      )
    );

    // const timedOutImages = processedImages.filter(
    //   (items) => typeof items === "string"
    // );
    const timedOutImages:string[] = []

    if (timedOutImages.length === cloudinaryIDs.length) {
      return {
        error:
          "Your image(s) were too big to process. Please try again with uploading smaller parts of the menu. (max 25 products per image)",
        success: false,
        noNewItems: 0,
        faildImages: timedOutImages,
      };
    }

    // Flatten the array of arrays
    const allMenuItems = processedImages
      .flat()
      .filter((items) => typeof items !== "string");

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
          createdCategories.data.map((category) => ({
            ...category,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt),
          }))
        );
      });
      if ("error" in result) {
        return {
          error: result.error,
          success: false,
          noNewItems: 0,
          faildImages: timedOutImages,
        };
      }

      return {
        noNewItems: allMenuItems.length,
        success: true,
        faildImages: timedOutImages,
      };
    }
  }
);
