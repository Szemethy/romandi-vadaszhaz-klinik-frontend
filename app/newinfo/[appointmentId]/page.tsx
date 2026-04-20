"use client";

import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useGlobalStore } from "@/store/globalStore";

type Appointment = {
  _id: string;
  doctor_id: { _id: string; name: string };
  patient_id: { _id: string; name: string; email: string };
  service_id: { _id: string; topic: string };
  startTime: string;
  endTime: string;
};

export default function NewRecordPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useGlobalStore();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const appointmentId = params?.appointmentId;

  useEffect(() => {
    if (!token || !appointmentId) return;

    async function fetchAppointment() {
      try {
        const res = await fetch(
          `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/appointments/my`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data: Appointment[] = await res.json();
        const app = data.find((a) => a._id === appointmentId);
        if (!app) throw new Error("Időpont nem található");
        setAppointment(app);
      } catch (error) {
        console.error(error);
        toast.error("Hiba az időpont lekérésekor");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [token, appointmentId]);

  async function handleSave() {
    if (!description.trim()) {
      toast.error("A lelet szöveg mező nem lehet üres");
      return;
    }
    if (!token || !appointment) return;

    setSaving(true);

    try {
      const body = {
        patient: appointment.patient_id._id,
        appointment_id: appointment._id,
        service: appointment.service_id._id,
        description: description.trim(),
      };

      const res = await fetch(`https://romandi-vadaszhaz-klinik-backend.vercel.app/api/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend hiba!", {
          status: res.status,
          statusText: res.statusText,
          body: text,
        });
        throw new Error("Lelet mentése sikertelen");
      }

      toast.success("Lelet sikeresen létrehozva!");

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

      if (!statusRes.ok) {
        const text = await statusRes.text();
        console.error("Státusz frissítés hiba!", {
          status: statusRes.status,
          statusText: statusRes.statusText,
          body: text,
        });
        throw new Error("Appointment státusz frissítés sikertelen");
      }

      router.push("/appointments");
    } catch (error) {
      console.error("HANDLE SAVE ERROR:", error);
      toast.error(error instanceof Error ? error.message : "Hiba történt");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#36483D] p-8 text-[#A89D62]">
        <h1 className="text-3xl font-bold text-[#BF944A]">Lelet készítése</h1>
        <p>Betöltés...</p>
      </div>
    );

  if (!appointment)
    return (
      <div className="min-h-screen bg-[#36483D] p-8 text-[#A89D62]">
        <h1 className="text-3xl font-bold text-[#BF944A]">Lelet készítése</h1>
        <p>Az időpont nem található.</p>
      </div>
    );

  if (user?.role !== "DOCTOR" && user?.role !== "ADMIN")
    return (
      <div className="min-h-screen bg-[#36483D] p-8 text-[#A89D62]">
        <h1 className="text-3xl font-bold text-[#BF944A]">Hozzáférés megtagadva</h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <main className="flex justify-center p-8">
        <div className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-[#BF944A]">Lelet készítése</h1>

          <div className="mb-4 rounded-xl bg-[#4A362D] p-4 text-white shadow-inner">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#BF944A]" />
                Szolgáltatás: {appointment.service_id.topic}
              </p>

              <p className="flex items-center gap-2">
                <FaClock className="text-blue-400" />
                Időpont: {dayjs(appointment.startTime).format("YYYY.MM.DD HH:mm")}
              </p>

              <p className="flex items-center gap-2">
                <FaUser className="text-green-400" />
                Páciens: {appointment.patient_id.name}
              </p>
            </div>
          </div>

          <textarea
            className="w-full rounded border border-[#BF944A] bg-[#36483D] p-3 text-white focus:outline-none"
            placeholder="Írd ide a leletet..."
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="mt-4 w-full rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Mentés..." : "Lelet mentése"}
          </button>
        </div>
      </main>
    </div>
  );
}
