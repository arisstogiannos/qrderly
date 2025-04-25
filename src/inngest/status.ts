"use server";

import { cookies } from "next/headers";

export type InngestRunStatus = "Completed" | "Cancelled" | "Failed" | "Timeout";
export type InngestRun =
  | {
      status: "Completed";
      output: { noNewItems: number; success: boolean };
    }
  | {
      status: "Cancelled" | "Failed" | "Timeout";
      error: string;
    };


export async function getRunOutput(eventId: string): Promise<InngestRun> {
  let runs = await getRuns(eventId);
  let timeElapsed = 0;
  while (runs[0]?.status !== "Completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timeElapsed += 1;
    if (timeElapsed > 4) {
        (await cookies()).set({
          name: "inngestEventId",value:eventId,expires: new Date(Date.now() + 1000 * 60 * 20 ),
        })
      return { error: "Function run timed out", status: "Timeout" };
    }
    runs = await getRuns(eventId);
    console.log(runs)
    if (runs[0]?.status === "Failed" || runs[0]?.status === "Cancelled") {
      return { error: "Function run timed out", status: runs[0].status };
    }
  }
  return { status: "Completed", output: runs[0].output };
}

async function getRuns(eventId: string) {
  const response = await fetch(
    `https://api.inngest.com/v1/events/${eventId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },cache:"no-store"
    },
  );
  const json = await response.json();
  return json.data;
}
