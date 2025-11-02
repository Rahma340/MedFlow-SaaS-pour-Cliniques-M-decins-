import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          clinic: {
            include: {
              services: true,
              memberships: {
                include: { user: true, role: true },
              },
            },
          },
        },
      },
    },
  });

  const clinic = user?.memberships?.[0]?.clinic;
  if (!clinic) redirect("/onboarding");

  return <DashboardClient session={session} clinic={clinic} />;
}
