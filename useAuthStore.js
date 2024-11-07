import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import persist middleware

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      designation: null,
      role: null,
      projects: [],
      tasks: [],
      permissions: {},

      // Method to set full user data
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
          role: userData.role,
          projects: userData.projects,
          tasks: userData.tasks,
          permissions: userData.permissions || {},
        }),

      // Method to set roles
      setRoles: (roles) => set({ roles }),

      // Method to set permissions
      setPermissions: (permissions) => set({ permissions }),

      // Method to clear auth data
      clearAuth: () =>
        set({
          user: null,
          designation: null,
          role: null,
          projects: [],
          tasks: [],
          permissions: {},
        }),
    }),
    {
      name: "auth-store", // Name for local storage key
      getStorage: () => localStorage, // Specify localStorage for web
    }
  )
);

export default useAuthStore;
