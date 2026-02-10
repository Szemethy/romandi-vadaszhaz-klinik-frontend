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

export default function AuthPage() {
  const router = useRouter();
  const { setLoggedUser, setId } = useGlobalStore();

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

      console.log("Státusz kód:", res.status);
      const data = await res.json();

      if (!res.ok) {
        console.error("Szerver oldali hiba:", data);
        throw new Error(data.message || "Hiba történt a bejelentkezés során");
      }

      // --- MENTÉS A STORE-BA ---
      console.log("Sikeres bejelentkezés, adatok:", data);

      // Feltételezve, hogy a backend a 'data' objektumban küldi a user nevét/emailjét és az id-t
      // Példa: { user: { email: "teszt@gmail.com", id: "123" }, token: "..." }
      // Ezt igazítsd a pontos backend válaszodhoz!
      if (data) {
        setLoggedUser(data.email || data.name);
        setId(data.id || data._id);
      } else {
        // Ha a data maga a user objektum
        setLoggedUser(data.email);
        setId(data.id || data._id);
      }

      // Opcionális: Token mentése, ha használsz JWT-t
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Sikeres bejelentkezés!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Elkapott hiba (catch):", err.message);
        toast.error(err.message);
      } else {
        console.error("Ismeretlen hiba történt:", err);
      }
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
          className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#6B4A2D] text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#6B4A2D] text-white"
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
