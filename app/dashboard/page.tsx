export default function DashboardPage() {
  const userName = "Dr. Romándi";

  return (
    <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between bg-[#6B4A2D] px-6 shadow-lg">
        {/* MENÜK */}
        <div className="flex gap-2">
          <button className="h-12 w-36 rounded bg-[#BF944A] font-bold text-[#36483D]">
            Személyes
          </button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]">
            Orvosok
          </button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]">
            Időpontok
          </button>
          <button className="h-12 w-36 rounded bg-[#A2A369] text-[#36483D] hover:bg-[#BF944A]">
            Jegyzetek
          </button>
        </div>

        {/* FELHASZNÁLÓ */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">{userName}</span>
          <button className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">
            Kijelentkezés
          </button>
        </div>
      </header>

      {/* TARTALOM */}
      <main className="p-8">
        <h1 className="mb-6 text-3xl font-bold text-[#BF944A]">Személyes adatok</h1>

        <div className="max-w-xl space-y-4 rounded-xl bg-[#6B4A2D] p-6 shadow-lg">
          {/* NÉV */}
          <div>
            <label className="mb-1 block font-semibold">Név</label>
            <div className="flex gap-2">
              <input className="input w-full bg-[#36483D] text-white" placeholder="Teljes név" />
              <button className="btn bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                Módosítás
              </button>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block font-semibold">Email</label>
            <div className="flex gap-2">
              <input className="input w-full bg-[#36483D] text-white" placeholder="Email cím" />
              <button className="btn bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                Módosítás
              </button>
            </div>
          </div>

          {/* JELSZÓ */}
          <div>
            <label className="mb-1 block font-semibold">Jelszó</label>
            <div className="flex gap-2">
              <input
                className="input w-full bg-[#36483D] text-white"
                placeholder="Új jelszó"
                type="password"
              />
              <button className="btn bg-[#BF944A] text-[#36483D] hover:bg-[#A89D62]">
                Módosítás
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
