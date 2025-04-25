import { extractAllItems } from "@/ai/extractAllItems";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);



export const extractAllItemsJob = inngest.createFunction(
  {
    id: "extract-all-items",
    name: "Extract All Items",
  },
  { event: "app/extractall.items" },
  async ({ event }) => {
    const { businessName, cloudinaryIDs, formData } = event.data;

    const result = await extractAllItems(businessName, cloudinaryIDs, {}, formData);
    
    return result

  }
);

export type ExtractAllItemsJobType = typeof extractAllItems;