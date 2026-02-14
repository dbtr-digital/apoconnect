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
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        bio: true,
        avatarUrl: true,
        role: true,
        pharmacy: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            zipCode: true,
            phone: true,
            email: true,
            website: true,
            description: true,
            verified: true,
            users: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                avatarUrl: true,
                role: true
              }
            },
            _count: {
              select: {
                posts: true,
                users: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        position: user.position,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role
      },
      pharmacy: user.pharmacy
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const body = await request.json()
    const { bio, position } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { bio, position },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        position: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}
