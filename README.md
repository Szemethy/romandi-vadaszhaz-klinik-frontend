

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

* **Framework:** React
* **Routing:** React Router
* **HTTP kliens:** Axios
* **Állapotkezelés:** React state / context
* **Auth:** JWT (localStorage)
* **UI:** saját komponensek / CSS

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

## 🧭 Oldalak & Funkciók (javasolt struktúra)

### 🔑 Auth

* `/login` – bejelentkezés
* `/register` – regisztráció (szerepkörfüggő mezőkkel)

### 👤 Profil

* `/profile`

  * felhasználói adatok
  * orvosi leletek (`records`)

### 📅 Időpontok

* Páciens:

  * új időpont foglalása
  * saját időpontok listája
* Orvos:

  * hozzá tartozó időpontok
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

---

Ha szeretnéd, a következőben tudok segíteni:

* 📁 **projekt mappastruktúra**
* 🔐 **ProtectedRoute / role-based route guard**
* 📦 **Axios instance token kezeléssel**
* 🎨 **konkrét oldalak (Login, Profile, Appointments) React kódja**


