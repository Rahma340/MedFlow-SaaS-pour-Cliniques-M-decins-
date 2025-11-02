import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StaffClient from "./StaffClient";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.tenantId) {
    return <div className="p-8 text-gray-600">Aucune clinique associée.</div>;
  }

  const clinic = await prisma.clinic.findUnique({
    where: { tenantId: user.tenantId },
  });

  const staff = await prisma.membership.findMany({
    where: { clinicId: clinic?.id },
    include: { user: true, role: true },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">👥 Équipe de la clinique {clinic?.name}</h1>
      <StaffClient staff={staff} clinicId={clinic?.id!} />
    </div>
  );
}
