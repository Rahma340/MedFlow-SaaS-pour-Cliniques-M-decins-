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
];

const ROLE_MATRIX = {
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
  DOCTOR: [
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
  console.log("🌱 Seeding permissions...");
  for (const p of PERMS) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  console.log("🌱 Seeding roles & linking permissions...");
  for (const [role, perms] of Object.entries(ROLE_MATRIX)) {
    const r = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });

    const allPerms = await prisma.permission.findMany({
      where: { name: { in: perms } },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: r.id } });

    for (const p of allPerms) {
      await prisma.rolePermission.create({
        data: { roleId: r.id, permissionId: p.id },
      });
    }
  }

  console.log("✅ Roles & permissions seeds done!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
