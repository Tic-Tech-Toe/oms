// /app/api/login/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/auth';

export async function POST(req: Request) {
  const { token } = await req.json(); 

  const expiresIn = 60 * 60 * 24 * 5 * 1400; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Session cookie creation failed:", error);
    return NextResponse.json({ status: 'error', message: 'Login failed' }, { status: 401 });
  }
}
