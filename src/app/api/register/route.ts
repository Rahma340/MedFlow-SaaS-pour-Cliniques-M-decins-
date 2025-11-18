import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const SignUpSchema = z.object({
  firstName: z.string().min(2, "Prénom obligatoire"),
  lastName: z.string().min(2, "Nom obligatoire"),
  email: z.string().email(),
  password: z.string().min(6, "Mot de passe trop court"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = SignUpSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { firstName, lastName, email, password } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
