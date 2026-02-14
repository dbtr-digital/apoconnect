"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react"
import { timeAgo } from "@/lib/utils"
import { useState } from "react"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    excerpt?: string | null
    createdAt: Date | string
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
    isLiked?: boolean
    isBookmarked?: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false)

  const initials = `${post.author.firstName[0]}${post.author.lastName[0]}`

  const handleLike = async () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)

    await fetch(`/api/posts/${post.id}/like`, {
      method: newLiked ? "POST" : "DELETE"
    })
  }

  const handleBookmark = async () => {
    const newBookmarked = !bookmarked
    setBookmarked(newBookmarked)

    await fetch(`/api/posts/${post.id}/bookmark`, {
      method: newBookmarked ? "POST" : "DELETE"
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatarUrl || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">
                {post.author.firstName} {post.author.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {post.pharmacy.name} {post.author.position && `· ${post.author.position}`}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {timeAgo(post.createdAt)}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <Link href={`/posts/${post.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-emerald-600">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {post.excerpt || post.content}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            style={{
              backgroundColor: post.category.color ? `${post.category.color}20` : undefined,
              color: post.category.color || undefined
            }}
          >
            {post.category.name}
          </Badge>
          {post.tags.slice(0, 3).map(({ tag }) => (
            <Badge key={tag.id} variant="outline">
              #{tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={liked ? "text-red-500" : "text-gray-500"}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span className="ml-1">{likeCount}</span>
            </Button>

            <Link href={`/posts/${post.id}#comments`}>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1">{post._count.comments}</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={bookmarked ? "text-emerald-600" : "text-gray-500"}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
            </Button>

            <Button variant="ghost" size="sm" className="text-gray-500">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
