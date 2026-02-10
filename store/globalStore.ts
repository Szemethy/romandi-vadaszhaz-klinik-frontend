import { create } from "zustand";
import { persist } from "zustand/middleware";

//ez kell mert oldal újratöltésekor is megmaradjon az állapot. a zustand store nullra állítja vissza az értékeket, ha nincs ez a middleware


export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type GlobalStore = {
  user: User | null;
  token: string | null;
  lightTheme: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLightTheme: (value: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      lightTheme: true,

      setAuth: (user, token) =>
        set({
          user,
          token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),

      setLightTheme: (lightTheme) => set({ lightTheme }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

// type GlobalStore = {
//   loggedUser: string | null;
//   lightTheme: boolean;
//   id: string | null;
//   setId: (newId: string | null) => void;
//   // setLoggedUser: (newLoggedUser: string | null) => void;
//   // setLightTheme: (newLightTheme: boolean) => void;
//   setLoggedUser: (newLoggedUser: string | null) => void;
//   setLightTheme: (newLightTheme: boolean) => void;
// };

// export const useGlobalStore = create<GlobalStore>()(       2.verzió
//   persist(
//     (set) => ({
//       loggedUser: null,
//       lightTheme: true,
//       id: null,
//       setId: (newId) => set({ id: newId }),
//       setLoggedUser: (newLoggedUser) => set({ loggedUser: newLoggedUser }),
//       setLightTheme: (newLightTheme) => set({ lightTheme: newLightTheme }),
//       logout: () => set({ loggedUser: null, id: null }),
//     }),
//     {
//       name: "global-storage", // Ez lesz a kulcs a localStorage-ban
//     },
//   ),
// );



// export const useGlobalStore = create<GlobalStore>()((set) => ({
//   loggedUser: null,
//   lightTheme: true,
//   id: null,
//   // A set függvény itt egy új állapotobjektumot ad vissza
//   // setId: (newId) =>
//   //   set((state) => ({
//   //     // A visszatérési érték egy új objektum, ami az előző state-ből és a módosításokból áll
//   //     ...state,
//   //     id: newId,
//   //   })),
//   // setLoggedUser: (newLoggedUser) =>
//   //   set((state) => ({                                           1.verzió
//   //     ...state,
//   //     loggedUser: newLoggedUser,
//   //   })),
//   // setLightTheme: (newLightTheme) =>
//   //   set((state) => ({
//   //     ...state,
//   //     lightTheme: newLightTheme,
//   //   })),
//   setId: (newId) => set({ id: newId }),
//   setLoggedUser: (newLoggedUser) => set({ loggedUser: newLoggedUser }),
//   logout: () => set({ loggedUser: null, id: null }),
//   setLightTheme: (newLightTheme) => set({ lightTheme: newLightTheme }),
// }));
