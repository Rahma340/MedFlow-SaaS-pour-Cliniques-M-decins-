"use server";
import { prisma } from "@/lib/prisma";
import { sendInvitationEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";

export async function createStaff({ email, name, role, clinicId }: any) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, name, tenantId: clinicId },
    });

    const inviteLink = `${process.env.NEXTAUTH_URL}/invite/accept?email=${encodeURIComponent(email)}`;
    await sendInvitationEmail(email, inviteLink);
  }

  const roleRecord = await prisma.role.upsert({
    where: { name: role },
    update: {},
    create: { name: role },
  });

  await prisma.membership.upsert({
    where: {
      userId_clinicId: { userId: user.id, clinicId },
    },
    update: { roleId: roleRecord.id },
    create: { userId: user.id, clinicId, roleId: roleRecord.id },
  });

  revalidatePath("/dashboard/staff");
}

export async function updateStaff(id: string, data: { name?: string; role?: string }) {
  const membership = await prisma.membership.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!membership) throw new Error("Membre introuvable");

  if (data.name) {
    await prisma.user.update({
      where: { id: membership.userId },
      data: { name: data.name },
    });
  }

  if (data.role) {
    const roleRecord = await prisma.role.upsert({
      where: { name: data.role },
      update: {},
      create: { name: data.role },
    });

    await prisma.membership.update({
      where: { id },
      data: { roleId: roleRecord.id },
    });
  }

  revalidatePath("/dashboard/staff");
}

export async function deleteStaff(id: string) {
  await prisma.membership.delete({ where: { id } });
  revalidatePath("/dashboard/staff");
}
