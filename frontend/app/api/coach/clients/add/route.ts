import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await authenticatedFetch('/coach/clients/add', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to add client' }));
    return new Response(JSON.stringify({ error: errorData.detail || 'Failed to add client' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  return Response.json(data);
}
