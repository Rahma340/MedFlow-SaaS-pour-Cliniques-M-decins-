import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              include: {
                role: true,
                clinic: true,
              },
            },
          },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        const membership = user.memberships?.[0];

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          tenantId: membership?.clinic?.tenantId || null,
          role: membership?.role?.name || null, // ⭐ AJOUT RÔLE
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.tenantId = user.tenantId;
        token.role = user.role; // ⭐ AJOUT ROLE DANS TOKEN
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.tenantId = token.tenantId;
      session.user.role = token.role; // ⭐ AJOUT ROLE DANS SESSION
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
};
