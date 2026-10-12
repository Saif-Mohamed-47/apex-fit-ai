import { authenticatedFetch } from '@/lib/api';

export async function GET() {
  const res = await authenticatedFetch('/coach/clients');
  if (!res.ok) {
    return new Response('Failed to fetch coach clients', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
