import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@cleus/shared";

interface AppState {
  user: UserProfile | null;
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  setUser: (user: UserProfile | null) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: "dark",
      sidebarCollapsed: false,
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: "cleus-app-store", partialize: (s) => ({ theme: s.theme, user: s.user }) }
  )
);
