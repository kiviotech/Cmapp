import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectStore = create(
  persist((set) => ({
    projectData: null,
    setProjectData: (data) => set({ projectData: data }),
  }))
);

export default useProjectStore;
