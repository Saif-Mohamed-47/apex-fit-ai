import { NextResponse } from 'next/server';
import { authenticatedFetch } from '@/lib/api';

export async function GET() {
  const res = await authenticatedFetch('/users/me');
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch current user' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
