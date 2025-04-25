import { extractAllItems } from "@/ai/extractAllItems";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const extractAllItemsJob = inngest.createFunction(
  {
    id: "extract-all-items",
    name: "Extract All Items",
    concurrency: 5,
    timeouts: { finish: "20m" },
  },
  { event: "app/extractall.items" },
  async ({ event, step }) => {
    const { businessName, cloudinaryIDs, formData } = event.data;
    const results = await step.run("process-images", async () => {
      return await extractAllItems(businessName, cloudinaryIDs, {}, formData);
    });
    return results;
  }
);

export type ExtractAllItemsJobType = typeof extractAllItems;
