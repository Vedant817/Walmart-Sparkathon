import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { IUser } from "@/models/User"
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'customer' | 'supplier' | 'store' | 'manager';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'customer' | 'supplier' | 'store' | 'manager';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'customer' | 'supplier' | 'store' | 'manager';
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email }).lean<IUser>();

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: (user._id as Types.ObjectId).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'supplier' | 'store' | 'manager';
      }
      return session;
    },
  },

  pages: {
    signIn: '/signin',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };