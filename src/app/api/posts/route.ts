import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { generateExcerpt, slugify } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const roomId = searchParams.get("roomId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const session = await auth()

    const posts = await prisma.post.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(roomId ? { breakoutRoomId: roomId } : { breakoutRoomId: null }),
        visibility: "PUBLIC"
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            position: true
          }
        },
        pharmacy: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        ...(session?.user?.id && {
          likes: {
            where: { userId: session.user.id },
            select: { id: true }
          },
          bookmarks: {
            where: { userId: session.user.id },
            select: { id: true }
          }
        })
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      skip: offset
    })

    // Markiere ob User liked/bookmarked hat
    const postsWithStatus = posts.map(post => ({
      ...post,
      isLiked: 'likes' in post && Array.isArray(post.likes) && post.likes.length > 0,
      isBookmarked: 'bookmarks' in post && Array.isArray(post.bookmarks) && post.bookmarks.length > 0,
      likes: undefined,
      bookmarks: undefined
    }))

    return NextResponse.json(postsWithStatus)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Fehler beim Laden der Beiträge" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht angemeldet" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, categoryId, tags, roomId } = body

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Titel, Inhalt und Kategorie sind erforderlich" },
        { status: 400 }
      )
    }

    // Benutzer mit Apotheke laden
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pharmacyId: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      )
    }

    // Tags verarbeiten
    const tagConnections = []
    for (const tagName of tags || []) {
      const slug = slugify(tagName)
      let tag = await prisma.tag.findUnique({
        where: { slug }
      })

      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: tagName, slug }
        })
      }

      tagConnections.push({
        tag: { connect: { id: tag.id } }
      })
    }

    // Post erstellen
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: generateExcerpt(content),
        categoryId,
        authorId: session.user.id,
        pharmacyId: user.pharmacyId,
        breakoutRoomId: roomId || null,
        visibility: roomId ? "PRIVATE" : "PUBLIC",
        tags: {
          create: tagConnections
        }
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            position: true
          }
        },
        pharmacy: {
          select: {
            id: true,
            name: true
          }
        },
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    // Tag-Nutzungszähler aktualisieren
    await prisma.tag.updateMany({
      where: {
        id: { in: tagConnections.map(t => t.tag.connect.id) }
      },
      data: {
        usageCount: { increment: 1 }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Beitrags" },
      { status: 500 }
    )
  }
}
