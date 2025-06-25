// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    path: '/',
    expires: new Date(0) // 1970 yil — o‘tmish
  });

  return response;
}
