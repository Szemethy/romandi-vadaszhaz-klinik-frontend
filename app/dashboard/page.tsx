"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

// --- TÍPUSDEFINÍCIÓK (A Backend v1.3.0 alapján) ---

type NextAppointment = {
  date: string;
  doctor: string;
  specialization: string;
  location: string;
  topic: string;
};

type NextPatient = {
  patientName: string;
  date: string;
  topic: string;
  location: string;
};

type LastVisit = {
  patientName: string;
  date: string;
  topic: string;
};

type Stats = {
  type: string;
  totalCompleted: number;
  totalActive: number;
  // Patient specifikus
  healthInvestment?: number;
  nextAppointment?: NextAppointment | null;
  // Doctor specifikus
  totalPatients?: number;
  nextPatient?: NextPatient | null;
  lastVisit?: LastVisit | null;
};

type Appointment = {
  _id: string;
  date: string;
};

type RecordItem = {
  _id: string;
  date: string;
  doctorName: string;
  serviceType: string;
};

type UpdateProfileBody = {
  phone: string;
  address: string;
  birthDate: string;
  password?: string;
};

export default function DashboardPage() {
  const { user, token, logout, setAuth } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  // --- ÁLLAPOTOK ---
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setBirthDate(user.birthDate ? dayjs(user.birthDate).format("YYYY-MM-DD") : "");
    }

    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/stats/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Hiba a dashboard betöltésében");

        setStats(data.stats);
      } catch (err: unknown) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "Hiba a dashboard betöltésekor");
      }
    };

    fetchDashboard();
  }, [user, token]);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user) return null;

  // --- HELPEREK ---
  const formatDate = (date: string) => dayjs(date).format("YYYY. MM. DD.");
  const formatTime = (date: string) => dayjs(date).format("HH:mm");
  const daysUntil = (date: string) => Math.max(0, dayjs(date).diff(dayjs(), "day"));
  const formatCurrency = (amount: number) => new Intl.NumberFormat("hu-HU").format(amount) + " Ft";

  // --- PROFIL MŰVELETEK ---
  const handleCancel = () => {
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setPassword("");
    setBirthDate(user.birthDate ? dayjs(user.birthDate).format("YYYY-MM-DD") : "");
    setBirthDateError(null);
    setIsEditing(false);
    toast.error("Módosítások elvetve.");
  };

  const handleSave = async () => {
    try {
      setBirthDateError(null);
      const bodyData: UpdateProfileBody = { phone, address, birthDate };
      if (password.trim() !== "") bodyData.password = password;

      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Mentési hiba");

      setAuth(data, token!);
      setIsEditing(false);
      setPassword("");
      toast.success("Adatok sikeresen mentve!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      if (message.includes("születési dátum")) setBirthDateError(message);
      else toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl space-y-8 p-8">
        {/* --- PROFIL SZEKCIÓ --- */}
        <section className="mb-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#BF944A]">Személyes profil</h1>
            {!isEditing ? (
              <button
                className="btn border-none bg-[#BF944A] px-8 text-[#36483D]"
                onClick={() => setIsEditing(true)}
              >
                Módosítás
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-outline btn-error" onClick={handleCancel}>
                  Mégse
                </button>
                <button
                  className="btn border-none bg-[#A2A369] text-[#36483D]"
                  onClick={handleSave}
                >
                  Mentés
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D] p-6 shadow-lg">
              <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
                Módosítható adatok
              </h2>
              <div>
                <label className="mb-1 block text-sm">Telefonszám</label>
                <input
                  className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none ${!isEditing && "opacity-50"}`}
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Születési dátum</label>
                <input
                  className={`input-bordered input w-full bg-[#36483D] text-white focus:outline-none ${birthDateError ? "border-red-500" : "border-[#BF944A]"} ${!isEditing && "opacity-50"}`}
                  disabled={!isEditing}
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
                {birthDateError && (
                  <div className="mt-2 text-sm text-red-400">{birthDateError}</div>
                )}
              </div>
              {user.role === "PATIENT" && (
                <div>
                  <label className="mb-1 block text-sm">Lakcím</label>
                  <input
                    className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none ${!isEditing && "opacity-50"}`}
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm">Új jelszó (opcionális)</label>
                <input
                  className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white focus:outline-none ${!isEditing && "opacity-50"}`}
                  disabled={!isEditing}
                  placeholder="Csak ha módosítani akarod"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D]/50 p-6 shadow-lg">
              <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
                Hivatalos adatok
              </h2>
              <div className="rounded-lg bg-[#36483D]/50 p-3">
                <label className="block text-xs uppercase opacity-60">Teljes név</label>
                <span className="text-lg font-medium">{user.name}</span>
              </div>
              <div className="rounded-lg bg-[#36483D]/50 p-3">
                <label className="block text-xs uppercase opacity-60">
                  {user.role === "DOCTOR" ? "Specializáció" : "TAJ szám"}
                </label>
                <span className="text-lg font-medium tracking-widest">
                  {user.role === "DOCTOR" ? user.specialization || "N/A" : user.tajNumber || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- DASHBOARD SZEKCIÓ --- */}

        {/* Következő esemény Widget */}
        <section className="rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-[#BF944A]">
            {user.role === "PATIENT" ? "Következő vizit" : "Következő páciens"}
          </h2>

          {user.role === "PATIENT" ? (
            stats?.nextAppointment ? (
              <div className="rounded-lg bg-[#36483D]/70 p-4 text-white">
                <p className="text-lg font-semibold">
                  {formatDate(stats.nextAppointment.date)} {formatTime(stats.nextAppointment.date)}
                </p>
                <p className="font-medium text-[#BF944A]">{stats.nextAppointment.topic}</p>
                <p>
                  Orvos: {stats.nextAppointment.doctor} ({stats.nextAppointment.specialization})
                </p>
                <p className="text-sm opacity-80">Helyszín: {stats.nextAppointment.location}</p>
                <p className="mt-2 text-sm text-[#A2A369]">
                  {daysUntil(stats.nextAppointment.date)} nap van hátra
                </p>
              </div>
            ) : (
              <div className="text-white">
                <p>Nincs jelenleg ütemezett vizited.</p>
                <button
                  className="btn mt-2 bg-[#A2A369] text-[#36483D]"
                  onClick={() => router.push("/doctors")}
                >
                  Időpontfoglalás
                </button>
              </div>
            )
          ) : // ORVOSI NÉZET
          stats?.nextPatient ? (
            <div className="rounded-lg bg-[#36483D]/70 p-4 text-white">
              <p className="text-lg font-semibold">
                {formatDate(stats.nextPatient.date)} {formatTime(stats.nextPatient.date)}
              </p>
              <p className="font-medium text-[#BF944A]">{stats.nextPatient.patientName}</p>
              <p>Téma: {stats.nextPatient.topic}</p>
              <p className="text-sm opacity-80">Helyszín: {stats.nextPatient.location}</p>
            </div>
          ) : (
            <p className="text-white">Nincs mára több várható páciens.</p>
          )}
        </section>

        {/* Statisztikai Kártyák */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            <p className="text-sm opacity-70">
              {user.role === "DOCTOR" ? "Összes egyedi páciens" : "Lezárt vizitek"}
            </p>
            <p className="text-2xl font-bold">
              {user.role === "DOCTOR" ? stats?.totalPatients : stats?.totalCompleted || 0}
            </p>
          </div>

          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            <p className="text-sm opacity-70">
              {user.role === "DOCTOR" ? "Várható vizitek" : "Aktív foglalások"}
            </p>
            <p className="text-2xl font-bold">{stats?.totalActive || 0}</p>
          </div>

          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            {user.role === "PATIENT" ? (
              <>
                <p className="text-sm opacity-70">Egészségügyi ráfordítás</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.healthInvestment || 0)}</p>
              </>
            ) : (
              <>
                <p className="text-sm opacity-70">Utolsó vizit</p>
                <p className="text-md truncate font-medium">
                  {stats?.lastVisit ? `${stats.lastVisit.patientName}` : "Nincs adat"}
                </p>
                {stats?.lastVisit && (
                  <p className="text-xs opacity-50">{formatDate(stats.lastVisit.date)}</p>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
