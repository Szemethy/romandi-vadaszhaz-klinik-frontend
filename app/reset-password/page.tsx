"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  async function handleReset() {
    setBackendError("");

    if (password !== confirm) {
      setBackendError("A két jelszó nem egyezik!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email,
        code,
        newPassword: password,
        confirmPassword: confirm 
      };
     
      console.log("REQUEST:", payload);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setBackendError(data.message || "Hiba a jelszó módosítása során");
        throw new Error("Hiba a backendről");
      }

      toast.success("Jelszó sikeresen módosítva");
      router.push("/");
    } catch (err) {
      console.error("RESET ERROR:", err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36483D] text-[#A89D62]">
      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Új jelszó beállítása</h1>

        <input
          className="input mb-3 w-full bg-[#36483D] text-white opacity-70 outline-none"
          disabled
          value={email}
        />

        <input
          className="input mb-3 w-full bg-[#36483D] text-white outline-none"
          maxLength={6}
          placeholder="6 jegyű kód"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="relative">
  <input
    className="input mb-3 w-full bg-[#36483D] pr-10 text-white outline-none"
    placeholder="Új jelszó"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    className="absolute top-2 right-2 text-[#BF944A]"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  </button>
</div>

        <div className="relative">
  <input
    className="input mb-2 w-full bg-[#36483D] pr-10 text-white outline-none"
    placeholder="Jelszó megerősítése"
    type={showConfirm ? "text" : "password"}
    value={confirm}
    onChange={(e) => setConfirm(e.target.value)}
  />

  <button
    type="button"
    className="absolute top-2 right-2 text-[#BF944A]"
    onClick={() => setShowConfirm(!showConfirm)}
  >
    {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  </button>
</div>

        <button
          className="btn w-full bg-[#BF944A] text-[#36483D]"
          disabled={loading}
          onClick={handleReset}
        >
          {loading ? "Mentés..." : "Jelszó módosítása"}
        </button>

        {backendError && (
          <div className="mt-2 text-sm font-semibold text-red-400">{backendError}</div>
        )}
      </div>
    </div>
  );
}
