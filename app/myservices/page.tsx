"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

type Service = {
  _id: string;
  doctor_id: string;
  topic: string;
  description: string;
  location: string;
  price: string;
};

export default function MyServicesPage() {
  const { user, token } = useGlobalStore();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // 🔐 csak DOCTOR
  useEffect(() => {
    if (!user) return;

    if (user.role !== "DOCTOR") {
      router.push("/dashboard");
      return;
    }

    fetchServices();
  }, [user]);

  // 📥 szolgáltatások lekérése
  const fetchServices = async () => {
    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services/${user?.id}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Szolgáltatások betöltése sikertelen");
    } finally {
      setLoadingPage(false);
    }
  };

  // ➕ új szolgáltatás vagy 🖊 módosítás
  const createOrUpdateService = async () => {
    if (!topic || !description || !location || !price) {
      toast.error("Minden mező kitöltése kötelező!");
      return;
    }

    try {
      setLoading(true);

      const url = editingServiceId
        ? `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services/${editingServiceId}`
        : "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services";

      const method = editingServiceId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: user?.id,
          topic,
          description,
          location,
          price,
        }),
      });

      if (!res.ok)
        throw new Error(editingServiceId ? "Módosítás sikertelen" : "Szolgáltatás létrehozása sikertelen");

      toast.success(editingServiceId ? "Szolgáltatás módosítva!" : "Szolgáltatás létrehozva!");

      setTopic("");
      setDescription("");
      setLocation("");
      setPrice("");
      setEditingServiceId(null);

      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ szolgáltatás törlése
  const deleteService = async (serviceId: string) => {
    if (!confirm("Biztosan törlöd a szolgáltatást?")) return;

    try {
      const res = await fetch(
        `https://romandi-vadaszhaz-klinik-backend.vercel.app/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Törlés sikertelen");

      toast.success("Szolgáltatás törölve");
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 🖊 Módosítás gomb esemény
  const handleEditService = (service: Service) => {
    setTopic(service.topic);
    setDescription(service.description);
    setLocation(service.location);
    setPrice(service.price);
    setEditingServiceId(service._id);

    // Görgetés az oldal tetejére (header-rel együtt)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingPage)
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
        <h1 className="mb-8 text-3xl font-bold text-[#BF944A]">Szolgáltatásaim</h1>

        {/* ÚJ / MODOSÍTÁS FORM */}
        <div className="mb-10 rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-[#BF944A]">
            {editingServiceId ? "Szolgáltatás módosítása" : "Új szolgáltatás"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="input-bordered input border-[#BF944A] bg-[#36483D] text-white"
              placeholder="Szakterület"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <input
              className="input-bordered input border-[#BF944A] bg-[#36483D] text-white"
              placeholder="Helyszín"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className="input-bordered input border-[#BF944A] bg-[#36483D] text-white"
              placeholder="Ár (pl: 25000 Ft)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              className="min-h-[120px] w-full resize-y rounded border border-[#BF944A] bg-[#36483D] p-3 text-white md:col-span-2"
              placeholder="Leírás"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            className="btn mt-4 w-full bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]"
            disabled={loading}
            onClick={createOrUpdateService}
          >
            {loading ? "Mentés..." : editingServiceId ? "Módosítás mentése" : "Szolgáltatás létrehozása"}
          </button>
        </div>

        {/* SERVICE LISTA */}
        <div className="grid gap-6 md:grid-cols-2">
          {services.length === 0 ? (
            <p className="text-white">Nincs még szolgáltatásod.</p>
          ) : (
            services.map((service) => (
              <div
                className="rounded-xl border border-[#BF944A]/20 bg-[#6B4A2D] p-6 shadow-lg"
                key={service._id}
              >
                <h2 className="text-xl font-bold text-[#BF944A]">{service.topic}</h2>

                <p className="mt-2 text-white">{service.description}</p>

                <div className="mt-3 text-sm">
                  <p>📍 {service.location}</p>
                  <p className="font-bold text-white">💰 {service.price}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 rounded bg-yellow-500 py-2 font-bold text-white hover:bg-yellow-600"
                    onClick={() => handleEditService(service)}
                  >
                    Módosítás
                  </button>

                  <button
                    className="flex-1 rounded bg-red-600 py-2 font-bold text-white hover:bg-red-700"
                    onClick={() => deleteService(service._id)}
                  >
                    Törlés
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}