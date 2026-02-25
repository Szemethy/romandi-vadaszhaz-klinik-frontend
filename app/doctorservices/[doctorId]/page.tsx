"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";
import dayjs from "dayjs";

type Service = {
  _id: string;
  doctor_id: string;
  topic: string;
  description: string;
  location: string;
  date: string;
  price: string;
};

export default function DoctorServicesPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const { user } = useGlobalStore();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [openBookingId, setOpenBookingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [error, setError] = useState("");

  // 🔐 csak PATIENT láthatja
  useEffect(() => {
    if (user && user.role !== "PATIENT") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services/${doctorId}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Hiba:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchServices();
  }, [doctorId]);

  if (!user || user.role !== "PATIENT") return null;

  // 🩺 MOCK rendelési napok (1=Hétfő ... 5=Péntek)
  const workingDays = [1, 2, 3, 4, 5];

  // 🕒 MOCK aktív órák (9-16)
  const activeHours = Array.from({ length: 8 }, (_, i) => 9 + i);

  // ⏱ percek 10-esével
  const minutes = [0, 10, 20, 30, 40, 50];

  const handleBooking = () => {
    setError("");

    if (!selectedDate || !selectedHour || !selectedMinute) {
      setError("Minden mező kitöltése kötelező!");
      return;
    }

    const dayOfWeek = dayjs(selectedDate).day(); // 0=vasárnap

    if (!workingDays.includes(dayOfWeek)) {
      setError("Az orvos nem rendel ezen a napon!");
      return;
    }

    alert(
      `Sikeres foglalás: ${selectedDate} ${selectedHour}:${selectedMinute}`
    );
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">
          Szolgáltatások
        </h1>

        {loading ? (
          <p>Betöltés...</p>
        ) : services.length === 0 ? (
          <p className="text-white font-semibold">
            Az orvosnak jelenleg nincsenek szolgáltatásai!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">
                  {service.topic}
                </h2>

                <p className="mb-3 text-white">
                  {service.description}
                </p>

                <div className="space-y-1 text-sm mb-4">
                  <p>📍 {service.location}</p>
                  <p className="font-bold text-white">
                    💰 {service.price}
                  </p>
                </div>

                {/* 🔘 FOGLALÁS GOMB */}
                <button
                  onClick={() =>
                    setOpenBookingId(
                      openBookingId === service._id
                        ? null
                        : service._id
                    )
                  }
                  className="w-full rounded bg-[#A2A369] py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                >
                  Időpont foglalás
                </button>

                {/* 📅 FOGLALÁSI PANEL */}
                {openBookingId === service._id && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="date"
                      className="w-full rounded p-2 text-black"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    {/* ÓRA */}
                    <select
                      className="w-full rounded p-2 text-black"
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                    >
                      <option value="">Óra kiválasztása</option>
                      {activeHours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>

                    {/* PERC */}
                    <select
                      className="w-full rounded p-2 text-black"
                      value={selectedMinute}
                      onChange={(e) =>
                        setSelectedMinute(e.target.value)
                      }
                    >
                      <option value="">Perc</option>
                      {minutes.map((min) => (
                        <option key={min} value={min}>
                          {min.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {error && (
                      <p className="text-red-400 font-semibold">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={handleBooking}
                      className="w-full rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
                    >
                      Foglalás megerősítése
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}