"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/globalStore";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useGlobalStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Sikeres kijelentkezés!");
    router.push("/");
  };

  if (!user) return null;


  return (
    <header className="border-b border-[#BF944A]/20 bg-[#6B4A2D] px-4 shadow-lg md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO / NAVIGATION */}
          <div className="flex items-center gap-2">
            {/* Asztali nézet gombjai */}
            <div className="hidden gap-2 md:flex">
              <button onClick={() => router.push("/dashboard")} className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Személyes
              </button>
              <button onClick={() => router.push("/doctors")} className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Orvosok
              </button>
              <button onClick={() => router.push("/appointments")} className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Időpontok
              </button>
              <button onClick={() => router.push("/infos")} className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Orvosi jelentések
              </button>
            </div>

            {/* Hamburger gomb mobilon */}
            <div className="md:hidden">
              <button
                className="rounded-md bg-[#BF944A] p-2 text-[#36483D]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Jobb oldali user info és kijelentkezés */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="leading-none font-bold text-[#BF944A]">{user.name}</span>
              <span className="text-xs opacity-70">{user.role}</span>
            </div>
            <button
              className="rounded bg-red-700/80 px-4 py-2 font-bold text-white hover:bg-red-700"
              onClick={handleLogout}
            >
              Kijelentkezés
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="mt-2 flex flex-col gap-2 px-2 pb-2 md:hidden">
            <button className="w-full cursor-pointer rounded bg-[#BF944A] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#A2A369]">
              Személyes
            </button>
            <button
  onClick={() => {
    router.push("/doctors");
    setIsMenuOpen(false);
  }}
  className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
  Orvosok
</button>
            <button
  onClick={() => {
    router.push("/appointments");
    setIsMenuOpen(false);
  }}
  className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
  Időpontok
</button>

            <button
  onClick={() => {
    router.push("/infos");
    setIsMenuOpen(false);
  }}
  className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
  Orvosi jelentések
</button>
          </div>
        )}
      </header>
  )

}