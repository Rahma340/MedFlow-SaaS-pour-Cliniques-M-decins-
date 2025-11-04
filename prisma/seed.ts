import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PERMS = [
  "dashboard:view",
  "patient:read",
  "patient:write",
  "appointment:manage",
  "consult:write",
  "prescription:write",
  "billing:manage",
  "settings:manage",
] as const;

const ROLE_MATRIX: Record<string, string[]> = {
  ADMIN: [
    "dashboard:view",
    "patient:read",
    "patient:write",
    "appointment:manage",
    "consult:write",
    "prescription:write",
    "billing:manage",
    "settings:manage",
  ],
  doctor: [
    "dashboard:view",
    "patient:read",
    "appointment:manage",
    "consult:write",
    "prescription:write",
  ],
  RECEPTIONIST: [
    "dashboard:view",
    "patient:read",
    "patient:write",
    "appointment:manage",
    "billing:manage",
  ],
  PATIENT: ["dashboard:view"],
};

async function main() {
  // upsert permissions
  for (const p of PERMS) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  // upsert roles and attach permissions
  for (const [role, perms] of Object.entries(ROLE_MATRIX)) {
    const r = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });

    // connect permissions
    const allPerms = await prisma.permission.findMany({
      where: { name: { in: perms } },
    });

    // clear existing links then recreate
    await prisma.rolePermission.deleteMany({ where: { roleId: r.id } });
    for (const p of allPerms) {
      await prisma.rolePermission.create({
        data: { roleId: r.id, permissionId: p.id },
      });
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});