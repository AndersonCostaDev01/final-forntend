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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: 'url("/fundo_black.webp")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full h-[99vh] bg-zinc/10">
          <Navbar isLogged={isLoggedIn} />
          {children}
        </div>
      </body>
    </html>
  );
}
