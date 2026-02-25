'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

interface Post {
  id: number
  titulo: string
  conteudo: string
  autor_username: string
  liked_by_me: boolean
  total_likes: number
}

interface PostProps {
  post: Post
}

export default function PostCard({ post }: PostProps) {
  const token = Cookies.get('token')

  const [liked, setLiked] = useState(post.liked_by_me)
  const [likesCount, setLikesCount] = useState(post.total_likes)
  const [loading, setLoading] = useState(false)

  async function handleLike() {
    if (!token || loading) return

    try {
      setLoading(true)

      const res = await fetch(
        `https://eeriicthdev.pythonanywhere.com/posts/posts/${post.id}/like/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Erro ao curtir')
      }

      // optimistic UI (experiência top)
      setLiked(!liked)
      setLikesCount(prev =>
        liked ? prev - 1 : prev + 1
      )

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
      <h2 className="text-lg font-bold">{post.titulo}</h2>
      <p className="text-sm text-zinc-300">{post.conteudo}</p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-zinc-400">
          @{post.autor_username}
        </span>

        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 text-sm transition
            ${liked ? 'text-pink-500' : 'text-zinc-400'}
          `}
        >
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
      </div>
    </div>
  )
}