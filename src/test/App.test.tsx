import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Tauri
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue([]),
}))

// Mock zustand store persistence
vi.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

import App from '@/App'

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>)
}

describe('App', () => {
  it('renders profile selection when no profile is active', async () => {
    const { useAppStore } = await import('@/store/useAppStore')
    useAppStore.setState({ activeProfileId: null })

    renderWithProviders(<App />)
    // Wait for async profile loading to resolve (returns empty array → show create form)
    await waitFor(() => {
      expect(screen.getByText('Notes App')).toBeInTheDocument()
    })
  })
})
