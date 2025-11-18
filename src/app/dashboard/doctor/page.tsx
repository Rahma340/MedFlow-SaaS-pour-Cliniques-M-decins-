import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DoctorDashboardClient from "./DoctorDashboardClient.tsx";

export default async function DoctorDashboard() {
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

  if (role !== "DOCTOR") redirect("/dashboard");

  return <DoctorDashboardClient session={session} clinic={clinic} />;
}
