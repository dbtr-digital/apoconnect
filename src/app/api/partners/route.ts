import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      include: {
        offers: {
          where: {
            isActive: true,
            OR: [
              { validUntil: null },
              { validUntil: { gte: new Date() } }
            ]
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: [
        { verified: "desc" },
        { name: "asc" }
      ]
    })

    return NextResponse.json(partners)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 })
  }
}
