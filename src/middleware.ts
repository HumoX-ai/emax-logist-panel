import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const token = req.cookies.get('auth_token')?.value;

  const pathname = req.nextUrl.pathname;

  // 🔒 /dashboard uchun himoya
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return Response.redirect(url);
    }
  }

  // 🚫 / sahifaga kirishni taqiqlash (agar token mavjud bo‘lsa)
  if (pathname === '/') {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: ['/', '/dashboard/:path*'] // Endi / ham tekshiriladi
};
