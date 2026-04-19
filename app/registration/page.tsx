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
  const [showPassword, setShowPassword] = useState(false);
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

    //  ha az adott mezőben volt hiba, töröljük
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
      gender: formData.gender,
      tajNumber: role === "patient" ? formData.tajNumber : undefined,
      address: role === "patient" ? formData.address : undefined,
      specialization: role === "doctor" ? formData.specialization : undefined,
    };

    try {
      const res = await fetch(
        "https://romandi-vadaszhaz-klinik-backend.vercel.app/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      console.log("Szerver válasza:", data);

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
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
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#36483D] p-6 text-[#A89D62]">
      <h1 className="mb-6 text-5xl font-bold">Regisztráció</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <button
          className={`btn ${role === "doctor" ? "btn" : "btn-outline"} text-base text-[#BF944A]`}
          onClick={() => {
            setRole("doctor");
            setFieldErrors({});
            setFormData((prev) => ({
              ...prev,
              tajNumber: "",
              address: "",
              specialization: "",
            }));
          }}
        >
          Orvosként regisztrálok
        </button>

        <button
          className={`btn ${role === "patient" ? "btn" : "btn-outline"} text-base text-[#BF944A]`}
          onClick={() => {
            setRole("patient");
            setFieldErrors({});
            setFormData((prev) => ({
              ...prev,
              specialization: "",
            }));
          }}
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
          {fieldErrors.name && <p className="mb-2 text-sm text-red-400">{fieldErrors.name}</p>}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="birthDate"
            type="date"
            onChange={handleChange}
          />
          {fieldErrors.birthDate && (
            <p className="mb-2 text-sm text-red-400">{fieldErrors.birthDate}</p>
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
                <p className="mb-2 text-sm text-red-400">{fieldErrors.specialization}</p>
              )}
            </>
          )}

          <select
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:outline-none"
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
          >
            <option value="">Nem kiválasztása</option>
            <option value="MALE">Férfi</option>
            <option value="FEMALE">Nő</option>
          </select>

          {fieldErrors.gender && <p className="mb-2 text-sm text-red-400">{fieldErrors.gender}</p>}

          {role === "patient" && (
            <>
              <input
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
                name="tajNumber"
                placeholder="TAJ szám"
                onChange={handleChange}
              />
              {fieldErrors.tajNumber && (
                <p className="mb-2 text-sm text-red-400">{fieldErrors.tajNumber}</p>
              )}

              <input
                className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
                name="address"
                placeholder="Lakcím"
                onChange={handleChange}
              />
              {fieldErrors.address && (
                <p className="mb-2 text-sm text-red-400">{fieldErrors.address}</p>
              )}
            </>
          )}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="phone"
            placeholder="Telefonszám"
            onChange={handleChange}
          />
          {fieldErrors.phone && <p className="mb-2 text-sm text-red-400">{fieldErrors.phone}</p>}

          <input
            className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] text-white shadow-lg focus:ring-0 focus:outline-none"
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
          />
          {fieldErrors.email && <p className="mb-2 text-sm text-red-400">{fieldErrors.email}</p>}

          <div className="relative">
            <input
              className="input-bordered input mb-1 w-full border-[#BF944A] bg-[#36483D] pr-10 text-white shadow-lg focus:ring-0 focus:outline-none"
              name="password"
              placeholder="Jelszó"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
            />

            <button
              className="absolute top-2 right-2 text-sm text-[#BF944A]"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🔒" : "👁️"}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mb-2 text-sm text-red-400">{fieldErrors.password}</p>
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
