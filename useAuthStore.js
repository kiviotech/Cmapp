import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      designation: null,

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
        }),

      clearAuth: () =>
        set({
          user: null,
          designation: null,
        }),
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
