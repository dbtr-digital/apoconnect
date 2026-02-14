"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit2,
  Save,
  X,
  Users,
  FileText,
  Loader2,
  CheckCircle
} from "lucide-react"

interface PharmacyData {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  phone?: string
  email: string
  website?: string
  description?: string
  verified: boolean
  users: Array<{
    id: string
    firstName: string
    lastName: string
    position?: string
    avatarUrl?: string
    role: string
  }>
  _count: {
    posts: number
    users: number
  }
}

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  position?: string
  bio?: string
  avatarUrl?: string
  role: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit form state
  const [bio, setBio] = useState("")
  const [position, setPosition] = useState("")

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setPharmacy(data.pharmacy)
        setUser(data.user)
        setBio(data.user?.bio || "")
        setPosition(data.user?.position || "")
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, position })
      })
      setUser(prev => prev ? { ...prev, bio, position } : null)
      setEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : "?"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <Badge variant={user?.role === "OWNER" ? "default" : "secondary"}>
                    {user?.role === "OWNER" ? "Inhaber" : user?.role === "MANAGER" ? "Filialleiter" : "Mitarbeiter"}
                  </Badge>
                </div>

                {editing ? (
                  <div className="space-y-3 mt-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        placeholder="z.B. Apotheker, PTA"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Über mich</Label>
                      <Textarea
                        id="bio"
                        placeholder="Erzählen Sie etwas über sich..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        <span className="ml-2">Speichern</span>
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {user?.position && (
                      <p className="text-gray-600">{user.position}</p>
                    )}
                    {user?.bio && (
                      <p className="text-gray-500 text-sm mt-2">{user.bio}</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Profil bearbeiten
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pharmacy Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                {pharmacy?.name}
              </CardTitle>
              {pharmacy?.verified && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verifiziert
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pharmacy?.description && (
              <p className="text-gray-600">{pharmacy.description}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{pharmacy?.address}, {pharmacy?.zipCode} {pharmacy?.city}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{pharmacy?.email}</span>
              </div>
              {pharmacy?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{pharmacy.phone}</span>
                </div>
              )}
              {pharmacy?.website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4 shrink-0" />
                  <a href={pharmacy.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                    {pharmacy.website}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pharmacy?._count.posts}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Beiträge
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pharmacy?._count.users}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Mitarbeiter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        {pharmacy && pharmacy.users.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pharmacy.users
                  .filter(u => u.id !== user?.id)
                  .map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback>
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.position || (member.role === "OWNER" ? "Inhaber" : "Mitarbeiter")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
