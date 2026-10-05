import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward request with AbortSignal for graceful cancellation on client abort
  const backendRes = await authenticatedFetch('/chat/stream', {
    method: 'POST',
    body: JSON.stringify(body),
    signal: req.signal,
  });

  if (!backendRes.ok || !backendRes.body) {
    return new Response('Failed to connect to coach streaming service', { status: backendRes.status });
  }

  // Pass upstream body stream directly without buffering
  return new Response(backendRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
