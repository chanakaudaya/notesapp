/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'

// Mock Tauri's invoke for tests
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}))
