import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      service: true,
      staff: { include: { user: true } },
    },
  });
  return NextResponse.json(appointment);
}

export async function PUT(req: Request, { params }: any) {
  const data = await req.json();
  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      date: new Date(data.date),
      notes: data.notes,
      status: data.status,
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
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: any) {
  await prisma.appointment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
