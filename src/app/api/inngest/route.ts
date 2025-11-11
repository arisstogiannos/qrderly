import { serve } from 'inngest/next';
import { extractAllItemsJob } from '@/inngest/ai/extractAllItems';
import { extractSomeItemsJob } from '@/inngest/ai/extractSomeItems';
import { inngest } from '@/inngest/client';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractAllItemsJob, extractSomeItemsJob],
});
