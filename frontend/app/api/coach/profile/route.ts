import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const res = await authenticatedFetch('/coach/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to update coach profile' }));
    return new Response(JSON.stringify({ error: errorData.detail || 'Failed to update profile' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  return Response.json(data);
}
