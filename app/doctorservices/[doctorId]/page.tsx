"use client";

import { hu } from "date-fns/locale";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

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
  const { user, token } = useGlobalStore();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [openBookingId, setOpenBookingId] = useState<string | null>(null);

  // const [selectedDate, setSelectedDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
          `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services/${doctorId}`,
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
  const activeHours = Array.from({ length: 9 }, (_, i) => 9 + i);

  // ⏱ percek 10-esével
  const minutes = [0, 10, 20, 30, 40, 50];

  // ✅ BOOKING API HÍVÁS
  const handleBooking = async (serviceId: string) => {
    setError("");

    if (!selectedDate || !selectedHour || !selectedMinute) {
      setError("Minden mező kitöltése kötelező!");
      return;
    }

    const dayOfWeek = dayjs(selectedDate).day();

    if (!workingDays.includes(dayOfWeek)) {
      setError("Az orvos nem rendel ezen a napon!");
      return;
    }

    if (!token) {
      console.log("❌ TOKEN HIÁNYZIK:", token);
      setError("Nincs jogosultság, kérlek jelentkezz be újra!");
      return;
    }

    try {
      const startDateTime = dayjs(selectedDate)
        .hour(Number(selectedHour))
        .minute(Number(selectedMinute))
        .second(0)
        .toISOString();

      const endDateTime = dayjs(startDateTime).add(30, "minute").toISOString();

      const requestBody = {
        doctor_id: doctorId,
        service_id: serviceId,
        startTime: startDateTime,
        endTime: endDateTime,
        referral_type: "SELF",
      };

      console.log("📤 KÜLDÖTT TOKEN:", token);
      console.log("📤 KÜLDÖTT BODY:", requestBody);

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log("📥 STATUS:", res.status);

      const responseText = await res.text();
      console.log("📥 RAW RESPONSE:", responseText);

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = responseText;
      }

      console.log("📥 PARSED RESPONSE:", parsed);

      if (!res.ok) {
        throw new Error(parsed?.message || "Foglalás sikertelen");
      }

      alert("Sikeres időpontfoglalás!");

      setOpenBookingId(null);
      setSelectedDate(null);
      setSelectedHour("");
      setSelectedMinute("");
    } catch (err: any) {
      console.error("🔥 FRONTEND ERROR:", err);
      setError(err.message || "Hiba történt a foglalás során");
    }
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Szolgáltatások</h1>

        {loading ? (
          <p>Betöltés...</p>
        ) : services.length === 0 ? (
          <p className="font-semibold text-white">Az orvosnak jelenleg nincsenek szolgáltatásai!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
                key={service._id}
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">{service.topic}</h2>

                <p className="mb-3 text-white">{service.description}</p>

                <div className="mb-4 space-y-1 text-sm">
                  <p>📍 {service.location}</p>
                  <p className="font-bold text-white">💰 {service.price}</p>
                </div>

                <button
                  className="w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                  onClick={() =>
                    setOpenBookingId(openBookingId === service._id ? null : service._id)
                  }
                >
                  Időpont foglalás
                </button>

                {openBookingId === service._id && (
                  <div className="mt-4 space-y-3">
                    <DatePicker
                      className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
                      dateFormat="yyyy.MM.dd"
                      locale={hu}
                      minDate={new Date()}
                      placeholderText="Dátum kiválasztása"
                      selected={selectedDate}
                       onChange={(date: Date | null) => setSelectedDate(date)}
                    />

                    <select
                      className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
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

                    <select
                      className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                    >
                      <option value="">Perc</option>
                      {minutes.map((min) => (
                        <option key={min} value={min}>
                          {min.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {error && <p className="font-semibold text-red-400">{error}</p>}

                    <button
                      className="w-full cursor-pointer rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
                      onClick={() => handleBooking(service._id)}
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
