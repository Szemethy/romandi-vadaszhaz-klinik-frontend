"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";
import dayjs from "dayjs";
import Header from "@/app/header/page";


export default function DashboardPage() {
  const { user, token, logout, setAuth } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);


  // --- ÚJ ÁLLAPOTOK A SZERKESZTÉSHEZ ---
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // Jelszó opcionális
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
  setIsMounted(true);
  if (user) {
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setBirthDate(user.birthDate ? dayjs(user.birthDate).format("YYYY-MM-DD") : ""); // formázás
  }
}, [user]);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user) return null;

  // --- FUNKCIÓK ---

  const handleCancel = () => {
    // Visszaállítjuk az eredeti adatokat a store-ból
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setPassword("");
    setBirthDate(user.birthDate ? dayjs(user.birthDate).format("YYYY-MM-DD") : "");
    setBirthDateError(null);
    setIsEditing(false);
    toast.error("Módosítások elvetve.");
  };

  const handleSave = async () => {
  console.log("=== SAVE START ===");

  try {
    setBirthDateError(null); // előző hiba törlése

    const bodyData: any = {
      phone,
      address,
      birthDate,
    };

    if (password.trim() !== "") {
      bodyData.password = password;
    }

    const res = await fetch(
      "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Mentési hiba");
    }

    // ✅ Itt már a data maga az updated user
    setAuth(data, token!);
    setIsEditing(false);
    setPassword("");

    toast.success("Adatok sikeresen mentve!");
  } catch (err: unknown) {
    console.error("SAVE ERROR:", err);

    const message =
      err instanceof Error ? err.message : "Ismeretlen hiba";

    // 🎯 birthDate backend validáció
    if (message.includes("születési dátum")) {
      setBirthDateError(message);
    } else {
      toast.error(message);
    }
  }

  console.log("=== SAVE END ===");
};

  const handleLogout = () => {
    logout();
    toast.success("Sikeres kijelentkezés!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      {/* HEADER - maradt a régi */}
      <main><Header /></main>

      <main className="mx-auto max-w-4xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#BF944A]">Személyes profil</h1>

          {/* GOMB LOGIKA */}
          {!isEditing ? (
            <button
              className="btn border-none bg-[#BF944A] px-8 text-[#36483D]"
              onClick={() => setIsEditing(true)}
            >
              Módosítás
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-outline btn-error" onClick={handleCancel}>
                Mégse
              </button>
              <button className="btn border-none bg-[#A2A369] text-[#36483D]" onClick={handleSave}>
                Mentés
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SZERKESZTHETŐ ADATOK */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D] p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
              Módosítható adatok
            </h2>

            <div>
              <label className="mb-1 block text-sm">Telefonszám</label>
              <input
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
  <label className="mb-1 block text-sm">Születési dátum</label>
  <input
    type="date"
    disabled={!isEditing}
    value={birthDate}
    onChange={(e) => {
      setBirthDate(e.target.value);

      // ha javítja → tűnjön el a hiba
      if (birthDateError) setBirthDateError(null);
    }}
    className={`input-bordered input w-full bg-[#36483D] text-white shadow-lg focus:outline-none
      ${!isEditing && "cursor-not-allowed opacity-50"}
      ${birthDateError ? "border-red-500" : "border-[#BF944A]"}`}
  />

  {birthDateError && (
    <div className="mt-2 text-sm text-red-400">
      {birthDateError}
    </div>
  )}
</div>

            {user.role === "PATIENT" && (
  <div>
    <label className="mb-1 block text-sm">Lakcím</label>
    <input
      className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${
        !isEditing && "cursor-not-allowed opacity-50"
      }`}
      disabled={!isEditing}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </div>
)}

            <div>
              <label className="mb-1 block text-sm">Új jelszó (opcionális)</label>
              <input
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                disabled={!isEditing}
                placeholder="Csak ha módosítani akarod"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* FIX ADATOK */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D]/50 p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
              Hivatalos adatok
            </h2>
            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">Teljes név</label>
              <span className="text-lg font-medium">{user.name}</span>
            </div>
            <div className="rounded-lg bg-[#36483D]/50 p-3">
  <label className="block text-xs uppercase opacity-60">
    {user.role === "DOCTOR" ? "Specializáció" : "TAJ szám"}
  </label>

  <span className="text-lg font-medium tracking-widest">
    {user.role === "DOCTOR"
      ? user.specialization || "N/A"
      : user.tajNumber || "N/A"}
  </span>
</div>
          </div>
        </div>
      </main>
    </div>
  );
}
