import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await authenticatedFetch(`/coach/clients/${id}/override-macros`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return new Response('Failed to override macros', { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await authenticatedFetch(`/coach/clients/${id}/override-macros`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    return new Response('Failed to reset macros', { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
