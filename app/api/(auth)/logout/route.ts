import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies();

  // Expire the session cookie
  cookieStore.set('__session', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ status: 'logged_out' });
}
