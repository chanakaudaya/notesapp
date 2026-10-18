import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NoteStatus } from '@/types'

interface AppStore {
  activeProfileId: string | null
  setActiveProfileId: (id: string | null) => void

  activeStatus: NoteStatus
  setActiveStatus: (status: NoteStatus) => void

  activeCategoryId: string | null
  setActiveCategoryId: (id: string | null) => void

  activeTagId: string | null
  setActiveTagId: (id: string | null) => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  selectedNoteId: string | null
  setSelectedNoteId: (id: string | null) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  darkMode: boolean
  toggleDarkMode: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfileId: (id) => set({ activeProfileId: id, selectedNoteId: null }),

      activeStatus: 'Active',
      setActiveStatus: (status) => set({ activeStatus: status, selectedNoteId: null, activeCategoryId: null, activeTagId: null }),

      activeCategoryId: null,
      setActiveCategoryId: (id) => set({ activeCategoryId: id, activeTagId: null }),

      activeTagId: null,
      setActiveTagId: (id) => set({ activeTagId: id, activeCategoryId: null }),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      selectedNoteId: null,
      setSelectedNoteId: (id) => set({ selectedNoteId: id }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: 'notes-app-store',
      partialize: (s) => ({
        activeProfileId: s.activeProfileId,
        darkMode: s.darkMode,
        sidebarOpen: s.sidebarOpen,
      }),
    }
  )
)
