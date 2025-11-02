import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const ServiceSchema = z.object({
  name: z.string().min(2),
  duration: z.number().positive(),
  price: z.number().nonnegative(),
});

const BulkSchema = z.object({
  services: z.array(ServiceSchema),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user?.tenantId) {
      return NextResponse.json({ error: "Utilisateur sans tenantId" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = BulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { tenantId: user.tenantId },
    });
    if (!clinic) {
      return NextResponse.json({ error: "Clinique introuvable" }, { status: 404 });
    }

    const created = await prisma.service.createMany({
      data: parsed.data.services.map((s) => ({
        ...s,
        clinicId: clinic.id,
      })),
    });

    return NextResponse.json({ created }, { status: 201 });
  } catch (err) {
    console.error("Erreur /api/services/bulk:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
