"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

export default function TimetablePage() {
  const { user, token } = useGlobalStore();
  const router = useRouter();

  const [dayOfWeek, setDayOfWeek] = useState("Hétfő");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect csak useEffect-ben
  useEffect(() => {
    if (!user) return; 
    if (user.role !== "DOCTOR") {
      router.push("/dashboard");
    } else {
      setLoadingPage(false);
    }
  }, [user, router]);

  const handleSubmit = async () => {
    if (!user || !token) {
      setErrorMessage("Hiba: Nincs bejelentkezett felhasználó");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null); // előző hiba törlése

      console.log("Sending availability:", {
        doctor: user.id,
        dayOfWeek,
        startTime,
        endTime,
        slotDuration,
      });

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor: user.id,
            dayOfWeek,
            startTime,
            endTime,
            slotDuration,
          }),
        },
      );

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (!res.ok) {
        // A backend message megjelenítése az űrlapon
        const msg =
          data.message || (data.errors ? Object.values(data.errors).join(", ") : "Ismeretlen hiba");
        setErrorMessage(msg);
        return; // itt már nem dobunk hibát
      }

      // Sikeres mentés
      setErrorMessage(null);
      toast.success("Rendelési idő sikeresen mentve!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Mentési hiba");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#36483D] text-[#A89D62]">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="flex justify-center p-8">
        <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">
            Rendelési idő beállítása
          </h1>

          {/* Nap */}
          <label className="mb-1 block text-sm">Nap</label>
          <select
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Kezdés */}
          <label className="mb-1 block text-sm">Kezdés</label>
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          {/* Befejezés */}
          <label className="mb-1 block text-sm">Befejezés</label>
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          {/* Slot */}
          <label className="mb-1 block text-sm">Időtartam (perc)</label>
          <input
            className="input-bordered input mb-6 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            min={5}
            step={5}
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
          />

          <button
            className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Mentés..." : "Mentés"}
          </button>

          {errorMessage && <p className="mt-3 text-center text-sm text-red-400">{errorMessage}</p>}
        </div>
      </main>
    </div>
  );
}
