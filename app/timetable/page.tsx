"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

type Availability = {
  _id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

export default function TimetablePage() {
  const { user, token } = useGlobalStore();
  const router = useRouter();

  const [dayOfWeek, setDayOfWeek] = useState("Hétfő");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const hours = Array.from({ length: 9 }, (_, i) => 8 + i); // 08-16
  const minutes = ["00", "30"];

  const renderTimeButtons = (selectedTime: string, setTime: (t: string) => void) => {
    return hours.flatMap((h) => {
      const mins = h === 16 ? ["00"] : minutes; // 16-hoz csak 00
      return mins.map((m) => {
        const time = `${h.toString().padStart(2, "0")}:${m}`;
        return (
          <button
            className={`rounded px-2 py-1 text-sm ${
              selectedTime === time
                ? "bg-yellow-400 text-[#36483D]"
                : "bg-[#36483D] text-white hover:bg-[#A2A369]"
            }`}
            key={time}
            onClick={() => setTime(time)}
          >
            {time}
          </button>
        );
      });
    });
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "DOCTOR") router.push("/dashboard");
  }, [user, router]);

  const fetchAvailabilities = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/availability/my",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setAvailabilities(Array.isArray(data) ? data : data.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Ismeretlen hiba történt");
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
    if (startTime >= endTime) {
      setErrorMessage("A kezdési idő nem lehet későbbi vagy egyenlő a befejezéssel");
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
      fetchAvailabilities();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("Mentési hiba");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Availability) => {
    setDayOfWeek(item.dayOfWeek);
    setStartTime(item.startTime.slice(0, 5));
    setEndTime(item.endTime.slice(0, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    // if (!confirm("Biztosan törli a rendelési időt?")) return;

    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/availability/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Törlés sikertelen");

      toast.success("Rendelési idő törölve");
      fetchAvailabilities();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Törlés hiba");
    }
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="flex flex-col items-center p-8">
        {/* Két rész egymás mellett, mobilon alá */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* --- Rendelési idő beállítása --- */}
          <div className="rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
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

            {/* Kezdés */}
            <div className="mb-4">
              <label className="mb-1 block text-sm">Kezdés</label>
              <div className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto rounded border border-[#BF944A] bg-[#36483D] p-1">
                {renderTimeButtons(startTime, setStartTime)}
              </div>
            </div>

            {/* Befejezés */}
            <div className="mb-4">
              <label className="mb-1 block text-sm">Befejezés</label>
              <div className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto rounded border border-[#BF944A] bg-[#36483D] p-1">
                {renderTimeButtons(endTime, setEndTime)}
              </div>
            </div>

            <button
              className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Mentés..." : "Mentés"}
            </button>

            {errorMessage && (
              <p className="mt-3 text-center text-sm text-red-400">{errorMessage}</p>
            )}
          </div>

          {/* --- Beállított rendelési idők lista --- */}
          <div className="rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">
              Beállított rendelési idők
            </h2>

            {availabilities.length === 0 ? (
              <p className="text-center text-sm">Nincs még rendelési idő.</p>
            ) : (
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
                        <Pencil size={18} />
                      </button>

                      <button
                        className="cursor-pointer transition-transform duration-200 hover:scale-125 hover:text-red-500"
                        title="Törlés"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
