"use client";

import dayjs from "dayjs";
import { Banknote, Clock, MapPin, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

type Appointment = {
  _id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "PROPOSED" | "CANCELLED" | "COMPLETED";
  startTime: string;
  endTime: string;
  doctor_id: { _id: string; name: string; specialization: string; phone: string };
  patient_id: { _id: string; name: string; email: string; phone: string };
  service_id: { topic: string; location: string; price: string };
  referral_type?: "SELF" | "DOCTOR";
  referred_by?: { _id: string; name: string; specialization?: string };
};

export default function AppointmentsPage() {
  const { user, token } = useGlobalStore();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModifyId, setOpenModifyId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Appointment["status"] | "">("");

  const statusLabels: Record<Appointment["status"], string> = {
    PENDING: "Függőben",
    ACCEPTED: "Elfogadva",
    REJECTED: "Elutasítva",
    PROPOSED: "Javasolt",
    CANCELLED: "Lemondva",
    COMPLETED: "Befejezve",
  };

  useEffect(() => {
    const el = document.getElementById("pagination-buttons");
    if (el) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  const itemsPerPage = 5;
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
        console.error("FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchAppointments();
  }, [token]);

  const filteredAppointments = appointments.filter((app) => {
    if (!user) return false;

    if (user.role === "PATIENT" && app.patient_id._id !== user.id) return false;
    if (user.role === "DOCTOR" && app.doctor_id._id !== user.id) return false;

    if (statusFilter && app.status !== statusFilter) return false;

    return true;
  });
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredAppointments.length, totalPages]);

  async function updateStatus(id: string, status: Appointment["status"]) {
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
    const newEnd = newStart.add(30, "minute");

    if (!newStart.isValid() || newStart.isBefore(dayjs())) {
      alert("Érvénytelen időpont.");
      return;
    }

    try {
      const body = { startTime: newStart.toISOString(), endTime: newEnd.toISOString() };
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error("Módosítás sikertelen");

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id
            ? {
                ...a,
                startTime: newStart.toISOString(),
                endTime: newEnd.toISOString(),
                status: "PROPOSED",
              }
            : a,
        ),
      );
      setOpenModifyId(null);
      setSelectedDate(null);
      setSelectedHour("");
      setSelectedMinute("");
    } catch (error) {
      console.error("MODIFY ERROR:", error);
    }
  }

  // if (loading)
  //   return (
  //     <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
  //       <Header />
  //       <main className="mx-auto max-w-6xl p-8">
  //         <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Időpontok</h1>
  //         <p>Betöltés...</p>
  //       </main>
  //     </div>
  //   );

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />
      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Időpontok</h1>

        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold text-white">Szűrés státusz szerint:</label>
          <select
            className="input w-64 cursor-pointer border-[#BF944A] bg-[#36483D] text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Appointment["status"] | "")}
          >
            <option value="">Összes</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {paginatedAppointments.map((app) => {
            const now = dayjs();
            const isPast = dayjs(app.startTime).isBefore(now);

            const isUnavailable =
              app.status === "REJECTED" ||
              app.status === "CANCELLED" ||
              (app.status === "PENDING" && isPast);

            return (
              <div
                className={`rounded-xl border border-[#BF944A]/20 p-6 shadow-lg transition ${
                  isUnavailable ? "bg-gray-600/40" : "bg-[#6B4A2D]"
                }`}
                key={app._id}
              >
                {isUnavailable && (
                  <div className="mb-2 inline-block rounded bg-gray-500 px-3 py-1 text-xs font-bold text-white">
                    Nem elérhető
                  </div>
                )}

                <h2
                  className={`mb-2 text-xl font-bold text-yellow-400 ${isUnavailable ? "line-through" : ""}`}
                >
                  {app.service_id.topic}
                </h2>

                <div
                  className={`space-y-1 text-sm text-white ${isUnavailable ? "line-through" : ""}`}
                >
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {app.service_id.location}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {dayjs(app.startTime).format("YYYY.MM.DD HH:mm")}
                  </p>

                  <p className="flex items-center gap-2">
                    <Stethoscope size={16} /> Orvos: {app.doctor_id.name}
                  </p>

                  <p className="flex items-center gap-2">
                    <User size={16} /> Páciens: {app.patient_id.name}
                  </p>

                  <p className="flex items-center gap-2">
                    <Banknote size={16} /> {app.service_id.price}
                  </p>
                  {/* {app.referral_type === "SELF" && <p>📌 Forrás: Saját beutalás</p>}
                  {app.referral_type === "DOCTOR" && app.referred_by && (
                    <p>📌 Beutaló orvos: {app.referred_by.name}</p>
                  )} */}

                  <p
                    className={`font-bold ${
                      app.status === "PENDING"
                        ? "text-yellow-400"
                        : app.status === "ACCEPTED"
                          ? "text-green-400"
                          : app.status === "PROPOSED"
                            ? "text-orange-400"
                            : app.status === "COMPLETED"
                              ? "text-blue-400"
                              : "text-gray-400"
                    }`}
                  >
                    Állapot: {statusLabels[app.status]}
                  </p>
                </div>

                {user?.role === "DOCTOR" && !isUnavailable && (
                  <div className="mt-4 flex flex-col gap-3">
                    {app.status === "PENDING" && !isPast && (
                      <>
                        <button
                          className="cursor-pointer rounded bg-[#A2A369] px-4 py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                          onClick={() => updateStatus(app._id, "ACCEPTED")}
                        >
                          Elfogad
                        </button>
                        <button
                          className="cursor-pointer rounded bg-[#A2A369] px-4 py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                          onClick={() => updateStatus(app._id, "REJECTED")}
                        >
                          Elutasít
                        </button>
                        <button
                          className="cursor-pointer rounded bg-[#A2A369] px-4 py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                          onClick={() => setOpenModifyId(openModifyId === app._id ? null : app._id)}
                        >
                          Időpont módosítás
                        </button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && isPast && (
                      <button
                        className="btn w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] shadow-md hover:bg-[#BF944A]"
                        onClick={() => router.push(`/newinfo/${app._id}`)}
                      >
                        Lelet készítése
                      </button>
                    )}

                    {app.status === "COMPLETED" && (
                      <div className="rounded border border-green-400 py-2 text-center font-bold text-green-400">
                        ✓ Vizit befejezve (Lelet kész)
                      </div>
                    )}
                  </div>
                )}

                {user?.role === "PATIENT" && !isUnavailable && !isPast && (
                  <div className="mt-4 flex gap-3">
                    <button
                      className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      onClick={() => {
                        if (confirm("Biztosan lemondod?")) updateStatus(app._id, "CANCELLED");
                      }}
                    >
                      Lemondás
                    </button>
                  </div>
                )}

                {openModifyId === app._id && (
                  <div className="mt-4 space-y-3 rounded-lg bg-black/20 p-4">
                    <DatePicker
                      className="input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white"
                      dateFormat="yyyy.MM.dd"
                      minDate={new Date()}
                      placeholderText="Dátum kiválasztása"
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                    />
                    <div className="flex gap-2">
                      <select
                        className="input w-full border-[#BF944A] bg-[#36483D] text-white"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                      >
                        <option value="">Óra</option>
                        {activeHours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <select
                        className="input w-full border-[#BF944A] bg-[#36483D] text-white"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                      >
                        <option value="">Perc</option>
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="w-full rounded bg-green-600 py-2 font-bold text-white"
                      onClick={() => modifyAppointmentDate(app._id)}
                    >
                      Módosítás mentése
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4" id="pagination-buttons">
          <button
            className="cursor-pointer rounded bg-[#6B4A2D] px-4 py-2 text-white disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Előző
          </button>

          <span className="text-white">
            {currentPage} / {totalPages}
          </span>

          <button
            className="cursor-pointer rounded bg-[#6B4A2D] px-4 py-2 text-white disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Következő
          </button>
        </div>
      </main>
    </div>
  );
}
