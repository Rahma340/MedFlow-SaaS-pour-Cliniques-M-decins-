// app/api/users/invite/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { memberships: { include: { clinic: true } } },
  })

  if (!admin || !admin.memberships.length) {
    return NextResponse.json({ error: 'Clinique introuvable' }, { status: 400 })
  }

  const clinic = admin.memberships[0].clinic
  const { members } = await req.json()

  for (const m of members) {
    const roleName = m.role === 'doctor' ? 'doctor' : 'RECEPTIONIST'

    // Trouve ou crée le rôle
    let role = await prisma.role.findUnique({ where: { name: roleName } })
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName } })
    }

    // Vérifie si user existe déjà
    let user = await prisma.user.findUnique({ where: { email: m.email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: m.email,
          name: `${m.firstName} ${m.lastName}`,
          tenantId: clinic.tenantId,
        },
      })
    }

    // Crée membership
    await prisma.membership.upsert({
      where: { userId_clinicId: { userId: user.id, clinicId: clinic.id } },
      update: { roleId: role.id },
      create: { userId: user.id, clinicId: clinic.id, roleId: role.id },
    })
  }

  return NextResponse.json({ success: true })
}
