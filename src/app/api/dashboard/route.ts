import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          clinic: {
            include: {
              services: true,
              memberships: true,
            },
          },
        },
      },
    },
  })

  if (!user || user.memberships.length === 0) {
    return NextResponse.json({ error: "Aucune clinique trouvée" }, { status: 404 })
  }

  const clinic = user.memberships[0].clinic

  return NextResponse.json({
    clinic: {
      id: clinic.id,
      name: clinic.name,
      currency: clinic.currency,
      taxRate: clinic.taxRate,
      servicesCount: clinic.services.length,
      staffCount: clinic.memberships.length,
      createdAt: clinic.createdAt,
    },
  })
}
