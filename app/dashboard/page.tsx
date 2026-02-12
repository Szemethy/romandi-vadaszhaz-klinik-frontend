"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";
import dayjs from "dayjs";


export default function DashboardPage() {
  const { user, token, logout, setAuth } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      const bodyData = {
        phone,
        address,
        password,
        birthDate,
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
        },
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
    } catch (err: unknown) {
      //any volt eredietileg, de így pontosabb
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
      <header className="border-b border-[#BF944A]/20 bg-[#6B4A2D] px-4 shadow-lg md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO / NAVIGATION */}
          <div className="flex items-center gap-2">
            {/* Asztali nézet gombjai */}
            <div className="hidden gap-2 md:flex">
              <button className="h-12 w-36 cursor-pointer rounded bg-[#BF944A] font-bold text-[#36483D] transition-colors hover:bg-[#A2A369]">
                Személyes
              </button>
              <button className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Orvosok
              </button>
              <button className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Időpontok
              </button>
              <button className="h-12 w-36 cursor-pointer rounded bg-[#A2A369] font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
                Orvosi jelentések
              </button>
            </div>

            {/* Hamburger gomb mobilon */}
            <div className="md:hidden">
              <button
                className="rounded-md bg-[#BF944A] p-2 text-[#36483D]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Jobb oldali user info és kijelentkezés */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="leading-none font-bold text-[#BF944A]">{user.name}</span>
              <span className="text-xs opacity-70">{user.role}</span>
            </div>
            <button
              className="rounded bg-red-700/80 px-4 py-2 font-bold text-white hover:bg-red-700"
              onClick={handleLogout}
            >
              Kijelentkezés
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="mt-2 flex flex-col gap-2 px-2 pb-2 md:hidden">
            <button className="w-full cursor-pointer rounded bg-[#BF944A] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#A2A369]">
              Személyes
            </button>
            <button className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
              Orvosok
            </button>
            <button className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
              Időpontok
            </button>
            <button className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] transition-colors hover:bg-[#BF944A]">
              Orvosi jelentések
            </button>
          </div>
        )}
      </header>

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
    className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
    disabled={!isEditing}
    type="date"
    value={birthDate}
    onChange={(e) => setBirthDate(e.target.value)}
  />
</div>

            <div>
              <label className="mb-1 block text-sm">Lakcím</label>
              <input
                className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                disabled={!isEditing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

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
              <label className="block text-xs uppercase opacity-60">TAJ szám</label>
              <span className="text-lg font-medium tracking-widest">{user.tajNumber}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
