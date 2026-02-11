"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";

export default function DashboardPage() {
  const { user, token, logout, setAuth } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // --- ÚJ ÁLLAPOTOK A SZERKESZTÉSHEZ ---
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // Jelszó opcionális

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
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
    setIsEditing(false);
    toast.error("Módosítások elvetve.");
  };

  const handleSave = async () => {
  console.log("=== SAVE START ===");

  try {
    console.log("USER:", user);
    console.log("TOKEN:", token);
    console.log("PHONE:", phone);
    console.log("ADDRESS:", address);
    console.log("PASSWORD:", password);

    const bodyData: any = {
      phone,
      address,
      password,
    };

    if (password.trim() !== "") {
      bodyData.password = password;
    }

    console.log("BODY SENT:", bodyData);

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

    console.log("STATUS:", res.status);

    const responseText = await res.text();
    console.log("RAW RESPONSE:", responseText);

    if (!res.ok) {
      throw new Error(responseText);
    }

    const updatedUser = JSON.parse(responseText);
    console.log("PARSED USER:", updatedUser);

    setAuth(updatedUser, token!);
    setIsEditing(false);
    setPassword("");

    toast.success("Adatok sikeresen mentve!");
  } catch (err: any) {
    console.error("SAVE ERROR:", err);
    toast.error("Nem sikerült a mentés!");
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
      <header className="flex h-16 items-center justify-between border-b border-[#BF944A]/20 bg-[#6B4A2D] px-6 shadow-lg">
        <div className="flex gap-2">
          <button className="h-12 w-36 rounded bg-[#BF944A] font-bold text-[#36483D]">Személyes</button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D]">Orvosok</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="leading-none font-bold text-[#BF944A]">{user.name}</span>
            <span className="text-xs opacity-70">{user.role}</span>
          </div>
          <button onClick={handleLogout} className="rounded bg-red-700/80 px-4 py-2 font-bold text-white hover:bg-red-700">
            Kijelentkezés
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#BF944A]">Személyes profil</h1>
          
          {/* GOMB LOGIKA */}
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn bg-[#BF944A] text-[#36483D] border-none px-8"
            >
              Módosítás
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="btn btn-error btn-outline">Mégse</button>
              <button onClick={handleSave} className="btn bg-[#A2A369] text-[#36483D] border-none">Mentés</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SZERKESZTHETŐ ADATOK */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D] p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">Módosítható adatok</h2>

            <div>
              <label className="mb-1 block text-sm">Telefonszám</label>
              <input
                disabled={!isEditing}
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none shadow-lg ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm">Lakcím</label>
              <input
                disabled={!isEditing}
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none shadow-lg ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm">Új jelszó (opcionális)</label>
              <input
                disabled={!isEditing}
                type="password"
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none shadow-lg ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                placeholder="Csak ha módosítani akarod"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* FIX ADATOK */}
          <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D]/50 p-6 shadow-lg">
            <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">Hivatalos adatok</h2>
            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">Teljes név</label>
              <span className="text-lg font-medium">{user.name}</span>
            </div>
            <div className="rounded-lg bg-[#36483D]/50 p-3">
              <label className="block text-xs uppercase opacity-60">TAJ szám</label>
              <span className="text-lg font-medium tracking-widest">{user.tajNumber}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}