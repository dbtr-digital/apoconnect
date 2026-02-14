import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { usageCount: "desc" },
      take: 10
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching trending tags:", error)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}
