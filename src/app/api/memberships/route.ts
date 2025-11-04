import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get("clinicId");

  try {
    const staff = await prisma.membership.findMany({
      where: {
        clinicId: clinicId || undefined,
        role: {
          name: "doctor", 
        },
      },
      include: {
        user: true,
        role: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staff);
  } catch (err) {
    console.error("ERREUR /api/memberships :", err);
    return NextResponse.json([], { status: 200 });
  }
}
