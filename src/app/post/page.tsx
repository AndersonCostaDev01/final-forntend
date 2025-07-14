'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'

interface Categoria {
  id: number
  nome: string
}

export default function Post() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [mensagem, setMensagem] = useState<string | null>(null)

  const token = Cookies.get('token')
  const cookieraw = Cookies.get('user')

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch('https://costaanderson.pythonanywhere.com/posts/categorias/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Erro ao buscar categorias')
        }

        const data = await res.json()
        setCategorias(data.results)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }

    fetchCategorias()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !content || !categoriaSelecionada) {
      setMensagem('Preencha todos os campos.')
      return
    }

    try {
      if (!cookieraw) {
        throw new Error('Usuário não autenticado.')
      }

      const decoded = decodeURIComponent(cookieraw)
      const parsed = JSON.parse(decoded)
      const userId = parsed.user_id

      const res = await fetch('https://costaanderson.pythonanywhere.com/posts/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          titulo: title,
          conteudo: content,
          categoria: categoriaSelecionada,
          autor: userId,
        }),
      })

      if (!res.ok) {
        throw new Error('Erro ao enviar post')
      }

      setMensagem('Postagem enviada com sucesso!')
      setTitle('')
      setContent('')
      setCategoriaSelecionada(null)
    } catch (error) {
      console.error(error)
      setMensagem('Erro ao enviar postagem.')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 text-white'>
      <form
        onSubmit={handleSubmit}
        className='bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-6 w-full max-w-md space-y-4'
      >
        <h1 className='text-2xl font-bold text-center mb-4'>Nova Postagem</h1>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="title" className='text-sm'>Título</label>
          <input
            id="title"
            className='p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="content" className='text-sm'>Conteúdo</label>
          <textarea
            id="content"
            rows={4}
            className='p-2 rounded bg-white/20 border border-white/30 text-white focus:outline-none resize-none'
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="categoria" className='text-sm'>Categoria</label>
          <select
            id="categoria"
            className='p-2 rounded bg-white/20 border border-white/30 text-zinc-400 focus:outline-none'
            value={categoriaSelecionada || ''}
            onChange={e => setCategoriaSelecionada(Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {mensagem && (
          <p className='text-center text-sm mt-2 text-yellow-300'>{mensagem}</p>
        )}

        <button
          type="submit"
          className='w-full bg-indigo-600 hover:bg-indigo-700 transition rounded p-2 mt-4 font-medium'
        >
          Enviar Postagem
        </button>
        <Link href="/feed" className='text-center text-sm mt-2 text-yellow-300'>Voltar</Link>
      </form>
    </div>
  )
}
