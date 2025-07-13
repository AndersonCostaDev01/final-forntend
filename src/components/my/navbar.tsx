"use client";
import Image from "next/image";
import { useState } from "react";
import { CgMenuGridO } from "react-icons/cg";

export default function Navbar({ isLogged }: { isLogged: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1">
      <div className="flex justify-between items-center">
        <div>
          <Image src="/tutwiter.svg" alt="logo" width={100} height={100} className="md:block hidden" />
          <Image src="/tut.svg" alt="logo" width={50} height={50} className="md:hidden block" />
        </div>
        <div>
          <div className="md:block hidden">
            {isLogged ? <p>Logado</p> : <p>Não logado</p>}
          </div>

          {/* mobile */}
          <div className="md:hidden block">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu">
              <CgMenuGridO className="text-3xl text-black" />
            </button>
            <div>
                {isMenuOpen && (
                isLogged ? 

                // Login
                <p className="absolute top-[15vh] left-0 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-black w-[99%] transform transition duration-300 ease-in-out">Logado</p> : 
                
                // Registerks
                <p className="absolute top-[15vh] left-0 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-black w-[99%] transform transition duration-300 ease-in-out">Não logado</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
