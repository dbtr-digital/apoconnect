"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Plus,
  Lock,
  Globe,
  MessageSquare,
  Loader2,
  X
} from "lucide-react"

interface Room {
  id: string
  name: string
  description?: string | null
  isPrivate: boolean
  maxMembers?: number | null
  createdAt: string
  owner: {
    id: string
    name: string
  }
  _count: {
    members: number
    messages: number
    posts: number
  }
  members: Array<{
    user: {
      id: string
      firstName: string
      lastName: string
      avatarUrl?: string | null
    }
  }>
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)

  // Create form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [maxMembers, setMaxMembers] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms")
      const data = await res.json()
      setRooms(data)
    } catch (err) {
      console.error("Error fetching rooms:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Bitte einen Namen eingeben")
      return
    }

    setCreating(true)

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          isPrivate,
          maxMembers: maxMembers ? parseInt(maxMembers) : null
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Fehler beim Erstellen")
      }

      setShowCreate(false)
      setName("")
      setDescription("")
      setIsPrivate(true)
      setMaxMembers("")
      fetchRooms()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Erstellen")
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gruppen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Private Austauschgruppen mit anderen Apotheken
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Neue Gruppe</span>
        </Button>
      </div>

      {/* Create Room Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Neue Gruppe erstellen</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreate(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Gruppenname *</Label>
                  <Input
                    id="name"
                    placeholder="z.B. Apotheken Berlin-Mitte"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    placeholder="Worum geht es in dieser Gruppe?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sichtbarkeit</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(true)}
                      className="flex-1"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Privat
                    </Button>
                    <Button
                      type="button"
                      variant={!isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(false)}
                      className="flex-1"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Offen
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isPrivate
                      ? "Nur eingeladene Apotheken können beitreten"
                      : "Alle verifizierten Apotheken können beitreten"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max. Mitglieder (optional)</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    min="2"
                    max="100"
                    placeholder="Unbegrenzt"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={creating} className="flex-1">
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Erstelle...
                      </>
                    ) : (
                      "Erstellen"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Noch keine Gruppen
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Erstellen Sie die erste Gruppe oder treten Sie einer bei.
            </p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Erste Gruppe erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {room.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {room.owner.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant={room.isPrivate ? "secondary" : "outline"}>
                      {room.isPrivate ? (
                        <Lock className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {room.isPrivate ? "Privat" : "Offen"}
                    </Badge>
                  </div>

                  {room.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {room.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {room.members.slice(0, 4).map(({ user }) => (
                        <Avatar key={user.id} className="h-7 w-7 border-2 border-white">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {room._count.members > 4 && (
                        <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          +{room._count.members - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {room._count.posts}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
