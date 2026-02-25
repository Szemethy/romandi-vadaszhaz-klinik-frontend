"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/header/page";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/globalStore";

type Doctor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
};

export default function DoctorsPage() {
  const router = useRouter();
  const { user } = useGlobalStore();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 ROLE VÉDELEM
  useEffect(() => {
    if (user && user.role !== "PATIENT") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/doctors"
        );

        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Hiba az orvosok lekérésekor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (!user || user.role !== "PATIENT") return null;

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-6xl p-8">
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">
          Orvosaink
        </h1>

        {loading ? (
          <p>Betöltés...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                <h2 className="mb-2 text-xl font-bold text-[#BF944A]">
                  {doctor.name}
                </h2>

                <p className="mb-2 text-sm opacity-80">
                  Szakterület:
                </p>
                <p className="mb-4 font-semibold text-white">
                  {doctor.specialization}
                </p>

                <div className="space-y-2 text-sm">
                  <p>
                    📞 <span className="text-white">{doctor.phone}</span>
                  </p>
                  <p>
                    ✉️ <span className="text-white">{doctor.email}</span>
                  </p>
                </div>

                {/* ✅ ÚJ GOMB */}
                <button
                  onClick={() =>
                    router.push(`/doctorservices/${doctor._id}`)
                  }
                  className="mt-4 w-full rounded bg-[#A2A369] py-2 font-bold text-[#36483D] hover:bg-[#BF944A]"
                >
                  Szolgáltatások
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}