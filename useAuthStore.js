import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      designation: null,
      token: null,
      sub_contractor: null,

      setUser: (userData) =>
        set({
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            provider: userData.provider,
            confirmed: userData.confirmed,
            blocked: userData.blocked,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            token: userData.token,
          },
          designation: userData.designation,
          token: userData.token,
          sub_contractor: userData.sub_contractor,
        }),

      clearAuth: () =>
        set({
          user: null,
          designation: null,
          token: null,
          sub_contractor: null,
        }),
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
