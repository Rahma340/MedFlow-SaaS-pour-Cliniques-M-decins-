import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appointmentId, doctorId, symptoms, diagnosis, notes, treatment } = body;

    const exists = await prisma.consultation.findUnique({
      where: { appointmentId }
    });

    if (exists) {
      return NextResponse.json({ error: "Une consultation existe déjà." }, { status: 400 });
    }

    const consultation = await prisma.consultation.create({
      data: {
        appointmentId,
        doctorId,
        symptoms,
        diagnosis,
        notes,
        treatment
      }
    });

    return NextResponse.json(consultation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
