"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Schritt 1: Apothekendaten
  const [pharmacyName, setPharmacyName] = useState("")
  const [pharmacyAddress, setPharmacyAddress] = useState("")
  const [pharmacyCity, setPharmacyCity] = useState("")
  const [pharmacyZip, setPharmacyZip] = useState("")
  const [pharmacyEmail, setPharmacyEmail] = useState("")

  // Schritt 2: Benutzerdaten
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (step === 1) {
      if (!pharmacyName || !pharmacyAddress || !pharmacyCity || !pharmacyZip || !pharmacyEmail) {
        setError("Bitte alle Felder ausfüllen")
        return
      }
      setStep(2)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      return
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacy: {
            name: pharmacyName,
            address: pharmacyAddress,
            city: pharmacyCity,
            zipCode: pharmacyZip,
            email: pharmacyEmail
          },
          user: {
            firstName,
            lastName,
            email: userEmail,
            password
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registrierung fehlgeschlagen")
        return
      }

      router.push("/login?registered=true")
    } catch {
      setError("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Registrierung</CardTitle>
        <CardDescription>
          {step === 1
            ? "Schritt 1: Apothekendaten"
            : "Schritt 2: Ihre persönlichen Daten"}
        </CardDescription>

        <div className="flex justify-center gap-2 mt-4">
          <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
          <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pharmacyName">Name der Apotheke</Label>
                <Input
                  id="pharmacyName"
                  placeholder="Muster-Apotheke"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacyAddress">Adresse</Label>
                <Input
                  id="pharmacyAddress"
                  placeholder="Hauptstraße 1"
                  value={pharmacyAddress}
                  onChange={(e) => setPharmacyAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pharmacyZip">PLZ</Label>
                  <Input
                    id="pharmacyZip"
                    placeholder="12345"
                    value={pharmacyZip}
                    onChange={(e) => setPharmacyZip(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="pharmacyCity">Stadt</Label>
                  <Input
                    id="pharmacyCity"
                    placeholder="Berlin"
                    value={pharmacyCity}
                    onChange={(e) => setPharmacyCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacyEmail">E-Mail der Apotheke</Label>
                <Input
                  id="pharmacyEmail"
                  type="email"
                  placeholder="info@muster-apotheke.de"
                  value={pharmacyEmail}
                  onChange={(e) => setPharmacyEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    placeholder="Max"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    placeholder="Mustermann"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Ihre E-Mail</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="max@muster-apotheke.de"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mindestens 8 Zeichen"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Zurück
              </Button>
            )}

            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrierung...
                </>
              ) : step === 1 ? (
                <>
                  Weiter
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                "Registrieren"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Bereits registriert?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline font-medium">
              Jetzt anmelden
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
