"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  const isValid =
    email && code.length === 6 && password && confirm && password === confirm;

  async function handleReset() {
    if (password !== confirm) {
      toast.error("A jelszavak nem egyeznek");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code,
            newPassword: password,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Hibás vagy lejárt kód");
      }

      toast.success("Jelszó sikeresen módosítva");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hiba");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36483D] text-[#A89D62]">
      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">
          Új jelszó beállítása
        </h1>

        <input
          className="input mb-3 w-full bg-[#36483D] text-white opacity-70"
          disabled
          value={email}
        />

        <input
          className="input mb-3 w-full bg-[#36483D] text-white"
          maxLength={6}
          placeholder="6 jegyű kód"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          className="input mb-3 w-full bg-[#36483D] text-white"
          placeholder="Új jelszó"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input mb-4 w-full bg-[#36483D] text-white"
          placeholder="Jelszó megerősítése"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          className="btn w-full bg-[#BF944A] text-[#36483D]"
          disabled={!isValid || loading}
          onClick={handleReset}
        >
          {loading ? "Mentés..." : "Jelszó módosítása"}
        </button>
      </div>
    </div>
  );
}