"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://costaanderson.pythonanywhere.com/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password: senha,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.detail || data.message || "Erro ao registrar.";
        setError(msg);
        setLoading(false);
        return;
      }

      // Salva o token e usuário no cookie
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          username: data.username,
          email: data.email,
        }),
        { expires: 7 }
      );

      // Redireciona
      window.location.href = "/feed";
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1">
      <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Usuário"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nome"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sobrenome"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          className="border border-gray-300 rounded-md p-2 text-black"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 rounded-md p-2 mt-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        <Link href="/login" className="text-blue-500 mt-2">
          Já tem uma conta? Faça login
        </Link>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
