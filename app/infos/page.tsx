"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

type MedicalRecord = {
  _id: string;
  description: string;
  createdAt: string;
  patient: {
    _id: string;
    name: string;
    tajNumber: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialization: string;
  };
  service: {
    topic: string;
    location: string;
  };
};

export default function InfosPage() {
  const { token, user } = useGlobalStore();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!token || !user) {
      setError("Nincs token vagy felhasználó - jelentkezz be először!");
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/records/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Leletek lekérése sikertelen");

        const data = await res.json();
        console.log(data);
        setRecords(data);
      } catch (err: unknown) {
        console.error("Hiba a lekéréskor:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ismeretlen hiba történt");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isMounted, token, user]);

  const downloadPDF = async (recordId: string) => {
    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/records/${recordId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("PDF letöltés sikertelen");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `lelet_${recordId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF letöltési hiba:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-6xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Orvosi leletek</h1>

        {loading ? (
          <p>Betöltés...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : records.length === 0 ? (
          <p>Nincsenek elérhető leletek.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {records.map((record) => (
              <div
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
                key={record._id}
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">{record.service.topic}</h2>

                <p className="mb-1 text-sm opacity-80">📍 {record.service.location}</p>

                <p className="mb-1 text-sm opacity-80">
                  👨‍⚕️ Orvos: {record.doctor.name} ({record.doctor.specialization})
                </p>

                {user && user.role === "DOCTOR" && (
                  <p className="mb-1 text-sm opacity-80">
                    🧑 Páciens: {record.patient.name} (TAJ: {record.patient.tajNumber})
                  </p>
                )}

                <p className="mb-3 text-sm opacity-80">
                  📅{" "}
                  {new Date(record.createdAt).toLocaleString("hu-HU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-white">{record.description}</p>

                <button
                  className="btn mt-4 w-full cursor-pointer rounded bg-[#A2A369] py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                  onClick={() => downloadPDF(record._id)}
                >
                  📄 Lelet letöltése (PDF)
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
