import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "../DashboardClient";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  // Charger données
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          role: true,
          clinic: {
            include: {
              services: true,
              memberships: { include: { user: true, role: true } },
              patients: true,
              appointments: true,
            },
          },
        },
      },
    },
  });

  const clinic = user?.memberships?.[0]?.clinic;
  const role = user?.memberships?.[0]?.role?.name;

  if (role !== "ADMIN") redirect("/dashboard");

  return <DashboardClient session={session} clinic={clinic} />;
}
