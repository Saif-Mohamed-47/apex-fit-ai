import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  // Call FastAPI backend
  const response = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }

  const { access_token } = await response.json();

  // Fetch user profile to get role and gender
  let userRole = 'client';
  let userGender = 'male';
  try {
    const meRes = await fetch(`${backendUrl}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      userRole = meData.role || 'client';
      userGender = meData.gender || 'male';
    }
  } catch (err) {
    console.error('Error fetching user details after login:', err);
  }

  // Create response and set httpOnly cookie
  const res = NextResponse.json({ 
    success: true,
    role: userRole,
    gender: userGender
  });
  await setAuthCookie(res, access_token);

  return res;
}
