"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

export default function NewInfoPage() {
  const { appointmentId } = useParams();
  const router = useRouter();
  const { token } = useGlobalStore();

  const [appointment, setAppointment] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(
          `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error("Időpont betöltése sikertelen");
        const data = await res.json();
        setAppointment(data);
      } catch (err: any) {
        setError(err.message || "Hiba történt");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAppointment();
  }, [appointmentId, token]);

  const handleCreateRecord = async () => {
    if (!description) {
      alert("A lelet szövegét töltsd ki!");
      return;
    }

    try {
      // 1️⃣ Lelet létrehozása
      const res = await fetch("https://romandi-vadaszhaz-klinik-backend.vercel.app/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient: appointment.patient_id._id,
          doctor: appointment.doctor_id._id,
          service: appointment.service_id._id,
          appointment_id: appointment._id,
          description,
        }),
      });
      if (!res.ok) throw new Error("Lelet létrehozása sikertelen");

      // 2️⃣ Időpont státusz COMPLETED
      const statusRes = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/${appointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "COMPLETED" }),
        },
      );
      if (!statusRes.ok) throw new Error("Időpont státusz frissítés sikertelen");

      alert("Lelet sikeresen létrehozva!");
      router.push("/infos"); // vissza a leletek oldalra
    } catch (err: any) {
      alert(err.message || "Hiba történt a lelet létrehozásakor");
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointment) return <p>Nincs időpont adat</p>;

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Új lelet készítése</h1>

        <div className="mb-4 rounded bg-[#6B4A2D] p-4 text-white">
          <p>👤 Páciens: {appointment.patient_id.name}</p>
          <p>🩺 Szolgáltatás: {appointment.service_id.topic}</p>
          <p>📅 Időpont: {new Date(appointment.startTime).toLocaleString("hu-HU")}</p>
        </div>

        <textarea
          className="w-full rounded border border-[#BF944A] bg-[#36483D] p-2 text-white"
          placeholder="Írd ide a szakmai leletet..."
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="mt-4 w-full rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
          onClick={handleCreateRecord}
        >
          Lelet létrehozása
        </button>
      </main>
    </div>
  );
}
