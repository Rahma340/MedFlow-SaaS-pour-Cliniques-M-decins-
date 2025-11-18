import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReceptionDashboardClient from "./ReceptionDashboardClient";

export default async function ReceptionDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          role: true,
          clinic: {
            include: {
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

  if (role !== "RECEPTIONIST") redirect("/dashboard");

  return <ReceptionDashboardClient session={session} clinic={clinic} />;
}
