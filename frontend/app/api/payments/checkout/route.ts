import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await authenticatedFetch('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return new Response('Failed to process payment checkout', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
