"use client";
import { useState } from "react";

export default function RegistrationPage() {
  const [role, setRole] = useState<null | "doctor" | "patient">(null);

  const formMinHeight = "min-h-[480px]";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#36483D] text-[#A89D62] p-6">
      <h1 className="text-5xl mb-6 font-bold">Regisztráció</h1>

      <div className="mb-8 flex gap-4">
        <button
          className={`btn ${role === "doctor" ? "btn" : "btn-outline"} text-[#BF944A] text-base`}
          onClick={() => setRole("doctor")}
        >
          Orvosként regisztrálok
        </button>
        <button
          className={`btn ${role === "patient" ? "btn" : "btn-outline"} text-[#BF944A] text-base`}
          onClick={() => setRole("patient")}
        >
          Páciensként regisztrálok
        </button>
      </div>

      {role === "doctor" && (
        <form className={`w-full max-w-md bg-[#6B4A2D] p-6 rounded-xl shadow-lg ${formMinHeight}`}>
          <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Orvos regisztráció</h2>
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Név" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Szakterület" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Telefonszám" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Email" type="email" />
          <input className="input input-bordered border-[#BF944A] w-full mb-4 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Jelszó" type="password" />
          <button className="btn w-full bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]" type="submit">Regisztráció</button>
        </form>
      )}

      {role === "patient" && (
        <form className={`w-full max-w-md bg-[#6B4A2D] p-6 rounded-xl shadow-lg ${formMinHeight}`}>
          <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Páciens regisztráció</h2>
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Név" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Születési dátum" type="date" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Telefonszám" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Lakcím" />
          <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Email" type="email" />
          <input className="input input-bordered border-[#BF944A] w-full mb-4 focus:outline-none focus:ring-0 bg-[#6B4A2D] text-white" placeholder="Jelszó" type="password" />
          <button className="btn w-full bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]" type="submit">Regisztráció</button>
        </form>
      )}
    </div>
  );
}
