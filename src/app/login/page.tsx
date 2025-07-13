"use client"; // necessário para React client component no Next.js app dir

import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://costaanderson.pythonanywhere.com/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Erro ao logar");
        return;
      }

      const data = await res.json();

      // Salvar token no cookie (expira em 7 dias)
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        email: data.email,
      }), { expires: 7 });

      // Opcional: salvar usuário também (se quiser)
      Cookies.set("user", JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        email: data.email,
      }), { expires: 7 });

      // Redirecionar ou atualizar estado de login aqui
      // Exemplo:
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div 
      className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input 
          type="email" 
          placeholder="Email" 
          className="border border-gray-300 rounded-md p-2 text-black" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="border border-gray-300 rounded-md p-2 text-black" 
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 rounded-md p-2 mt-2">Entrar</button>
        <Link href="/register" className="text-blue-500 mt-2">Não tem uma conta? Cadastre-se</Link>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}


// https://costaanderson.pythonanywhere.com/