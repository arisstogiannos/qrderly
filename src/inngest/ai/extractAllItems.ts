import { inngest } from "@/inngest/client";
import { getImageBlob } from "@/cloudinary";
import { GoogleGenAI } from "@google/genai";
import { extractAI } from "@/inngest/ai/extractionModel";
import { safeParse } from "@/inngest/ai/helpers";
import { partialExtractionAI } from "@/inngest/ai/partialExtractionModel";
import type { MenuItemAI, TranslationAI } from "@/types";
import { getMenuByBusinessName } from "@/app/[locale]/(business)/[businessName]/_actions/menu";
import { createCategories } from "@/app/[locale]/(business)/[businessName]/_actions/categories";
import { createMenuItems } from "@/app/[locale]/(business)/[businessName]/_actions/menu-items";
import { PDFDocument } from 'pdf-lib';

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
    const { businessName, cloudinaryIDs, fileType } = event.data as {
      businessName: string;
      cloudinaryIDs: string[];
      formData: FormData;
      fileType: "pdf" | "image"
    };

    const menu = await getMenuByBusinessName(businessName);
    const languages = menu?.languages.split(",") || [];
    const srcLang = languages.reverse().pop();
    let aiResults: unknown

    if (fileType === "pdf") {

      const blob = await getImageBlob(cloudinaryIDs[0]);
      if (!blob) return;

      const buffer = Buffer.from(await blob.arrayBuffer());
      const originalPdf = await PDFDocument.load(buffer);
      const totalPages = originalPdf.getPageCount();

      // Split into 5 evenly distributed parts
      const parts = 5;
      const basePagesPerPart = Math.floor(totalPages / parts);
      const extraPages = totalPages % parts;
      
      const pageGroups: number[][] = [];
      let currentPage = 0;
      
      for (let i = 0; i < parts; i++) {
        const count = basePagesPerPart + (i < extraPages ? 1 : 0); // Distribute remainder to the first few parts
        const group = Array.from({ length: count }, (_, j) => currentPage + j);
        currentPage += count;
        if (group.length) pageGroups.push(group);
      }

      aiResults = await Promise.all(
        pageGroups.map((pageIndexes, groupIndex) =>
          step.run(`extract-pdf-part-${groupIndex + 1}`, async () => {
            const firstItemsArray: MenuItemAI[] = []
            const work = (async () => {
              const newPdf = await PDFDocument.create();
              const copiedPages = await newPdf.copyPages(originalPdf, pageIndexes);
              for(const page of copiedPages){
                newPdf.addPage(page)
              }
              // copiedPages.forEach((p) => newPdf.addPage(p));
              const pdfBytes = await newPdf.save();

              const blobPart = new Blob([pdfBytes], { type: "application/pdf" });

              const uploadedFile = await ai.files.upload({ file: blobPart });
              if (!uploadedFile) return [];

              const response = await extractAI(uploadedFile, languages);
              if (typeof response !== "string") return [];

              if (response.includes("%%%Not a menu%%%")) return [];

              const { menuItems: parsedItems, names } = safeParse(response || "");
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
              new Promise<MenuItemAI[]>((resolve) =>
                setTimeout(() => resolve(firstItemsArray), 51000)
              ),
            ]);
          })
        )
      );


    } else {

      // Step 1: Process each image in parallel
      aiResults = await Promise.all(
        cloudinaryIDs.map((cloudinaryID, index) =>
          step.run(`process-image-${index}`, async () => {
            // wrap your real work in a promise...
            const firstItemsArray: MenuItemAI[] = []
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
              new Promise<MenuItemAI[]>((resolve) =>
                setTimeout(() => resolve(firstItemsArray), 51000)
              ),
            ]);
          })
        )
      );
    }

    // const timedOutImages = processedImages.filter(
    //   (items) => typeof items === "string"
    // );
    const timedOutImages: string[] = []

    if (timedOutImages.length === cloudinaryIDs.length) {
      return {
        error:
          "Your image(s) were too big to process. Please try again with uploading smaller parts of the menu. (max 25 products per image)",
        success: false,
        noNewItems: 0,
        faildImages: timedOutImages,
      };
    }
    const temp = aiResults as MenuItemAI[]
    // Flatten the array of arrays
    const allMenuItems = temp
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
