"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

type MedicalRecord = {
  _id: string;
  patient: string;
  doctor: string;
  service: string;
  description: string;
  createdAt: string;
};

export default function InfosPage() {
  const { token, user } = useGlobalStore(); // innen vesszük a token-t és a patientId-t
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Jelzi, hogy a client-side render megtörtént
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // ne fusson SSR alatt
    if (!token || !user) {
      setError("Nincs token vagy felhasználó - jelentkezz be először!");
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/records/patient/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Jelentések lekérése sikertelen");

        const data = await res.json();
        setRecords(data);
      } catch (err: any) {
        console.error("Hiba a jelentések lekérésekor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isMounted, token, user]);

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-6xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">
          Orvosi jelentések
        </h1>

        {loading ? (
          <p>Betöltés...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : records.length === 0 ? (
          <p>Nincsenek elérhető jelentések.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {records.map((record) => (
              <div
                key={record._id}
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">
                  Szolgáltatás: {record.service}
                </h2>
                <p className="mb-2 text-sm opacity-80">
                  Orvos: {record.doctor}
                </p>
                <p className="mb-2 text-sm opacity-80">
                  Dátum: {new Date(record.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white">{record.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
