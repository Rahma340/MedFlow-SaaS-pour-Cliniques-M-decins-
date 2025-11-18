// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  // Charger l'utilisateur + rôle + clinique
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          role: true,
          clinic: true,
        },
      },
    },
  });

  if (!user || user.memberships.length === 0) {
    redirect("/onboarding");
  }

  const membership = user.memberships[0];
  const role = membership.role.name; // ADMIN | DOCTOR | RECEPTIONIST

  // 🔥 Redirection selon le role
  switch (role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "RECEPTIONIST":
      redirect("/dashboard/reception");
    case "DOCTOR":
      redirect("/dashboard/doctor");
    default:
      return (
        <div className="p-6 text-red-600">
          Rôle non reconnu : {role}
        </div>
      );
  }
}
