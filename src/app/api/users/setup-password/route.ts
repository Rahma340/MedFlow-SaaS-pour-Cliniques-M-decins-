import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const user = await prisma.user.findFirst({ where: { setupToken: token } });
  if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hash(password, 10), status: "ACTIVE", setupToken: null },
  });

  return NextResponse.json({ success: true });
}
