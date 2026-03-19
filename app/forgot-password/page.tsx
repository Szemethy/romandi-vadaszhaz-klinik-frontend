"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    console.log("CLICKED");

    if (!email.trim()) {
      console.log("NO EMAIL");
      toast.error("Add meg az email címet");
      return;
    }

    try {
      setLoading(true);
      console.log("SENDING REQUEST...", email);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      console.log("RESPONSE ARRIVED:", res);

      const data = await res.json();
      console.log("RESPONSE DATA:", data);

      if (!res.ok) {
        console.log("NOT OK:", res.status);
        throw new Error(data.message || "Email nem található");
      }

      console.log("SUCCESS");
      toast.success("Kód elküldve!");

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log("ERROR:", err);
      toast.error(err instanceof Error ? err.message : "Hiba történt");
    } finally {
      console.log("FINALLY");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#36483D] text-[#A89D62]">
      <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Jelszó visszaállítás</h1>

        <input
          className="input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn w-full bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]"
          disabled={loading}
          onClick={handleSendCode}
        >
          {loading ? "Küldés..." : "Kód küldése"}
        </button>
      </div>
    </div>
  );
}
