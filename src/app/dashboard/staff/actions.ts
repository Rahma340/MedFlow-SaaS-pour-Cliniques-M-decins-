// src/app/dashboard/staff/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendInvitationEmail } from "../../../lib/mailer";
import { randomUUID } from "crypto";

export async function createStaff({
  clinicId,
  email,
  firstName,
  lastName,
  role,
}: {
  clinicId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; // "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
}) {
  // 1) Récupérer ou créer l'utilisateur
  let user = await prisma.user.findUnique({ where: { email } });

  // On choisit un token local fiable dès maintenant
  let token = user?.setupToken ?? randomUUID();

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        status: "INVITED",        // ou "PENDING" selon ta convention
        setupToken: token,
      },
    });
  } else {
    // Si l’utilisateur existe, on met à jour son token et son statut (idempotent)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        setupToken: token,
        status: "INVITED",
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
      },
    });
  }

  // 2) Résoudre le rôle
  const roleRow = await prisma.role.findUnique({
    where: { name: role.toUpperCase() },
  });
  if (!roleRow) throw new Error("Rôle introuvable: " + role);

  // 3) Upsert du membership (évite les doublons)
  await prisma.membership.upsert({
    where: { userId_clinicId: { userId: user.id, clinicId } },
    update: { roleId: roleRow.id },
    create: { userId: user.id, clinicId, roleId: roleRow.id },
  });

  // 4) Lien d’invitation basé sur NOTRE variable `token`
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const inviteLink = `${base}/auth/setup?token=${token}`;


  // 5) Envoi d’email (non bloquant)
  await sendInvitationEmail(email, inviteLink);

  sendInvitationEmail(email, inviteLink).catch((e) =>
    console.error("⚠️ Email non envoyé:", e)
  );

  revalidatePath("/dashboard");
}

export async function updateStaff(
  membershipId: string,
  { firstName, lastName, role }: { firstName: string; lastName: string; role: string }
) {
  const m = await prisma.membership.findUnique({ where: { id: membershipId } });
  if (!m) throw new Error("Membre introuvable");

  const r = await prisma.role.findUnique({ where: { name: role.toUpperCase() } });
  if (!r) throw new Error("Rôle introuvable");

  await prisma.user.update({
    where: { id: m.userId },
    data: { firstName, lastName },
  });

  await prisma.membership.update({
    where: { id: membershipId },
    data: { roleId: r.id },
  });

  revalidatePath("/dashboard");
}

export async function deleteStaff(membershipId: string) {
  await prisma.membership.delete({ where: { id: membershipId } });
  revalidatePath("/dashboard");
}
