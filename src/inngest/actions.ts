'use server';

import { inngest } from "@/inngest/client";
import { Category } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function startInngestJobServerAction({
  businessName,
  cloudinaryPublicIDs,
}: {
  businessName: string;
  cloudinaryPublicIDs: string[];
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
  existingItems
}: {
        businessName: string,
        existingCategories: Category[],
        existingItems: string[],
        cloudinaryPublicIDs: string[], // now array

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
      },
    });

    return { jobId, eventId: ids[0] };
  } catch (error) {
    console.error("Inngest job error", error);
    throw new Error("Failed to trigger Inngest job");
  }
}
