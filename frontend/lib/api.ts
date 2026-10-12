import { cookies } from 'next/headers';

// IMPORTANT: This helper must ONLY be called from server-side contexts 
// (Route Handlers, Server Components, Server Actions). 
// It relies on 'next/headers' which is not available in Client Components.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function authenticatedFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token.value}`);
  }
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${BACKEND_URL}${path}`, {
    cache: 'no-store',
    ...options,
    headers,
  });

  return response;
}
