'use server';

import { inngest } from "@/inngest/client";
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
