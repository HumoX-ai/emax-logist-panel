/* eslint-disable no-console */
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { cookies } from 'next/headers'; // For setting cookies

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      type: string;
      doctorId: string;
    };
  }
}

const authConfig = {
  providers: [
    GithubProvider({}),
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        phone: {
          label: 'Phone',
          type: 'tel'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          const response = await fetch(
            'https://back.emaxb.uz/api/auth/sign-in-seller',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                phone: credentials?.phone,
                password: credentials?.password
              })
            }
          );
          const data = await response.json();
          if (response.ok && data?.token) {
            return {
              id: data.seller._id, // JWT’da saqlanadi
              name: data.seller.fullName,
              email: data.seller.phone, // Telefonni email sifatida ishlatamiz
              token: data.token, // JWT tokenni saqlaymiz
              sellerId: data.seller._id
            };
          } else {
            return null;
          }
        } catch (e) {
          console.error('Authorize error:', e);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/' // sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).token) {
        // Birinchi kirishda user ma'lumotlari token'ga qo'shiladi
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = (user as any).token; // API'dan kelgan tokenni saqlaymiz
        token.type = (user as any).type;

        // JWT tokendan expire vaqtini olish
        let expiryDate;
        try {
          // JWT tokenni decode qilish (base64)
          const tokenParts = (user as any).token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(tokenParts[1], 'base64').toString()
            );
            if (payload.exp) {
              // JWT token o'z ichida exp (expire) vaqtini saqlaydi
              expiryDate = new Date(payload.exp * 1000); // sekundni millisekund qilish
            }
          }
        } catch (error) {
          console.error('JWT token parse error:', error);
          // Xato bo'lgan holda default expire vaqtini ishlatish (24 soat)
          expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        // Set the token in a cookie with expiry from JWT
        (await cookies()).set({
          name: 'auth_token',
          value: (user as any).token,
          httpOnly: true, // Prevent client-side JavaScript access
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'strict', // Prevent CSRF
          path: '/',
          expires: expiryDate // JWT tokendan olingan expire vaqti
        });
      }
      return token;
    },
    // Sessiyaga ma’lumotlarni qo‘shish
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name ?? '';
      session.user.email = token.email ?? ''; // Telefon raqami
      session.accessToken = token.accessToken as string; // JWT token
      session.user.type = token.type as string;
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.SECRET
} satisfies NextAuthConfig;

export default authConfig;
