import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1 z-10">
      <h1>Bem-vindo ao TuTwitter</h1>
      <p>A pior plataforma de postagens do Brasil 🤡🤡🤡</p>
      <p>Sinta se livre para comentar qualquer besteira que quiser</p>
      <p>So cuidado para quebrar nenhuma lei ou xandão vem te buscar</p>
      <Link href="/login" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Entrar
      </Link>
    </div>
  );
}
