import "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
    pharmacyId: string
    pharmacyName: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      pharmacyId: string
      pharmacyName: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    pharmacyId: string
    pharmacyName: string
  }
}
