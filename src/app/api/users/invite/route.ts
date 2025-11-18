import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const { members } = await req.json();

  try {
    for (const member of members) {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: member.email },
      });

      if (existingUser) continue;

      // Générer un token de configuration
      const token = randomBytes(32).toString("hex");

      // Créer un utilisateur en attente
      await prisma.user.create({
        data: {
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role,
          status: "PENDING",
          setupToken: token,
        },
      });

      // TODO: Envoyer email
      console.log(`Send email to ${member.email}: https://your-domain.com/setup-account?token=${token}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l’invitation" }, { status: 500 });
  }
}
