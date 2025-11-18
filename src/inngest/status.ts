'use server';
export type InngestRunStatus = 'Completed' | 'Cancelled' | 'Failed' | 'Timeout';
export type InngestRun =
  | {
      status: 'Completed';
      output: { noNewItems: number; success: boolean; faildImages?: string[]; error?: string };
    }
  | {
      status: 'Cancelled' | 'Failed' | 'Timeout';
      error: string;
    };

export async function getRunOutput(eventId: string): Promise<InngestRun> {
  let runs = await getRuns(eventId);
  while (runs[0]?.status !== 'Completed') {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    runs = await getRuns(eventId);
    if (runs[0]?.status === 'Failed' || runs[0]?.status === 'Cancelled') {
      return { error: 'Function run timed out', status: runs[0].status };
    }
  }
  return { status: 'Completed', output: runs[0].output };
}

async function getRuns(eventId: string) {
  const response = await fetch(`${process.env.INNGEST_API_URL}/v1/events/${eventId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
    cache: 'no-store',
  });
  const json = await response.json();
  return json.data;
}
