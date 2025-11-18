// app/api/inngest-job-status/route.ts
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Missing eventId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`${process.env.INNGEST_API_URL}/v1/events/${eventId}/runs`, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Inngest runs' }), {
        status: response.status,
      });
    }

    const data = await response.json();
    const run = data.data?.[0];

    return new Response(JSON.stringify({ status: run?.status, result: run?.output }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in job-status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
