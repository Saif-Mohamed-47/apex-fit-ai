import { NextRequest } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function GET() {
  const res = await authenticatedFetch('/check-ins/');
  if (!res.ok) {
    return new Response('Failed to fetch check-ins', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await authenticatedFetch('/check-ins/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return new Response('Failed to submit check-in', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data, { status: 201 });
}
