import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { v4 as uuid } from "uuid"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Benutzer suchen
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Immer Erfolg zurückgeben (Sicherheit)
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Reset-Token generieren
    const resetToken = uuid()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 Stunde

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // In Produktion: E-Mail senden
    // Für Demo: Token in Response ausgeben
    const resetLink = `${process.env.AUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    console.log(`
      ========================================
      PASSWORT-RESET für ${email}
      Token: ${resetToken}
      Link: ${resetLink}
      ========================================
    `)

    // DEV MODE: Return token info for testing (remove in production!)
    return NextResponse.json({
      success: true,
      devMode: true,
      message: "E-Mail würde gesendet werden an: " + email,
      resetLink: resetLink
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}
