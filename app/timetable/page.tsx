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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [availabilities, setAvailabilities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "DOCTOR") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const fetchAvailabilities = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/availability/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setAvailabilities(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [token]);

  const handleSubmit = async () => {
    if (!user || !token) {
      setErrorMessage("Hiba: Nincs bejelentkezett felhasználó");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

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
      if (!res.ok) {
        const msg =
          data.message || (data.errors ? Object.values(data.errors).join(", ") : "Ismeretlen hiba");
        setErrorMessage(msg);
        return;
      }

      toast.success("Rendelési idő sikeresen mentve!");
      fetchAvailabilities(); // frissítés
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Mentési hiba");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setDayOfWeek(item.dayOfWeek);
    setStartTime(item.startTime.slice(0, 5));
    setEndTime(item.endTime.slice(0, 5));
    setSlotDuration(item.slotDuration || 30);

    window.scrollTo({ top: 0, behavior: "smooth" }); // legfelső részre ugrás
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Biztosan törli a rendelési időt?")) return;

    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/availability/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Törlés sikertelen");

      toast.success("Rendelési idő törölve");
      fetchAvailabilities(); // lista frissítés
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Törlés hiba");
    }
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="flex flex-col items-center p-8">
        {/* FORM */}
        <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">
            Rendelési idő beállítása
          </h1>

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

          <label className="mb-1 block text-sm">Kezdés</label>
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label className="mb-1 block text-sm">Befejezés</label>
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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

        {/* LISTA */}
        <div className="mt-10 w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl text-[#BF944A]">Beállított rendelési idők</h2>

          {availabilities.length === 0 && (
            <p className="text-center text-sm">Nincs még rendelési idő.</p>
          )}

          <div className="flex flex-col gap-3">
            {availabilities.map((item) => (
              <div
                className="flex items-center justify-between rounded-lg bg-[#36483D] p-3"
                key={item._id}
              >
                <div>
                  <p className="font-bold">{item.dayOfWeek}</p>
                  <p>
                    {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                  </p>
                </div>

                <div className="flex gap-3 text-xl">
                  <button
                    className="cursor-pointer transition-transform duration-200 hover:scale-125 hover:text-yellow-300"
                    title="Módosítás"
                    onClick={() => handleEdit(item)}
                  >
                    ✏️
                  </button>
                  <button
                    className="cursor-pointer transition-transform duration-200 hover:scale-125 hover:text-red-500"
                    title="Törlés"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
