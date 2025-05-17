"use server";

import { inngest } from "@/inngest/client";
import type { Category } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function startExtractAllItems({
  businessName,
  cloudinaryPublicIDs,
  fileType
}: {
  businessName: string;
  cloudinaryPublicIDs: string[];
  fileType:"pdf" | "image"
}) {
  const jobId = uuidv4();

  try {
    const { ids } = await inngest.send({
      name: "app/extractall.items",
      data: {
        businessName,
        cloudinaryIDs: cloudinaryPublicIDs,
        formData: {},
        jobId,
        fileType
      },
    });

    return { jobId, eventId: ids[0] };
  } catch (error) {
    console.error("Inngest job error", error);
    throw new Error("Failed to trigger Inngest job");
  }
}
export async function startExtractSomeItems({
  businessName,
  cloudinaryPublicIDs,
  existingCategories,
  existingItems,
  fileType
}: {
  businessName: string;
  existingCategories: Category[];
  existingItems: string[];
  cloudinaryPublicIDs: string[]; 
  fileType:"pdf" | "image"

}) {
  const jobId = uuidv4();

  try {
    const { ids } = await inngest.send({
      name: "app/extractsome.items",
      data: {
        businessName,
        cloudinaryIDs: cloudinaryPublicIDs,
        existingCategories,
        existingItems,
        jobId,
        fileType
      },
    });

    return { jobId, eventId: ids[0] };
  } catch (error) {
    console.error("Inngest job error", error);
    throw new Error("Failed to trigger Inngest job");
  }
}


