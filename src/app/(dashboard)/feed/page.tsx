"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/posts/post-card"
import { CreatePost } from "@/components/posts/create-post"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenSquare, TrendingUp, Filter, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface Category {
  id: string
  name: string
  slug: string
  color?: string | null
}

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
  category: Category
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
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function FeedPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then(res => res.json()),
      fetch("/api/categories").then(res => res.json())
    ]).then(([postsData, categoriesData]) => {
      setPosts(postsData)
      setCategories(categoriesData)
      setLoading(false)
    })
  }, [])

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category.id === selectedCategory)
    : posts

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Prompt */}
          {!showCreatePost && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    Was möchten Sie teilen?
                  </button>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <PenSquare className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Beitrag</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Post Form */}
          {showCreatePost && (
            <CreatePost onClose={() => setShowCreatePost(false)} />
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-1" />
              Alle
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="shrink-0"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">
                    Noch keine Beiträge vorhanden.
                    <br />
                    Seien Sie der Erste!
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          {/* Trending Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Beliebte Themen
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">#e-rezept</Badge>
                  <span className="text-xs text-gray-400">128 Beiträge</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">#lieferengpass</Badge>
                  <span className="text-xs text-gray-400">96 Beiträge</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">#retax</Badge>
                  <span className="text-xs text-gray-400">74 Beiträge</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">#digitalisierung</Badge>
                  <span className="text-xs text-gray-400">61 Beiträge</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">#personal</Badge>
                  <span className="text-xs text-gray-400">45 Beiträge</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Netzwerk-Statistiken
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Apotheken</span>
                  <span className="font-medium">1.247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mitglieder</span>
                  <span className="font-medium">3.891</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Beiträge heute</span>
                  <span className="font-medium">42</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
