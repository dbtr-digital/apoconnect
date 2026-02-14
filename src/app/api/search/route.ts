import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim()

    if (!query) {
      return NextResponse.json({ posts: [] })
    }

    // Tag-Suche (#tag)
    const isTagSearch = query.startsWith("#")
    const searchTerm = isTagSearch ? query.slice(1) : query

    const posts = await prisma.post.findMany({
      where: {
        visibility: "PUBLIC",
        OR: isTagSearch
          ? [
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: searchTerm }
                    }
                  }
                }
              }
            ]
          : [
              { title: { contains: searchTerm } },
              { content: { contains: searchTerm } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: searchTerm }
                    }
                  }
                }
              },
              {
                category: {
                  name: { contains: searchTerm }
                }
              }
            ]
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
        }
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      take: 50
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Suchfehler" }, { status: 500 })
  }
}
