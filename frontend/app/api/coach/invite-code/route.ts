import { authenticatedFetch } from '@/lib/api';

export async function GET() {
  const res = await authenticatedFetch('/coach/invite-code', {
    method: 'POST',
  });
  if (!res.ok) {
    return new Response('Failed to fetch invite code', { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
