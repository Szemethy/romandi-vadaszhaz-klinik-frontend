"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useGlobalStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Sikeres kijelentkezés!");
    router.push("/");
  };

  if (!user) return null;

  // 🔥 Role magyarítás
  const roleMap: Record<string, string> = {
    ADMIN: "Admin",
    DOCTOR: "Orvos",
    PATIENT: "Páciens",
  };
  const displayRole = roleMap[user.role] || user.role;

  const desktopBtn = (path: string, label: string) => (
    <button
      className={`h-12 min-w-[80px] cursor-pointer rounded px-4 font-bold text-[#36483D] transition-colors ${
        pathname === path ? "bg-[#BF944A]" : "bg-[#A2A369] hover:bg-[#BF944A]"
      }`}
      onClick={() => router.push(path)}
    >
      {label}
    </button>
  );

  const mobileBtn = (path: string, label: string) => (
    <button
      className={`w-full cursor-pointer rounded py-2 font-bold text-[#36483D] transition-colors ${
        pathname === path ? "bg-[#BF944A]" : "bg-[#A2A369] hover:bg-[#BF944A]"
      }`}
      onClick={() => {
        router.push(path);
        setIsMenuOpen(false);
      }}
    >
      {label}
    </button>
  );

  return (
    <header className="border-b border-[#BF944A]/20 bg-[#6B4A2D] px-4 shadow-lg md:px-6">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Desktop gombok: csak nagyobb mérettől */}
          <div className="hidden flex-wrap gap-2 lg:flex">
            {desktopBtn("/dashboard", "Személyes")}
            {user.role !== "DOCTOR" && desktopBtn("/doctors", "Orvosok")}
            {desktopBtn("/appointments", "Időpontok")}
            {desktopBtn("/infos", "Orvosi jelentések")}
            {user.role === "DOCTOR" && desktopBtn("/timetable", "Rendelési idő")}
            {user.role === "DOCTOR" && desktopBtn("/myservices", "Szolgáltatásaim")}
          </div>

          {/* Hamburger menü: tablet és mobil */}
          <div className="lg:hidden">
            <button
              className="cursor-pointer rounded-md bg-[#BF944A] p-2 text-[#36483D]"
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

        {/* Felhasználó adatai és kijelentkezés */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="leading-none font-bold text-[#BF944A]">{user.name}</span>
            <span className="text-xs opacity-70">{displayRole}</span>
          </div>
          <button
            className="cursor-pointer rounded bg-red-700/80 px-4 py-2 font-bold text-white hover:bg-red-700"
            onClick={handleLogout}
          >
            Kijelentkezés
          </button>
        </div>
      </div>

      {/* Hamburger menü tartalom */}
      {isMenuOpen && (
        <div className="mt-2 flex flex-col gap-2 px-2 pb-2 lg:hidden">
          {mobileBtn("/dashboard", "Személyes")}
          {user.role !== "DOCTOR" && mobileBtn("/doctors", "Orvosok")}
          {mobileBtn("/appointments", "Időpontok")}
          {mobileBtn("/infos", "Orvosi jelentések")}
          {user.role === "DOCTOR" && mobileBtn("/timetable", "Rendelési idő")}
          {user.role === "DOCTOR" && mobileBtn("/myservices", "Szolgáltatásaim")}
          <button
            className="w-full cursor-pointer rounded bg-red-700/80 py-2 font-bold text-white hover:bg-red-700"
            onClick={handleLogout}
          >
            Kijelentkezés
          </button>
        </div>
      )}
    </header>
  );
}
