import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const data = await request.json();

  // 1. Basic Validation
  const requiredFields = ['email', 'password', 'age', 'weight_kg', 'height_cm', 'gender', 'goal', 'activity_level', 'training_experience_months', 'days_per_week'];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  if (!isValidEmail(data.email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  // 2. Create user in FastAPI
  const signupRes = await fetch(`${backendUrl}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!signupRes.ok) {
    const errorData = await signupRes.json();
    return NextResponse.json({ error: errorData.detail || 'Signup failed' }, { status: signupRes.status });
  }

  // 3. Auto-login to get the token
  const loginRes = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: data.email, password: data.password }),
  });

  if (!loginRes.ok) {
    return NextResponse.json({ error: 'Signup successful, but auto-login failed' }, { status: 401 });
  }

  const { access_token } = await loginRes.json();

  // 4. Set httpOnly cookie
  const res = NextResponse.json({ success: true });
  await setAuthCookie(res, access_token);

  return res;
}
