"use client";

import dayjs from "dayjs";
import App from "next/app";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

export default function DashboardPage() {
  const { user, token, logout, setAuth } = useGlobalStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  // --- ÚJ ÁLLAPOTOK A SZERKESZTÉSHEZ ---
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // Jelszó opcionális
  const [birthDate, setBirthDate] = useState("");

  // --- DASHBOARD ADATOK ---
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    activeAppointments: 0,
    lastVisitDate: null,
  });

  type NextAppointment = {
    date: string;
    doctorName: string;
    specialization: string;
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

  type Stats = {
    totalVisits: number;
    activeAppointments: number;
    lastVisitDate: string | null;
  };

  type UpdateProfileBody = {
    phone: string;
    address: string;
    birthDate: string;
    password?: string;
  };

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setBirthDate(user.birthDate ? dayjs(user.birthDate).format("YYYY-MM-DD") : "");
    }

    // --- DASHBOARD FETCH ---
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Hiba a dashboard betöltésében");

        setNextAppointment(data.nextAppointment || null);
        setAppointments(data.appointments || []);
        setRecords(data.records || []);
        setStats(data.stats || {});
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Hiba a dashboard betöltésekor");
        }
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

  // --- HELPER FUNKCIÓK ---
  const formatDate = (date: string) => dayjs(date).format("YYYY. MM. DD.");
  const formatTime = (date: string) => dayjs(date).format("HH:mm");
  const daysUntil = (date: string) => Math.max(0, dayjs(date).diff(dayjs(), "day"));

  // Letöltés PDF / Print (egyszerű szöveges export)
  const handleDownloadRecords = () => {
    const content = records
      .map((r) => `${formatDate(r.date)} - ${r.doctorName} (${r.serviceType})`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leletek_${user.name}.txt`;
    link.click();
  };

  // --- PROFIL FUNKCIÓK ---
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
      console.error("SAVE ERROR:", err);
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      if (message.includes("születési dátum")) setBirthDateError(message);
      else toast.error(message);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sikeres kijelentkezés!");
    router.push("/");
  };

  const noAppointments = !appointments.length;
  const noRecords = !records.length;

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      <Header />

      <main className="mx-auto max-w-5xl space-y-8 p-8">
        {/* --- Profil szerkesztés --- */}
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
            {/* Szerkeszthető adatok */}
            <div className="space-y-4 rounded-xl border border-[#BF944A]/10 bg-[#6B4A2D] p-6 shadow-lg">
              <h2 className="mb-4 border-b border-[#BF944A]/20 pb-2 text-xl font-semibold">
                Módosítható adatok
              </h2>

              <div>
                <label className="mb-1 block text-sm">Telefonszám</label>
                <input
                  className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">Születési dátum</label>
                <input
                  className={`input-bordered input w-full bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"} ${birthDateError ? "border-red-500" : "border-[#BF944A]"}`}
                  disabled={!isEditing}
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (birthDateError) setBirthDateError(null);
                  }}
                />
                {birthDateError && (
                  <div className="mt-2 text-sm text-red-400">{birthDateError}</div>
                )}
              </div>

              {user.role === "PATIENT" && (
                <div>
                  <label className="mb-1 block text-sm">Lakcím</label>
                  <input
                    className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm">Új jelszó (opcionális)</label>
                <input
                  className={`input-bordered input w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none ${!isEditing && "cursor-not-allowed opacity-50"}`}
                  disabled={!isEditing}
                  placeholder="Csak ha módosítani akarod"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Fix adatok */}
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

        {/* --- Dashboard --- */}

        {/* Következő vizit – csak páciensnek */}
        {user.role === "PATIENT" && (
          <section className="rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-[#BF944A]">Következő vizit</h2>
            {nextAppointment ? (
              <div className="rounded-lg bg-[#36483D]/70 p-4 text-white">
                <p className="text-lg font-semibold">
                  {formatDate(nextAppointment.date)} {formatTime(nextAppointment.date)}
                </p>
                <p>
                  Orvos: {nextAppointment.doctorName} ({nextAppointment.specialization})
                </p>
                <p className="mt-2 text-sm text-[#A2A369]">
                  {daysUntil(nextAppointment.date)} nap van hátra
                </p>
              </div>
            ) : (
              <div className="text-white">
                <p>Nincs jelenleg ütemezett vizit.</p>
                <button
                  className="btn mt-2 cursor-pointer rounded bg-[#A2A369] px-4 py-2 font-semibold text-[#36483D]"
                  onClick={() => router.push("/doctors")}
                >
                  Időpontfoglalás
                </button>
              </div>
            )}
          </section>
        )}

        {/* Quick Stats */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            <p className="text-sm opacity-70">Összes orvosi vizit</p>
            <p className="text-2xl font-bold">{stats.totalVisits || 0}</p>
          </div>
          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            <p className="text-sm opacity-70">Aktív foglalások</p>
            <p className="text-2xl font-bold">{stats.activeAppointments || 0}</p>
          </div>
          <div className="rounded-xl bg-[#6B4A2D] p-6 text-center shadow-lg">
            <p className="text-sm opacity-70">Utolsó vizsgálat</p>
            <p className="text-2xl font-bold">
              {stats.lastVisitDate ? formatDate(stats.lastVisitDate) : "N/A"}
            </p>
          </div>
        </section>

        {/* Leletek Timeline
        <section className="rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-[#BF944A]">Leletek</h2>
          {noRecords ? (
            <p>Nincs még lelet rögzítve.</p>
          ) : (
            <ul className="space-y-3">
              {records
                .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
                .map((r) => (
                  <li className="flex justify-between rounded-lg bg-[#36483D]/70 p-3" key={r._id}>
                    <div>
                      <p className="font-semibold">
                        {formatDate(r.date)} - {r.doctorName}
                      </p>
                      <p>{r.serviceType}</p>
                    </div>
                    <button
                      className="rounded bg-[#A2A369] px-3 py-1 font-semibold text-[#36483D]"
                      onClick={() => router.push(`/records/${r._id}`)}
                    >
                      Részletek
                    </button>
                  </li>
                ))}
            </ul>
          )}
          {records.length > 0 && (
            <button
              className="mt-4 rounded bg-[#BF944A] px-4 py-2 font-semibold text-[#36483D]"
              onClick={handleDownloadRecords}
            >
              Leletek letöltése
            </button>
          )}
        </section> */}
      </main>
    </div>
  );
}
