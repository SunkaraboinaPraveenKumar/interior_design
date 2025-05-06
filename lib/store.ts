import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      }),
      { name: "ui-storage" }
    )
  )
);

interface FilterState {
  statusFilter: string | null;
  priceRange: [number, number];
  searchQuery: string;
  setStatusFilter: (status: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set) => ({
        statusFilter: null,
        priceRange: [0, 100000],
        searchQuery: "",
        setStatusFilter: (status) => set({ statusFilter: status }),
        setPriceRange: (range) => set({ priceRange: range }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        resetFilters: () =>
          set({ statusFilter: null, priceRange: [0, 100000], searchQuery: "" }),
      }),
      { name: "filter-storage" }
    )
  )
);