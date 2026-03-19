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
  const [backendError, setBackendError] = useState(""); // backend hiba üzenet

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  async function handleReset() {
    setBackendError(""); // reset

    try {
      setLoading(true);

      const payload = { email, code, newPassword: password };
      console.log("📤 REQUEST:", payload);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("📥 STATUS:", res.status);

      const data = await res.json();
      console.log("📥 RESPONSE:", data);

      if (!res.ok) {
        if (data.errors?.password) {
          setBackendError(data.errors.password);
        } else if (data.message) {
          setBackendError(data.message);
        } else {
          setBackendError("Ismeretlen hiba történt");
        }
        throw new Error("Hiba a backendről");
      }

      toast.success("Jelszó sikeresen módosítva");
      router.push("/");
    } catch (err) {
      console.error("🔥 RESET ERROR:", err);
      // a backendError már megjelenik a UI-ban, ide nem kell toast
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

        <input
          className="input mb-3 w-full bg-[#36483D] text-white outline-none"
          placeholder="Új jelszó"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input mb-2 w-full bg-[#36483D] text-white outline-none"
          placeholder="Jelszó megerősítése"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* Gomb mindig kattintható, csak a loading blokkol */}
        <button
          className="btn w-full bg-[#BF944A] text-[#36483D]"
          disabled={loading}
          onClick={handleReset}
        >
          {loading ? "Mentés..." : "Jelszó módosítása"}
        </button>

        {/* Backend hibák kiírása a gomb alatt */}
        {backendError && (
          <div className="mt-2 text-sm text-red-400 font-semibold">
            {backendError}
          </div>
        )}
      </div>
    </div>
  );
}