"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchAppointments() {
      try {
        console.log("🔑 TOKEN:", token);
        console.log("👤 USER:", user);

        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("📡 RESPONSE STATUS:", res.status);

        const text = await res.text();

        console.log("📦 RAW RESPONSE:", text);

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        console.log("📦 PARSED DATA:", data);

        if (!res.ok) {
          throw new Error("API ERROR");
        }

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("🔥 FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchAppointments();
  }, [token]);

  // szerep alapú szűrés
  const filteredAppointments = appointments.filter((app) => {
    if (!user) return false;

    if (user.role === "PATIENT") {
      return app.patient_id._id === user.id;
    }

    if (user.role === "DOCTOR") {
      return app.doctor_id._id === user.id;
    }

    return true;
  });

  async function updateStatus(id: string, status: "ACCEPTED" | "REJECTED") {
    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        throw new Error("Státusz frissítés sikertelen");
      }

      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#36483D] text-white">
        <Header />
        <div className="p-10">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Időpontok</h1>

        {filteredAppointments.length === 0 ? (
          <p className="font-semibold text-white">Nincsenek időpontok.</p>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((app) => (
              <div
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
                key={app._id}
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">{app.service_id.topic}</h2>

                <div className="space-y-1 text-sm text-white">
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

                {user?.role === "DOCTOR" && app.status === "PENDING" && (
                  <div className="mt-4 flex gap-3">
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
