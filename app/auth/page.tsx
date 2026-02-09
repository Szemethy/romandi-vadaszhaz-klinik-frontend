export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">Bejelentkezés</h1>

        <input className="input input-bordered w-full mb-3" type="email" placeholder="Email" />
        <input className="input input-bordered w-full mb-4" type="password" placeholder="Jelszó" />
        <button className="btn btn-primary w-full">Belépés</button>

        <div className="divider">vagy</div>

        <h2 className="mb-4 text-center text-xl font-semibold">Regisztráció</h2>

        <input className="input input-bordered w-full mb-3" type="email" placeholder="Email" />
        <input className="input input-bordered w-full mb-3" type="password" placeholder="Jelszó" />
        <input className="input input-bordered w-full mb-4" type="password" placeholder="Jelszó újra" />
        <button className="btn btn-secondary w-full">Regisztráció</button>
      </div>
    </div>
  );
}

