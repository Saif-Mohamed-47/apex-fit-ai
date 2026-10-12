import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await authenticatedFetch(`/coach/clients/${id}`);
  if (!res.ok) {
    return new Response('Failed to fetch client details', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
