import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * 🔹 GET — Liste les services d’une clinique
 * Exemple: /api/services?clinicId=cm12345
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  try {
    const services = await prisma.service.findMany({
      where: clinicId ? { clinicId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("❌ Erreur GET /api/services :", error);
    return NextResponse.json({ error: "Erreur lors du chargement des services" }, { status: 500 });
  }
}

/**
 * 🔹 POST — Crée un nouveau service
 * body: { name, duration, price, clinicId }
 */
export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newService = await prisma.service.create({
      data: {
        name: data.name,
        duration: Number(data.duration),
        price: Number(data.price),
        clinicId: data.clinicId,
      },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error("❌ Erreur POST /api/services :", error);
    return NextResponse.json({ error: "Erreur lors de la création du service" }, { status: 500 });
  }
}

/**
 * 🔹 PUT — Met à jour un service existant
 * body: { id, name, duration, price }
 */
export async function PUT(req: Request) {
  const data = await req.json();

  if (!data.id) {
    return NextResponse.json({ error: "ID du service manquant" }, { status: 400 });
  }

  try {
    const updatedService = await prisma.service.update({
      where: { id: data.id },
      data: {
        name: data.name,
        duration: Number(data.duration),
        price: Number(data.price),
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("❌ Erreur PUT /api/services :", error);
    return NextResponse.json({ error: "Erreur lors de la modification du service" }, { status: 500 });
  }
}

/**
 * 🔹 DELETE — Supprime un service
 * body: { id }
 */
export async function DELETE(req: Request) {
  const data = await req.json();

  if (!data.id) {
    return NextResponse.json({ error: "ID du service manquant" }, { status: 400 });
  }

  try {
    await prisma.service.delete({ where: { id: data.id } });
    return NextResponse.json({ message: "Service supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/services :", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
