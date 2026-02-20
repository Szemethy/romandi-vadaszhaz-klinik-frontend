"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegistrationPage() {
  const router = useRouter();
  const [role, setRole] = useState<null | "doctor" | "patient">(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    tajNumber: "",
    specialization: "",
    birthDate: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // 🔥 ha az adott mezőben volt hiba, töröljük
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) return;

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      birthDate: formData.birthDate,
      role: role === "doctor" ? "DOCTOR" : "PATIENT",
      gender: role === "patient" ? formData.gender : undefined,
      tajNumber: role === "patient" ? formData.tajNumber : undefined,
      address: role === "patient" ? formData.address : undefined,
      specialization:
        role === "doctor" ? formData.specialization : undefined,
    };

    try {
      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Szerver válasza:", data);

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors); // 🔥 közvetlenül backend errors
        } else {
          setError(data.message || "Szerver hiba");
        }
        return;
      }

      toast.success("Sikeres regisztráció!");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba");
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

      {role && (
        <form
          className="w-full max-w-md rounded-xl bg-[#6B4A2D] p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="name"
            placeholder="Név"
            onChange={handleChange}
          />
          {fieldErrors.name && (
            <p className="mb-2 text-sm text-red-400">
              {fieldErrors.name}
            </p>
          )}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="birthDate"
            type="date"
            onChange={handleChange}
          />
          {fieldErrors.birthDate && (
            <p className="mb-2 text-sm text-red-400">
              {fieldErrors.birthDate}
            </p>
          )}

          {role === "doctor" && (
            <>
              <input
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
                name="specialization"
                placeholder="Szakterület"
                onChange={handleChange}
              />
              {fieldErrors.specialization && (
                <p className="mb-2 text-sm text-red-400">
                  {fieldErrors.specialization}
                </p>
              )}
            </>
          )}

          {role === "patient" && (
            <>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, gender: value });

                  if (fieldErrors.gender) {
                    setFieldErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.gender;
                      return copy;
                    });
                  }
                }}
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
              >
                <option value="">Nem kiválasztása</option>
                <option value="MALE">Férfi</option>
                <option value="FEMALE">Nő</option>
              </select>
              {fieldErrors.gender && (
                <p className="mb-2 text-sm text-red-400">
                  {fieldErrors.gender}
                </p>
              )}

              <input
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
                name="tajNumber"
                placeholder="TAJ szám"
                onChange={handleChange}
              />
              {fieldErrors.tajNumber && (
                <p className="mb-2 text-sm text-red-400">
                  {fieldErrors.tajNumber}
                </p>
              )}

              <input
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
                name="address"
                placeholder="Lakcím"
                onChange={handleChange}
              />
              {fieldErrors.address && (
                <p className="mb-2 text-sm text-red-400">
                  {fieldErrors.address}
                </p>
              )}
            </>
          )}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="phone"
            placeholder="Telefonszám"
            onChange={handleChange}
          />
          {fieldErrors.phone && (
            <p className="mb-2 text-sm text-red-400">
              {fieldErrors.phone}
            </p>
          )}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <p className="mb-2 text-sm text-red-400">
              {fieldErrors.email}
            </p>
          )}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="password"
            placeholder="Jelszó"
            type="password"
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="mb-2 text-sm text-red-400">
              {fieldErrors.password}
            </p>
          )}

          <button
            className="btn w-full bg-[#A2A369] text-[#36483D] shadow-lg hover:bg-[#BF944A]"
            disabled={loading}
            type="submit"
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </button>

          {error && (
            <div className="mt-6 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}


// if (!res.ok) {
//   if (data.error) {
//     const fieldErrors: Record<string, string> = {};

//     const parts = data.error.split(",");

//     parts.forEach((part: string) => {
//       const match = part.match(/(\w+): (.+)/);
//       if (match) {
//         const [, field, message] = match;
//         fieldErrors[field.trim()] = message.trim();
//       }
//     });

//     setErrors(fieldErrors);
//   }

//   return;
// } Olivér backendje nem küld normális json-t ez ezt oldaná meg....


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
