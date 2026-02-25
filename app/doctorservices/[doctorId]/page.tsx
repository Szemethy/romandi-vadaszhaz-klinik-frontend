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

      // mindig tömb legyen
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]); // ha nincs services, üres tömb
      }
    } catch (error) {
      console.error("Hiba a szolgáltatások lekérésekor:", error);
      setServices([]); // hiba esetén is üres tömb
    } finally {
      setLoading(false);
    }
  };

  if (doctorId) {
    fetchServices();
  }
}, [doctorId]);

  if (!user || user.role !== "PATIENT") return null;

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

        <div className="space-y-1 text-sm">
          <p>📍 {service.location}</p>
          <p>📅 {dayjs(service.date).format("YYYY.MM.DD HH:mm")}</p>
          <p className="font-bold text-white">
            💰 {service.price} 
          </p>
        </div>
      </div>
    ))}
  </div>
)}
      </main>
    </div>
  );
}