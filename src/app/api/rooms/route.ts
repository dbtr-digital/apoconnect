import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pharmacyId: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 })
    }

    // Räume laden, die der Benutzer sehen kann
    const rooms = await prisma.breakoutRoom.findMany({
      where: {
        OR: [
          // Eigene Räume
          { ownerId: user.pharmacyId },
          // Räume als Mitglied
          { members: { some: { pharmacyId: user.pharmacyId } } },
          // Öffentliche Räume
          { isPrivate: false }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        members: {
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            messages: true,
            posts: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, pharmacyId: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, isPrivate, maxMembers } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 })
    }

    const room = await prisma.breakoutRoom.create({
      data: {
        name,
        description,
        isPrivate: isPrivate ?? true,
        maxMembers: maxMembers || null,
        ownerId: user.pharmacyId,
        members: {
          create: {
            pharmacyId: user.pharmacyId,
            userId: user.id,
            role: "ADMIN"
          }
        }
      },
      include: {
        owner: {
          select: { id: true, name: true }
        },
        _count: {
          select: { members: true, messages: true, posts: true }
        }
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 })
  }
}
