"use client";

import { clsx } from "clsx";
import dayjs from "dayjs";
import { SunMoon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";
import { useRouter } from "next/navigation"


export default function AuthPage() {
   const router = useRouter();

   function handleLogin() {
    // itt majd később backend ellenőrzés lesz
    router.push("/dashboard");
  }

  function handleRegister() {
    // itt majd később backend ellenőrzés lesz
    router.push("/registration");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#36483D] text-[#A89D62]">
    <h1 className="text-6xl font-bold mb-14 text-[#BF944A] text-center">Romándi vadászház klinik</h1>

      <div className="w-full max-w-md rounded-xl p-6 shadow-lg bg-[#6B4A2D]">

        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Bejelentkezés</h1>

        <input className="input input-bordered w-full mb-3 bg-[#6B4A2D] border-[#BF944A] text-white placeholder-[#BF944A] focus:outline-none focus:ring-0" type="email" placeholder="Email" />
        <input className="input input-bordered w-full mb-4 bg-[#6B4A2D] border-[#BF944A] text-white placeholder-[#BF944A] focus:outline-none focus:ring-0" type="password" placeholder="Jelszó" />

        <button onClick={handleLogin} className="btn w-full mb-4 bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">Belépés</button>

        <div className="divider mb-7 border-[#BF944A] my-4 text-[#BF944A] text-2xl">vagy</div>

        {/* <h2 className="mb-4 text-center text-xl font-semibold text-[#A89D62]">Regisztráció</h2> */}

        {/* <input className="input input-bordered w-full mb-3 bg-[#6B4A2D] border-[#BF944A] text-white placeholder-[#BF944A] focus:outline-none focus:ring-0" type="email" placeholder="Email" />
        <input className="input input-bordered w-full mb-3 bg-[#6B4A2D] border-[#BF944A] text-white placeholder-[#BF944A] focus:outline-none focus:ring-0" type="password" placeholder="Jelszó" />
        <input className="input input-bordered w-full mb-4 bg-[#6B4A2D] border-[#BF944A] text-white placeholder-[#BF944A] focus:outline-none focus:ring-0" type="password" placeholder="Jelszó újra" /> */}

        <button onClick={handleRegister} className="btn w-full bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]">Regisztráció</button>
      </div>
    </div>
  );
}


