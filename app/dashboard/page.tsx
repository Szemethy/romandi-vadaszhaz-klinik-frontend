"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";

export default function DashboardPage() {
  const { user, logout } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix A Next.js és React között előfordul, hogy: szerver oldalon nincs localStorage, kliens oldalon meg van emiatt a user értéke nem ugyanaz SSR és CSR között -> Ez hydration hibát okozna.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Védelem: Ha nincs bejelentkezve, dobja vissza a loginra
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Sikeres kijelentkezés!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between border-b border-[#BF944A]/20 bg-[#6B4A2D] px-6 shadow-lg">
        <div className="flex gap-2">
          <button className="h-12 w-36 rounded bg-[#BF944A] font-bold text-[#36483D]">
            Személyes
          </button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D] transition-colors hover:bg-[#BF944A]">
            Orvosok
          </button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D] transition-colors hover:bg-[#BF944A]">
            Időpontok
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="leading-none font-bold text-[#BF944A]">{user.name}</span>
            <span className="text-xs opacity-70">
              {user.role === "PATIENT"
                ? "Páciens"
                : user.role === "ADMIN"
                  ? "Adminisztrátor"
                  : "Orvos"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded bg-red-700/80 px-4 py-2 font-bold text-white transition-colors hover:bg-red-700"
          >
            Kijelentkezés
          </button>
        </div>
      </header>

      {/* TARTALOM */}
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="mb-6 text-3xl font-bold text-[#BF944A]">Személyes profil</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SZERKESZTHETŐ ADATOK */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D] p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
              Módosítható adatok
            </h2>

            <div>
              <label className="mb-1 block text-sm">Telefonszám</label>
              <div className="flex gap-2">
                <input
                  className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none"
                  defaultValue={user.phone} // Beletettük a valódi telefont (+3630...)
                  placeholder="+36 30 123 4567"
                />
                <button className="btn border-none bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                  OK
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm">Lakcím</label>
              <div className="flex gap-2">
                <input
                  className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none"
                  defaultValue={user.address} // Beletettük a valódi címet (Admin tér...)
                  placeholder="Város, utca, házszám"
                />
                <button className="btn border-none bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                  OK
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm">Jelszó módosítása</label>
              <div className="flex gap-2">
                <input
                  className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none"
                  type="password"
                  placeholder="Új jelszó"
                />
                <button className="btn border-none bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                  OK
                </button>
              </div>
            </div>
          </div>

          {/* FIX ADATOK (Csak olvasható) */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D]/50 p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
              Hivatalos adatok
            </h2>

            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">Teljes név</label>
              <span className="text-lg font-medium">{user.name}</span>
            </div>

            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">Email cím</label>
              <span className="text-lg font-medium">{user.email}</span>
            </div>

            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">TAJ szám</label>
              <span className="text-lg font-medium tracking-widest">{user.tajNumber}</span>
              <p className="mt-1 text-[10px] text-yellow-600/70">
                * Módosításhoz keresse fel az adminisztrációt.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
