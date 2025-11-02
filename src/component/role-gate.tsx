"use client";
import { useSession } from "next-auth/react";

interface RoleGateProps {
  allow: (role?: string) => boolean;
  children: React.ReactNode;
}

export function RoleGate({ allow, children }: RoleGateProps) {
  const { data } = useSession();

  const role = data?.user?.role; 
  if (!allow(role)) return null;

  return <>{children}</>;
}
