"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";

type Stats = any;
type User = any;
type Service = any;
type Appointment = any;

type ViewMode = "all" | "stats" | "users" | "services" | "appointments";

export default function AdminPage() {
  const { token, user, logout } = useGlobalStore() as {
    token: string | null;
    user: User | null;
    logout: () => void;
  };
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<ViewMode>("all");

  type User = {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER" | "DOCTOR";
  };

  const API = "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/admin";

  async function fetchAll() {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [sRes, uRes, serRes, aRes] = await Promise.all([
        fetch(`${API}/stats`, { headers }),
        fetch(`${API}/users`, { headers }),
        fetch(`${API}/services`, { headers }),
        fetch(`${API}/appointments`, { headers }),
      ]);

      const s = await sRes.json();
      const u = await uRes.json();
      const ser = await serRes.json();
      const a = await aRes.json();

      console.log("STATS RAW:", s);
      console.log("USERS RAW:", u);
      console.log("SERVICES RAW:", ser);
      console.log("APPOINTMENTS RAW:", a);
      console.log("USERS IS ARRAY?", Array.isArray(u));
      console.log("USERS.users IS ARRAY?", Array.isArray(u?.users));

      setStats(s.stats);

      const usersData = u.users ?? u.data ?? u;
      console.log("USERS FINAL:", usersData);

      setUsers(Array.isArray(usersData) ? usersData : []);

      setServices(ser);
      setAppointments(a);
    } catch (err) {
      console.error("FETCHALL ERROR:", err);
      toast.error("Admin adatok betöltése sikertelen");
      console.log(token);
      console.log(user);
    }
  }

  useEffect(() => {
    if (!token) return;

    if (!user) return;

    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchAll();
  }, [token, user]);

  function handleLogout() {
    logout();
    router.push("/");
    toast.success("Sikeres kijelentkezés");
  }

  async function deleteUser(id: string) {
    const currentUserId = user?._id || user?.id;

    if (currentUserId === id) {
      toast.error("Te őrült!! Nem törölheted saját magad 😈");
      return;
    }

    try {
      await fetch(`${API}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User törölve");
      fetchAll();
    } catch {
      toast.error("Hiba történt törlés közben");
    }
  }

  async function deleteService(id: string) {
    await fetch(`${API}/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Service törölve");
    fetchAll();
  }

  async function deleteAppointment(id: string) {
    await fetch(`${API}/appointments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Appointment törölve");
    fetchAll();
  }

  async function resetDb() {
    await fetch(`${API}/reset-db`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("DB reset done");
    window.location.reload(); 
  }

  async function seedDb() {
    await fetch(`${API}/seed`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Seed kész");
    window.location.reload(); 
  }

  return (
    <div className="min-h-screen bg-[#36483D] px-4 py-8 text-[#A89D62] sm:px-8">
      {/* HEADER */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-[#BF944A] sm:text-4xl">Admin Dashboard</h1>

        <button
          className="btn mt-4 rounded bg-red-600 px-5 py-2 font-bold text-white transition-transform hover:scale-105"
          onClick={handleLogout}
        >
          Kijelentkezés
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          className="cursor-pointer rounded border border-[#A2A369] bg-[#36483D] p-2 text-white focus:ring-2 focus:ring-[#A2A369] focus:outline-none"
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
        >
          <option value="all">Összes</option>
          <option value="stats">Stats</option>
          <option value="users">Users</option>
          <option value="services">Services</option>
          <option value="appointments">Appointments</option>
        </select>

        <button
          className="cursor-pointer rounded bg-red-600 px-3 py-2 text-white transition-all duration-150 hover:scale-105 hover:opacity-90"
          onClick={resetDb}
        >
          RESET DB
        </button>

        <button
          className="cursor-pointer rounded bg-green-600 px-3 py-2 text-white transition-all duration-150 hover:scale-105 hover:opacity-90"
          onClick={seedDb}
        >
          SEED DB
        </button>
      </div>

      {/* STATS */}
      {(view === "all" || view === "stats") && (
        <Section title="Stats">
          {!stats ? (
            <p className="text-white">Betöltés...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* USERS */}
              <div className="rounded bg-[#36483D] p-3 text-white">
                <h3 className="mb-2 font-bold text-[#BF944A]">Felhasználók</h3>
                <p>Összes: {stats.users.total}</p>
                <p>Páciensek: {stats.users.patients}</p>
                <p>Orvosok: {stats.users.doctors}</p>
              </div>

              {/* ACTIVITY */}
              <div className="rounded bg-[#36483D] p-3 text-white">
                <h3 className="mb-2 font-bold text-[#BF944A]">Aktivitás</h3>
                <p>Mai időpontok: {stats.activity.appointmentsToday}</p>
              </div>

              {/* BUSINESS */}
              <div className="rounded bg-[#36483D] p-3 text-white">
                <h3 className="mb-2 font-bold text-[#BF944A]">Bevétel</h3>
                <p>
                  Összes becsült:{" "}
                  <span className="font-bold text-green-400">
                    {stats.business.totalRevenueEstimate.toLocaleString()} {stats.business.currency}
                  </span>
                </p>
              </div>

              {/* TOP SERVICES */}
              <div className="col-span-full rounded bg-[#36483D] p-3 text-white">
                <h3 className="mb-2 font-bold text-[#BF944A]">Top szolgáltatások</h3>

                <div className="space-y-2">
                  {stats.business.topServices.map((s: any) => (
                    <div
                      className="flex items-center justify-between rounded bg-[#2f3f38] p-2"
                      key={s._id}
                    >
                      <span>{s.topic}</span>
                      <span className="font-bold text-yellow-300">{s.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* USERS */}
      {(view === "all" || view === "users") && (
        <Section title="Users">
          {users.map((u: any) => (
            <Item key={u._id}>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-[#BF944A]">{u.name}</p>
                <p className="text-sm text-white">{u.email}</p>
                <p className="text-sm text-white">{u.role}</p>
                <p className="text-xs text-gray-300">ID: {u._id}</p>
              </div>

              <DangerButton onClick={() => deleteUser(u._id)} />
            </Item>
          ))}
        </Section>
      )}

      {/* SERVICES */}
      {(view === "all" || view === "services") && (
        <Section title="Services">
          {services.map((s: any) => (
            <Item key={s._id}>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-[#BF944A]">{s.topic}</p>
                <p className="text-sm text-white">{s.location}</p>
                <p className="text-sm text-white">{s.price}</p>
                <p className="text-xs text-gray-300">ID: {s._id}</p>
              </div>

              <DangerButton onClick={() => deleteService(s._id)} />
            </Item>
          ))}
        </Section>
      )}

      {/* APPOINTMENTS */}
      {(view === "all" || view === "appointments") && (
        <Section title="Appointments">
          {appointments.map((a: any) => (
            <Item key={a._id}>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-[#BF944A]">{a.doctor_id?.name || "Orvos"}</p>
                <p className="text-sm text-white">{a.service_id?.topic || "Szolgáltatás"}</p>
                <p className="text-sm text-gray-300">
                  {new Date(a.startTime).toLocaleString("hu-HU")}
                </p>
              </div>

              <DangerButton onClick={() => deleteAppointment(a._id)} />
            </Item>
          ))}
        </Section>
      )}
    </div>
  );
}

/* UI */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded bg-[#6B4A2D] p-4">
      <h2 className="mb-3 text-xl font-bold text-[#BF944A]">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded bg-[#36483D] p-3 text-white sm:flex-row sm:items-center">
      {children}
    </div>
  );
}

function DangerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full cursor-pointer rounded bg-red-600 px-3 py-1 text-white hover:scale-105 sm:w-auto"
      onClick={onClick}
    >
      Törlés
    </button>
  );
}
