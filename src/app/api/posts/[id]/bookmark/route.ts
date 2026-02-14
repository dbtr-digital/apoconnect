import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const { id: postId } = await params

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ message: "Bereits gespeichert" })
    }

    await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error bookmarking post:", error)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const { id: postId } = await params

    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}
