import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  if (!clinicId) return NextResponse.json([]);

  const memberships = await prisma.membership.findMany({
    where: { clinicId },
    include: {
      user: true,
      role: true,   
    },
  });

  return NextResponse.json(memberships);
}
