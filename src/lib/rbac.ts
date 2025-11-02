import { prisma } from "./prisma";

export async function userHasPermission({
  userId,
  clinicId,
  permission,
}: {
  userId: string;
  clinicId: string;
  permission: string;
}) {
  const membership = await prisma.membership.findFirst({
    where: { userId, clinicId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!membership) return false;

  return membership.role.permissions.some(
    (rp: { permission: { name: string } }) => rp.permission.name === permission
  );
}

export const Only = {
  Admin: (role?: string) => role === "ADMIN",
};
