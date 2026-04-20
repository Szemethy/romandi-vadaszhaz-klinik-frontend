"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  birthDate?: string;
  gender?: "MALE" | "FEMALE";
  specialization?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { setAuth } = useGlobalStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enterPressed, setEnterPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setEnterPressed(true);
      }
    };

    const handleInput = () => {
      if (enterPressed) setEnterPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("input", handleInput);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("input", handleInput);
    };
  }, [enterPressed]);

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      setError("Kérlek add meg az email címet és a jelszót!");
      return;
    }

    if (!trimmedEmail) {
      setError("Az email mező nem lehet üres!");
      return;
    }

    if (!trimmedPassword) {
      setError("A jelszó mező nem lehet üres!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
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
          birthDate: data.birthDate,
          gender: data.gender,
          specialization: data.specialization,
        },
        data.token,
      );

      toast.success(`Sikeres bejelentkezés, ${data.name}!`);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba");
    } finally {
      setLoading(false);
      setEnterPressed(false);
    }
  }

  function handleRegister() {
    router.push("/registration");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#36483D] text-[#A89D62]">
      <h1 className="mb-14 text-center text-6xl font-bold text-[#BF944A]">
        Romándi Vadászház Klinik
      </h1>

      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Bejelentkezés</h1>

        <input
          className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
        />

        <div className="relative">
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] pr-10 text-white shadow-lg focus:ring-0 focus:outline-none"
            placeholder="Jelszó"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
          />

          <button
            className="absolute top-2 right-2 cursor-pointer text-[#BF944A]"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <button
          className={`btn mb-4 w-full shadow-lg hover:bg-[#A89D62] ${
            enterPressed ? "animate-pulse bg-yellow-400 text-black" : "bg-[#BF944A] text-[#36483D]"
          }`}
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Belépés..." : enterPressed ? "KATTINTS IDE" : "Belépés"}
        </button>

        <div className="divider my-4 mb-7 border-[#BF944A] text-2xl text-[#BF944A]">vagy</div>

        <button
          className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
          onClick={handleRegister}
        >
          Regisztráció
        </button>

        <button
          className="mx-auto mt-3 block cursor-pointer text-sm text-[#BF944A] underline"
          onClick={() => router.push("/forgot-password")}
        >
          Elfelejtetted a jelszavad?
        </button>

        {error && (
          <div className="mt-4 mb-4 rounded-md border border-red-400 bg-red-100 p-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
