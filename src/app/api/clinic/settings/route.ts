
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { taxRate, currency, stripeTestMode } = await req.json()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { memberships: { include: { clinic: true } } },
  })

  const clinic = user?.memberships[0]?.clinic
  if (!clinic)
    return NextResponse.json({ error: 'Clinique non trouvée' }, { status: 404 })

  await prisma.clinic.update({
    where: { id: clinic.id },
    data: { taxRate, currency, stripeTestMode },
  })

  return NextResponse.json({ success: true })
}
