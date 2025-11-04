import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  const appointments = await prisma.appointment.findMany({
    where: clinicId ? { clinicId } : undefined,
    include: {
      patient: true,
      service: true,
      staff: { include: { user: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newAppointment = await prisma.appointment.create({
    data: {
      date: new Date(data.date),
      notes: data.notes,
      status: data.status || "scheduled",
      clinicId: data.clinicId,
      patientId: data.patientId,
      serviceId: data.serviceId,
      staffId: data.staffId || null,
    },
    include: {
      patient: true,
      service: true,
      staff: { include: { user: true } },
    },
  });

  return NextResponse.json(newAppointment);
}
