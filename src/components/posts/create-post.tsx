"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Loader2, Sparkles } from "lucide-react"
import { extractTags } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  color?: string | null
}

interface CreatePostProps {
  onClose?: () => void
  roomId?: string
}

export function CreatePost({ onClose, roomId }: CreatePostProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [manualTags, setManualTags] = useState<string[]>([])
  const [autoTags, setAutoTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  // Auto-Tagging bei Content-Änderung
  useEffect(() => {
    if (content.length > 50) {
      const tags = extractTags(content)
      setAutoTags(tags.filter(t => !manualTags.includes(t)))
    }
  }, [content, manualTags])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (!manualTags.includes(tag) && !autoTags.includes(tag)) {
        setManualTags([...manualTags, tag])
      }
      setTagInput("")
    }
  }

  const removeTag = (tag: string, isAuto: boolean) => {
    if (isAuto) {
      setAutoTags(autoTags.filter(t => t !== tag))
    } else {
      setManualTags(manualTags.filter(t => t !== tag))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Bitte alle Pflichtfelder ausfüllen")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categoryId,
          tags: [...manualTags, ...autoTags],
          roomId
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Fehler beim Erstellen")
      }

      router.refresh()
      onClose?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Erstellen")
    } finally {
      setLoading(false)
    }
  }

  const allTags = [...manualTags, ...autoTags]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neuer Beitrag</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              placeholder="Worum geht es?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie *</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoryId === cat.id
                      ? "ring-2 ring-offset-2 ring-emerald-500"
                      : ""
                  }`}
                  style={{
                    backgroundColor: cat.color ? `${cat.color}20` : "#f3f4f6",
                    color: cat.color || "#374151"
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Inhalt *</Label>
            <Textarea
              id="content"
              placeholder="Teilen Sie Ihre Erfahrungen, Fragen oder Tipps..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              Tags
              {autoTags.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-normal">
                  <Sparkles className="h-3 w-3" />
                  Auto-erkannt
                </span>
              )}
            </Label>
            <Input
              id="tags"
              placeholder="Tag eingeben und Enter drücken"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {manualTags.map((tag) => (
                  <Badge key={tag} variant="default" className="gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag, false)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {autoTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag, true)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                "Veröffentlichen"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
