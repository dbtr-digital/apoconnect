import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ApoConnect - Apotheken-Vernetzungsplattform",
  description: "Die Plattform für vernetzte Apotheken. Tauschen Sie sich mit Kolleginnen und Kollegen aus.",
  keywords: ["Apotheke", "Vernetzung", "Forum", "E-Rezept", "Pharmazie"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
