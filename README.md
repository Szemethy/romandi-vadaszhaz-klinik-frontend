

# 🖥️ Klinik Időpontfoglaló Rendszer – Frontend

Ez a projekt egy webalapú klinikai időpontfoglaló rendszer **React frontendje**, amely a Node.js + Express backend API-ra csatlakozik.
A rendszer páciensek, orvosok és adminisztrátorok számára biztosít különböző funkciókat.

🌐 **Éles frontend URL:**
[https://romandi-vadaszhaz-klinik-frontend-4.vercel.app/](https://romandi-vadaszhaz-klinik-frontend-4.vercel.app/)

---

## 🔗 Backend Kapcsolat

* **API Base URL:**
  `https://romandi-vadaszhaz-klinik-backend.vercel.app`
* **Swagger / API Docs:**
  [https://romandi-vadaszhaz-klinik-backend.vercel.app/api-docs](https://romandi-vadaszhaz-klinik-backend.vercel.app/api-docs)

A frontend **JWT token alapú autentikációt** használ, a backend által biztosított végpontokon keresztül.

---

## 🛠 Technológiai Stack

* **Framework:** Next.js 16.1.6 (React 19.2.3)
* **Routing:** Next.js App Router
* **HTTP kliens:** Axios
* **Állapotkezelés:** Zustand (persist middleware-rel)
* **Auth:** JWT (localStorage)
* **UI:** Tailwind CSS, DaisyUI, Lucide React ikonok
* **Dátumkezelés:** date-fns, dayjs, react-datepicker
* **Időkezelés:** react-time-picker, react-clock
* **Értesítések:** react-hot-toast
* **Tesztelés:** Cypress
* **Linting:** ESLint
* **Formázás:** Prettier
* **TypeScript:** TypeScript 5

---

## 📁 Projekt Struktúra

```
├── app/                          # Next.js App Router oldalak
│   ├── globals.css               # Globális stílusok
│   ├── layout.tsx                # Fő layout
│   ├── page.tsx                  # Főoldal
│   ├── admin/                    # Admin oldalak
│   │   ├── page.tsx
│   │   ├── appointments/
│   │   ├── dashboard/
│   │   ├── doctors/
│   │   ├── doctorservices/
│   │   ├── forgot-password/
│   │   ├── header/
│   │   ├── infos/
│   │   ├── myservices/
│   │   ├── newinfo/
│   │   ├── registration/
│   │   ├── reset-password/
│   │   └── timetable/
├── cypress/                      # E2E tesztek
│   ├── e2e/                      # Teszt fájlok
│   ├── fixtures/                 # Teszt adatok
│   └── support/                  # Teszt támogatási fájlok
├── public/                       # Statikus fájlok
├── store/                        # Zustand store
│   └── globalStore.ts
├── types/                        # TypeScript típusdefiníciók
│   └── global.d.ts
├── cypress.config.ts             # Cypress konfiguráció
├── next.config.ts                # Next.js konfiguráció
├── package.json                  # Függőségek és scriptek
├── tsconfig.json                 # TypeScript konfiguráció
├── eslint.config.mjs             # ESLint konfiguráció
├── postcss.config.mjs            # PostCSS konfiguráció
├── prettier.config.cjs           # Prettier konfiguráció
└── tailwind.config.js            # Tailwind CSS konfiguráció (ha létezik)
```

---

## 👤 Felhasználói szerepkörök a frontendben

A frontend működése szerepköralapú, a backend `role` mezője alapján.

| Szerepkör   | Leírás                                                       |
| ----------- | ------------------------------------------------------------ |
| **PATIENT** | Időpontfoglalás, saját profil és orvosi leletek megtekintése |
| **DOCTOR**  | Saját időpontok, páciensek adatainak megtekintése            |
| **ADMIN**   | Összes felhasználó és időpont kezelése                       |

---

## 🔐 Autentikáció & Token kezelés

### Bejelentkezés

* **Endpoint:** `POST /api/users/login`
* Sikeres bejelentkezés után a backend egy JWT tokent ad vissza
* A frontend a tokent `localStorage`-ben tárolja

```js
localStorage.setItem("token", response.data.token);
```

### Token használata védett kéréseknél

```js
headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`
}
```

### Kijelentkezés

* **Endpoint:** `POST /api/users/logout`
* Token törlése kliens oldalon:

```js
localStorage.removeItem("token");
```

---

## 🚀 Telepítés és Futtatás

### Előfeltételek

* Node.js (ajánlott: 18+)
* npm vagy yarn

### Telepítés

1. Klónozd a repository-t:
   ```bash
   git clone <repository-url>
   cd romandi-vadaszhaz-klinik-frontend
   ```

2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```

3. Indítsd el a fejlesztési szervert:
   ```bash
   npm run dev
   ```

   A alkalmazás elérhető lesz: `http://localhost:8080`

### Build és Production

```bash
# Build létrehozása
npm run build

# Production futtatás
npm run start
```

### Tesztek futtatása

```bash
# E2E tesztek Cypress-szel
npx cypress open

# vagy headless módban
npx cypress run
```

### Kódformázás és Linting

```bash
# Prettier formázás ellenőrzése
npm run format

# Prettier formázás javítása
npm run format:fix

# ESLint ellenőrzés
npm run lint
```

---

## 🧭 Oldalak & Funkciók

### 🔑 Auth

* `/login` – bejelentkezés
* `/register` – regisztráció (szerepkörfüggő mezőkkel)
* `/forgot-password` – jelszó visszaállítás kérése
* `/reset-password` – jelszó visszaállítás

### 👤 Profil

* `/profile` – felhasználói adatok, orvosi leletek (`records`)

### 📅 Időpontok

* **Páciens:**
  * Új időpont foglalása
  * Saját időpontok listája
* **Orvos:**
  * Hozzá tartozó időpontok kezelése
* **Admin:**
  * Összes időpont kezelése

### 👨‍⚕️ Orvosok

* Orvosok listája és szolgáltatásaik
* Orvos-specifikus oldalak (`/doctorservices/[doctorId]`)

### 📊 Dashboard

* Admin dashboard összesített adatokkal

### ℹ️ Információk

* Klinikai információk kezelése (`/infos`, `/newinfo`)

### 🕒 Időbeosztás

* Orvosok időbeosztásának megtekintése (`/timetable`)

---

## 🔧 Konfiguráció

### Környezeti változók

Hozz létre egy `.env.local` fájlt a gyökérkönyvtárban:

```env
NEXT_PUBLIC_API_BASE_URL=https://romandi-vadaszhaz-klinik-backend.vercel.app
```

### Next.js Konfiguráció

A `next.config.ts` fájlban:
- Képek optimalizálása kikapcsolva (`unoptimized: true`)
- React Strict Mode alapértelmezetten bekapcsolva

### Tailwind CSS és DaisyUI

A stílusok Tailwind CSS-szel és DaisyUI komponensekkel vannak megvalósítva.

---

## 🧪 Tesztelés

A projekt Cypress E2E teszteket használ. A tesztek a `cypress/e2e/` könyvtárban találhatók:

- `appointments.cy.ts` – időpontfoglalás tesztek
- `dashboard.cy.ts` – dashboard tesztek
- `doctors.cy.ts` – orvosok tesztek
- stb.

Tesztek futtatása:
```bash
npx cypress open
```

---

## 📦 Build és Deploy

### Vercel Deploy

A projekt Vercel-re van konfigurálva automatikus deploy-ra.

### Manuális Build

```bash
npm run build
npm run start
```

---

## 🤝 Közreműködés

1. Fork-old a repository-t
2. Hozz létre egy feature branch-et (`git checkout -b feature/uj-funkcio`)
3. Commit-old a változtatásokat (`git commit -am 'Új funkció hozzáadása'`)
4. Push-old a branch-et (`git push origin feature/uj-funkcio`)
5. Nyiss egy Pull Request-et

---

## 📄 Licenc

Ez a projekt zárt forráskódú.

---

## 📞 Kapcsolat

Kérdések esetén lépj kapcsolatba a fejlesztő csapattal.
* Admin:

  * **összes időpont** listázása (`GET /api/appointments`)

---

## 📅 Időpont adatmodell (frontend szempontból)

Fontos mezők, amelyekkel a frontend dolgozik:

```json
{
  "startTime": "2026-02-10T10:00:00.000Z",
  "endTime": "2026-02-10T10:30:00.000Z",
  "status": "BOOKED",
  "referral_type": "SELF",
  "doctor_id": {
    "name": "Dr. Teszt Elek"
  },
  "patient_id": {
    "email": "patient@gmail.com"
  }
}
```

Admin esetén az ID-k helyett **teljes objektumok** érkeznek vissza.

---

## ⚠️ Hibakezelés a frontendben

A frontendnek kezelnie kell az alábbi HTTP státuszkódokat:

| Kód     | Jelentés     | Frontend teendő           |
| ------- | ------------ | ------------------------- |
| **401** | Unauthorized | Átirányítás login oldalra |
| **403** | Forbidden    | Jogosultsági hiba üzenet  |
| **404** | Not Found    | Nem létező adat           |
| **500** | Server Error | Általános hibaüzenet      |

---

## 🚀 Telepítés és futtatás

```bash
npm install
npm start
```

Build:

```bash
npm run build
```

---

## 📌 Megjegyzések

* A frontend **nem tartalmaz üzleti logikát**, minden jogosultság-ellenőrzés a backendben történik
* A React alkalmazás teljes mértékben a backend API-ra támaszkodik
* Swagger UI használata erősen ajánlott fejlesztés közben




