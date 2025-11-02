
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    tenantId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      tenantId?: string | null;
    }
  }

  interface JWT {
    id?: string;
    tenantId?: string | null;
  }
}