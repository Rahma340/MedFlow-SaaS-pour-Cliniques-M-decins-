import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { name } = await req.json();

  // Création d’un tenantId unique pour la clinique
  const tenantId = randomUUID();

  // Crée la clinique et lie l’admin comme créateur
  const clinic = await prisma.clinic.create({
    data: {
      name,
      tenantId,
      createdById: session.user.id,
    },
  });

  // Met à jour le user avec le tenantId de la clinique
  await prisma.user.update({
    where: { id: session.user.id },
    data: { tenantId },
  });


  let role = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  if (!role) {
    role = await prisma.role.create({ data: { name: "ADMIN" } });
  }

  await prisma.membership.create({
    data: {
      userId: session.user.id,
      clinicId: clinic.id,
      roleId: role.id,
    },
  });

  return NextResponse.json({ clinic }, { status: 201 });
}
