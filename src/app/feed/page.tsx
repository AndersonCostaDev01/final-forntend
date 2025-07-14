'use client'

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";

interface Comentario {
  id: number;
  autor: number;
  autor_username: string;
  conteudo: string;
  data_comentario: string;
}

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  autor: number;
  autor_username: string;
  categoria: number;
  categoria_nome: string;
  likes: number[];
  total_likes: number;
  comentarios: Comentario[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>('https://costaanderson.pythonanywhere.com/posts/posts/');
  const [loading, setLoading] = useState(false);
  const [comentarios, setComentarios] = useState<{ [postId: number]: string }>({});
  const token = Cookies.get("token");
  const userRaw = Cookies.get("user");

  const fetchPosts = useCallback(async () => {
    if (!nextUrl || loading) return;

    setLoading(true);

    try {
      const res = await fetch(nextUrl, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar posts");
      }

      const data = await res.json();
      setPosts(prev => [...prev, ...data.results]);
      setNextUrl(data.next);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleComentarioChange = (postId: number, value: string) => {
    setComentarios(prev => ({ ...prev, [postId]: value }));
  };

  const handleEnviarComentario = async (postId: number) => {
    if (!comentarios[postId]) return;

    try {
      if (!userRaw) throw new Error("Usuário não autenticado");

      const decoded = decodeURIComponent(userRaw);
      const parsed = JSON.parse(decoded);
      const userId = parsed.user_id;

      const res = await fetch("https://costaanderson.pythonanywhere.com/posts/comentarios/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          autor: userId,
          conteudo: comentarios[postId],
          post: postId
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar comentário");
      }

      const novoComentario: Comentario = await res.json();

      // Atualiza localmente os comentários do post
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comentarios: [...post.comentarios, novoComentario] }
            : post
        )
      );

      // Limpa campo de comentário
      setComentarios(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1">
      <h2 className="text-2xl font-bold mb-4">Feed</h2>

      <div className="flex flex-col gap-4 mt-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-zinc-900/40 border border-white/20 rounded-md p-4">
            <h3 className="text-xl font-semibold">{post.titulo}</h3>
            <p className="text-sm text-gray-300 mb-1">
              Por <strong>{post.autor_username}</strong> em <em>{new Date(post.data_publicacao).toLocaleString()}</em>
            </p>
            <p className="mb-2">{post.conteudo}</p>
            <p className="text-sm text-blue-300 mb-2">
              Categoria: <strong>{post.categoria_nome}</strong> | Likes: {post.total_likes}
            </p>

            {/* Comentários */}
            <div className="mt-3 bg-white/10 p-2 rounded">
              <h4 className="text-sm font-semibold mb-2">Comentários:</h4>

              {/* Campo para criar novo comentário */}
              <div className="mb-3">
                <textarea
                  rows={2}
                  placeholder="Escreva um comentário..."
                  value={comentarios[post.id] || ''}
                  onChange={e => handleComentarioChange(post.id, e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 resize-none focus:outline-none"
                />
                <button
                  onClick={() => handleEnviarComentario(post.id)}
                  className="mt-2 bg-green-600 hover:bg-green-700 transition px-3 py-1 rounded text-sm"
                >
                  Comentar
                </button>
              </div>

              {/* Comentários existentes */}
              {post.comentarios.length > 0 ? (
                post.comentarios.map((comentario) => (
                  <div key={comentario.id} className="text-sm text-gray-200 mt-1">
                    <strong>{comentario.autor_username}:</strong> {comentario.conteudo}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Nenhum comentário ainda.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {nextUrl ? (
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      ) : (
        <p className="mt-6 text-center text-gray-300">Fim do feed 😴</p>
      )}
    </div>
  );
}
