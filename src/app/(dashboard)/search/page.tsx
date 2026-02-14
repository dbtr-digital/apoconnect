"use client"

import { useState, useEffect, useCallback } from "react"
import { PostCard } from "@/components/posts/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Clock, Loader2, X, Sparkles } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  excerpt?: string | null
  createdAt: string
  viewCount: number
  isPinned: boolean
  author: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string | null
    position?: string | null
  }
  pharmacy: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
    slug: string
    color?: string | null
  }
  tags: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
  _count: {
    likes: number
    comments: number
  }
}

interface Tag {
  id: string
  name: string
  slug: string
  usageCount: number
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Post[]>([])
  const [trendingTags, setTrendingTags] = useState<Tag[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    // Trending Tags laden
    fetch("/api/tags/trending")
      .then(res => res.json())
      .then(data => setTrendingTags(data))

    // Letzte Suchen aus LocalStorage laden
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) return

    setLoading(true)
    setSearched(true)
    saveSearch(term)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
      const data = await res.json()
      setResults(data.posts || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const handleTagClick = (tagName: string) => {
    setSearchTerm(`#${tagName}`)
    handleSearch(`#${tagName}`)
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Beiträge, Tags oder Themen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 text-base"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </form>

        {/* Before Search */}
        {!searched && (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      Letzte Suchen
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-gray-500 text-xs"
                    >
                      Löschen
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchTerm(term)
                          handleSearch(term)
                        }}
                        className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trending Tags */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Beliebte Themen
                </h3>
                <div className="space-y-3">
                  {trendingTags.map((tag, index) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-300 w-6">
                          {index + 1}
                        </span>
                        <Badge variant="outline">#{tag.name}</Badge>
                      </div>
                      <span className="text-sm text-gray-400">
                        {tag.usageCount} Beiträge
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Tagging Info */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-1">
                      Automatische Verschlagwortung
                    </h3>
                    <p className="text-sm text-emerald-700">
                      ApoConnect erkennt automatisch relevante Themen in Ihren Beiträgen
                      und schlägt passende Tags vor. So finden andere Apotheker
                      schneller die Informationen, die sie suchen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {results.length} Ergebnis{results.length !== 1 ? "se" : ""} für &quot;{searchTerm}&quot;
            </p>

            {results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Keine Ergebnisse
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Versuchen Sie andere Suchbegriffe oder schauen Sie sich
                    die beliebten Themen an.
                  </p>
                </CardContent>
              </Card>
            ) : (
              results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
