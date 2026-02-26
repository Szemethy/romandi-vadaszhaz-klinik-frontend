"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/globalStore";
import toast from "react-hot-toast";
import Header from "@/app/header/page";

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function TimetablePage() {
  const { user, token } = useGlobalStore();
  const router = useRouter();

  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "DOCTOR") {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);

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
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Hiba történt");
      }

      toast.success("Rendelési idő sikeresen mentve!");
    } catch (err: any) {
      toast.error(err.message || "Mentési hiba");
    } finally {
      setLoading(false);
    }
  };

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
            type="time"
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          {/* Befejezés */}
          <label className="mb-1 block text-sm">Befejezés</label>
          <input
            type="time"
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          {/* Slot */}
          <label className="mb-1 block text-sm">Időtartam (perc)</label>
          <input
            type="number"
            min={5}
            step={5}
            className="input-bordered input mb-6 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
          >
            {loading ? "Mentés..." : "Mentés"}
          </button>
        </div>
      </main>
    </div>
  );
}