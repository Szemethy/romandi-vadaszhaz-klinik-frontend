"use client";

import { clsx } from "clsx";
import { log } from "console";
import dayjs from "dayjs";
import { SunMoon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";

type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  token: string;
  phone: string;
  address: string;
  tajNumber: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { setAuth } = useGlobalStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Kérlek töltsd ki mindkét mezőt!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error("Hibás email vagy jelszó");
      }

      setAuth(
        {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          address: data.address,
          tajNumber: data.tajNumber,
        },
        data.token,
      );

      toast.success(`Sikeres bejelentkezés, ${data.name}!`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ismeretlen hiba");
    } finally {
      setLoading(false);
    }
  }

  function handleRegister() {
    // itt majd később backend ellenőrzés lesz
    router.push("/registration");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#36483D] text-[#A89D62]">
      <h1 className="mb-14 text-center text-6xl font-bold text-[#BF944A]">
        Romándi vadászház klinik
      </h1>

      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Bejelentkezés</h1>

        <input
          className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#6B4A2D] text-white focus:ring-0 focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#6B4A2D] text-white focus:ring-0 focus:outline-none"
          placeholder="Jelszó"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn mb-4 w-full bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Belépés..." : "Belépés"}
        </button>

        <div className="divider my-4 mb-7 border-[#BF944A] text-2xl text-[#BF944A]">vagy</div>

        <button
          className="btn w-full bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]"
          onClick={handleRegister}
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
}
