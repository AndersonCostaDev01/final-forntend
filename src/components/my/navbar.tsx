"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { CgMenuGridO } from "react-icons/cg";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar({ isLogged }: { isLogged: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const apiUrl = "https://costaanderson.pythonanywhere.com";

  // Função para buscar foto do usuário
  const fetchUserPhoto = useCallback(() => {
    const cookieRaw = Cookies.get("user");
    const token = Cookies.get("token");

    if (cookieRaw && token) {
      try {
        const decoded = decodeURIComponent(cookieRaw);
        const parsed = JSON.parse(decoded);
        const userId = parsed.user_id;

        fetch(`${apiUrl}/users/profile/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Erro ao buscar perfil");
            }
            return res.json();
          })
          .then((data) => {
            if (data.foto) {
              setFotoUrl(`${apiUrl}${data.foto}`);
            }
          })
          .catch((err) => console.error("Erro ao buscar foto:", err));
      } catch (err) {
        console.error("Erro ao processar cookie:", err);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUserPhoto();
  }, [fetchUserPhoto]);

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1 z-10">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/tutwiter.svg"
            alt="logo"
            width={100}
            height={100}
            className="md:block hidden"
          />
          <Image
            src="/tut.svg"
            alt="logo"
            width={50}
            height={50}
            className="md:hidden block"
          />
        </Link>

        <div>
          <div className="md:block hidden">
            {isLogged ? (
              <div className="flex items-center gap-2">
                <Link href={"/post"}>Novo post</Link>
                <Link href={"/profile"}>
                  <Avatar className="ml-3">
                    <AvatarImage src={fotoUrl || "/default-avatar.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link> 
              </div>
            ) : (
              <p>Não logado</p>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden block">
            {isLogged ? (
              <div className="flex items-center gap-2">
                <Link href={"/post"}>Novo post</Link>
                <Link href={"/profile"}>
                  <Avatar className="w-8 h-8 ml-3">
                    <AvatarImage src={fotoUrl || "/default-avatar.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="menu"
              >
                <CgMenuGridO className="text-3xl text-black" />
              </button>
            )}

            {isMenuOpen && !isLogged && (
              <div className="absolute z-20 top-[15vh] left-0 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-black w-[99%] transform transition duration-300 ease-in-out flex flex-col gap-2 font-medium">
                <p>Não logado</p>
                <p>Faça seu login e aproveite a plataforma</p>
                <Link
                  className="bg-zinc-500/30 px-3 py-1.5 rounded-md w-full h-10 flex items-center justify-center border-zinc-950 border-2 hover:bg-zinc-500/50 transition duration-300 ease-in-out"
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
