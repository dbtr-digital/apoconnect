import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pharmacy, user } = body

    // Prüfe ob Apotheken-E-Mail bereits existiert
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { email: pharmacy.email }
    })

    if (existingPharmacy) {
      return NextResponse.json(
        { error: "Diese Apotheke ist bereits registriert" },
        { status: 400 }
      )
    }

    // Prüfe ob Benutzer-E-Mail bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse wird bereits verwendet" },
        { status: 400 }
      )
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(user.password, 12)

    // Apotheke und Benutzer erstellen
    const newPharmacy = await prisma.pharmacy.create({
      data: {
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        zipCode: pharmacy.zipCode,
        email: pharmacy.email,
        users: {
          create: {
            email: user.email,
            passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
            role: "OWNER",
            emailVerified: true // Für Demo-Zwecke
          }
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Registrierung erfolgreich",
      pharmacyId: newPharmacy.id
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Registrierung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
