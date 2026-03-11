"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

type Appointment = {
  _id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  startTime: string;
  endTime: string;
  doctor_id: {
    _id: string;
    name: string;
    specialization: string;
    phone: string;
  };
  patient_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  service_id: {
    topic: string;
    location: string;
    price: string;
  };
};

export default function AppointmentsPage() {
  const { user, token } = useGlobalStore();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModifyId, setOpenModifyId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");

  const activeHours = Array.from({ length: 8 }, (_, i) => 9 + i);
  const minutes = [0, 10, 20, 30, 40, 50];

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = await res.json();
        if (!res.ok) throw new Error("API ERROR");

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("🔥 FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchAppointments();
  }, [token]);

  const filteredAppointments = appointments.filter((app) => {
    if (!user) return false;

    if (user.role === "PATIENT") return app.patient_id._id === user.id;
    if (user.role === "DOCTOR") return app.doctor_id._id === user.id;

    return true;
  });

  async function updateStatus(id: string, status: "ACCEPTED" | "REJECTED") {
    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) throw new Error("Státusz frissítés sikertelen");

      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (error) {
      console.error(error);
    }
  }

  async function modifyAppointmentDate(id: string) {
    if (!selectedDate || !selectedHour || !selectedMinute) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }

    const newStart = dayjs(selectedDate)
      .hour(Number(selectedHour))
      .minute(Number(selectedMinute))
      .second(0);

    if (!newStart.isValid() || newStart.isBefore(dayjs())) {
      alert("Érvénytelen időpont.");
      return;
    }

    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startTime: newStart.toISOString(),
          }),
        },
      );

      if (!res.ok) throw new Error("Időpont módosítás sikertelen");

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, startTime: newStart.toISOString() } : a)),
      );

      setOpenModifyId(null);
      setSelectedDate(null);
      setSelectedHour("");
      setSelectedMinute("");
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelAppointment(id: string) {
    if (!confirm("Biztosan le szeretnéd mondani az időpontot?")) return;

    await updateStatus(id, "REJECTED");
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#36483D] text-white">
        <Header />
        <div className="p-10">Betöltés...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Időpontok</h1>

        {filteredAppointments.length === 0 ? (
          <p className="font-semibold text-white">Nincsenek időpontok.</p>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((app) => {
              const isPast = dayjs(app.startTime).isBefore(dayjs());

              return (
                <div
                  className={`rounded-xl border border-[#BF944A]/20 p-6 shadow-lg transition ${
                    isPast ? "bg-gray-600/40" : "bg-[#6B4A2D]"
                  }`}
                  key={app._id}
                >
                  {isPast && (
                    <div className="mb-2 inline-block rounded bg-gray-500 px-3 py-1 text-xs font-bold text-white">
                      Nem elérhető
                    </div>
                  )}

                  <h2
                    className={`mb-2 text-xl font-bold text-yellow-400 ${
                      isPast ? "line-through" : ""
                    }`}
                  >
                    {app.service_id.topic}
                  </h2>

                  <div className={`space-y-1 text-sm text-white ${isPast ? "line-through" : ""}`}>
                    <p>📍 {app.service_id.location}</p>
                    <p>🕒 {dayjs(app.startTime).format("YYYY.MM.DD HH:mm")}</p>
                    <p>👨‍⚕️ Orvos: {app.doctor_id.name}</p>
                    <p>👤 Páciens: {app.patient_id.name}</p>
                    <p>💰 {app.service_id.price}</p>

                    <p
                      className={`font-bold ${
                        app.status === "PENDING"
                          ? "text-yellow-400"
                          : app.status === "ACCEPTED"
                            ? "text-green-400"
                            : "text-red-400"
                      }`}
                    >
                      Állapot: {app.status}
                    </p>
                  </div>

                  {user?.role === "DOCTOR" && !isPast && (
                    <div className="mt-4 flex gap-3">
                      {app.status === "PENDING" && (
                        <>
                          <button
                            className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            onClick={() => updateStatus(app._id, "ACCEPTED")}
                          >
                            Elfogad
                          </button>

                          <button
                            className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            onClick={() => updateStatus(app._id, "REJECTED")}
                          >
                            Elutasít
                          </button>

                          <button
                            className="cursor-pointer rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                            onClick={() =>
                              setOpenModifyId(openModifyId === app._id ? null : app._id)
                            }
                          >
                            Időpont módosítás
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {openModifyId === app._id && (
                    <div className="mt-4 space-y-3">
                      <DatePicker
                        className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg"
                        dateFormat="yyyy.MM.dd"
                        minDate={new Date()}
                        placeholderText="Dátum kiválasztása"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                      />

                      <select
                        className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg"
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
                        className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg"
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

                      <button
                        className="w-full cursor-pointer rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
                        onClick={() => modifyAppointmentDate(app._id)}
                      >
                        Időpont módosítása
                      </button>
                    </div>
                  )}

                  {user?.role === "PATIENT" && !isPast && (
                    <div className="mt-4 flex gap-3">
                      <button
                        className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        onClick={() => cancelAppointment(app._id)}
                      >
                        Lemondás
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
