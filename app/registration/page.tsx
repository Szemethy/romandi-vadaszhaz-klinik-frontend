"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegistrationPage() {
  const router = useRouter();
  const [role, setRole] = useState<null | "doctor" | "patient">(null);
  const [loading, setLoading] = useState(false);

  // Állapotok az adatok tárolására
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    tajNumber: "",
    specialization: "",
    birthDate: "", // Frontendben megvan, de a backendbe még nem küldjük
  });

  const formMinHeight = "min-h-[480px]";

  // Input változás kezelő
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Regisztráció beküldése
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      role: role === "doctor" ? "DOCTOR" : "PATIENT",
      specialization: role === "doctor" ? formData.specialization : "",
      tajNumber: role === "patient" ? formData.tajNumber : "N/A",
    };

    // --- LOGOLÁS: Mit küldünk el? ---
    console.log("REGISZTRÁCIÓ INDÍTÁSA...");
    console.log("Küldött adatok (Payload):", payload);

    try {
      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      // --- LOGOLÁS: Szerver válasz státusza ---
      console.log("Szerver válasz státuszkód:", res.status);

      const data = await res.json();

      // --- LOGOLÁS: Szerver válasz tartalma ---
      console.log("Szerver válasz JSON:", data);

      if (!res.ok) {
        // Itt dobjuk a hibát, ha nem 200-as a válasz
        throw new Error(data.message || `Szerver hiba: ${res.status}`);
      }

      toast.success("Sikeres regisztráció!");
      router.push("/");
    } catch (err) {
      // --- LOGOLÁS: Elkapott hiba ---
      console.error("Hiba történt a regisztráció során:", err);

      const errorMessage = err instanceof Error ? err.message : "Ismeretlen hiba";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#36483D] p-6 text-[#A89D62]">
      <h1 className="mb-6 text-5xl font-bold">Regisztráció</h1>

      <div className="mb-8 flex gap-4">
        <button
          className={`btn ${role === "doctor" ? "btn" : "btn-outline"} text-base text-[#BF944A]`}
          onClick={() => setRole("doctor")}
        >
          Orvosként regisztrálok
        </button>
        <button
          className={`btn ${role === "patient" ? "btn" : "btn-outline"} text-base text-[#BF944A]`}
          onClick={() => setRole("patient")}
        >
          Páciensként regisztrálok
        </button>
      </div>

      {role === "doctor" && (
        <form
          className={`w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg ${formMinHeight}`}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Orvos regisztráció</h2>
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="name"
            placeholder="Név"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="specialization"
            placeholder="Szakterület"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="phone"
            placeholder="Telefonszám"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="email"
            placeholder="Email"
            required
            type="email"
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="password"
            placeholder="Jelszó"
            required
            type="password"
            onChange={handleChange}
          />
          <button
            className="btn w-full bg-[#BF944A] text-[#36483D] shadow-lg hover:bg-[#A89D62]"
            disabled={loading}
            type="submit"
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </button>
        </form>
      )}

      {role === "patient" && (
        <form
          className={`w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg ${formMinHeight}`}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Páciens regisztráció</h2>
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="name"
            placeholder="Név"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="birthDate"
            placeholder="Születési dátum"
            type="date"
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="phone"
            placeholder="Telefonszám"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="address"
            placeholder="Lakcím"
            required
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-3 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="email"
            placeholder="Email"
            required
            type="email"
            onChange={handleChange}
          />
          <input
            className="input-bordered input mb-4 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="password"
            placeholder="Jelszó"
            required
            type="password"
            onChange={handleChange}
          />
          <button
            className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
            disabled={loading}
            type="submit"
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </button>
        </form>
      )}
    </div>
  );
}

// "use client";
// import { useState } from "react";

// export default function RegistrationPage() {
//   const [role, setRole] = useState<null | "doctor" | "patient">(null);

//   const formMinHeight = "min-h-[480px]";

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#36483D] text-[#A89D62] p-6">
//       <h1 className="text-5xl mb-6 font-bold">Regisztráció</h1>

//       <div className="mb-8 flex gap-4">
//         <button
//           className={`btn ${role === "doctor" ? "btn" : "btn-outline"} text-[#BF944A] text-base`}
//           onClick={() => setRole("doctor")}
//         >
//           Orvosként regisztrálok
//         </button>
//         <button
//           className={`btn ${role === "patient" ? "btn" : "btn-outline"} text-[#BF944A] text-base`}
//           onClick={() => setRole("patient")}
//         >
//           Páciensként regisztrálok
//         </button>
//       </div>

//       {role === "doctor" && (
//         <form className={`w-full max-w-md bg-[#6B4A2D] p-6 rounded-xl shadow-lg ${formMinHeight}`}>
//           <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Orvos regisztráció</h2>
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Név" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Szakterület" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Telefonszám" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Email" type="email" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-4 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Jelszó" type="password" />
//           <button className="btn w-full bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62] shadow-lg" type="submit">Regisztráció</button>
//         </form>
//       )}

//       {role === "patient" && (
//         <form className={`w-full max-w-md bg-[#6B4A2D] p-6 rounded-xl shadow-lg ${formMinHeight}`}>
//           <h2 className="mb-4 text-xl font-semibold text-[#BF944A]">Páciens regisztráció</h2>
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Név" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Születési dátum" type="date" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Telefonszám" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Lakcím" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-3 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Email" type="email" />
//           <input className="input input-bordered border-[#BF944A] w-full mb-4 focus:outline-none focus:ring-0 bg-[#36483D] shadow-lg text-white" placeholder="Jelszó" type="password" />
//           <button className="btn w-full bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A] shadow-lg" type="submit">Regisztráció</button>
//         </form>
//       )}
//     </div>
//   );
// }
