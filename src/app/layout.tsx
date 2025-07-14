import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/my/navbar";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuTwitter",
  description: "Sua plataforma de postagens mais dividosas do Brasil",
  icons: {
    icon: "/tut.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Função assíncrona OK no Server Component
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isLoggedIn = token !== undefined;

  console.log("isLoggedIn:", isLoggedIn);

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`} // relative para posicionar o vídeo
        style={{ minHeight: "99vh" }}
      >
        {/* Vídeo de fundo */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed top-0 left-0 w-full h-[99%] object-cover -z-10"
        >
          <source src="/fundo01.mp4" type="video/mp4" className="w-full h-full" />
          Seu navegador não suporta vídeo.
        </video>

        <div className="w-full min-h-screen bg-black/40 relative">
          <Navbar isLogged={isLoggedIn}/>
          <div className="container mx-auto p-4 overflow-auto text-white">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
