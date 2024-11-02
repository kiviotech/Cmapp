// import { create } from "zustand"; // Make sure to replace this with your actual apiClient import

// // Auth store using Zustand
// const useAuthStore = create((set) => ({
//   user: null,
//   designation: null,
//   role: null,
//   projects: [],
//   tasks: [],
//   permissions: {},

//   // Method to set full user data
//   setUser: (userData) =>
//     set({
//       user: {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         provider: userData.provider,
//         confirmed: userData.confirmed,
//         blocked: userData.blocked,
//         createdAt: userData.createdAt,
//         updatedAt: userData.updatedAt,
//         token: userData.token,
//       },
//       designation: userData.designation, // Store user's designation
//       role: userData.role, // Store user's role
//       projects: userData.projects, // Store user's projects
//       tasks: userData.tasks, // Store user's tasks
//       permissions: userData.permissions || {}, // Store user permissions
//     }),

//   // Method to set roles
//   setRoles: (roles) => set({ roles }),

//   // Method to set permissions
//   setPermissions: (permissions) => set({ permissions }),

//   // Method to clear auth data
//   clearAuth: () =>
//     set({
//       user: null,
//       designation: null,
//       role: null,
//       projects: [],
//       tasks: [],
//       permissions: {},
//     }),
// }));

// export default useAuthStore;

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
          designation: userData.designation, // Store user's designation
          role: userData.role, // Store user's role
          projects: userData.projects, // Store user's projects
          tasks: userData.tasks, // Store user's tasks
          permissions: userData.permissions || {}, // Store user permissions
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
