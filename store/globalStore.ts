import { create } from "zustand";
import { persist } from "zustand/middleware";

//ez kell mert oldal újratöltésekor is megmaradjon az állapot. a zustand store nullra állítja vissza az értékeket, ha nincs ez a middleware

type GlobalStore = {
  loggedUser: string | null;
  lightTheme: boolean;
  id: string | null;
  setId: (newId: string | null) => void;
  // setLoggedUser: (newLoggedUser: string | null) => void;
  // setLightTheme: (newLightTheme: boolean) => void;
  setLoggedUser: (newLoggedUser: string | null) => void;
  setLightTheme: (newLightTheme: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      loggedUser: null,
      lightTheme: true,
      id: null,
      setId: (newId) => set({ id: newId }),
      setLoggedUser: (newLoggedUser) => set({ loggedUser: newLoggedUser }),
      setLightTheme: (newLightTheme) => set({ lightTheme: newLightTheme }),
      logout: () => set({ loggedUser: null, id: null }),
    }),
    {
      name: "global-storage", // Ez lesz a kulcs a localStorage-ban
    },
  ),
);

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
//   //   set((state) => ({
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
