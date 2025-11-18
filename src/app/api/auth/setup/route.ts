// src/app/api/auth/setup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mot de passe invalide" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { setupToken: token },
    });
    if (!user) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 404 });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        setupToken: null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
