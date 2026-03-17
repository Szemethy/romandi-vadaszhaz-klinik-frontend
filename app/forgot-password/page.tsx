"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email.trim()) {
      toast.error("Add meg az email címet");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        throw new Error("Email nem található");
      }

      toast.success("Kód elküldve!");

      // email átadása
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hiba történt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36483D] text-[#A89D62]">
      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">
          Jelszó visszaállítás
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn w-full bg-[#BF944A] text-[#36483D]"
          onClick={handleSendCode}
          disabled={loading}
        >
          {loading ? "Küldés..." : "Kód küldése"}
        </button>
      </div>
    </div>
  );
}