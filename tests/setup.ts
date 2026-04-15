import { vi } from 'vitest'
import { ref, computed, reactive, watch, onMounted, onBeforeUnmount } from 'vue'

// Mock Nuxt auto-imports
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('reactive', reactive)
vi.stubGlobal('watch', watch)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onBeforeUnmount', onBeforeUnmount)
vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useRoute', () => ({ path: '/', params: {}, query: {} }))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { dataMode: 'mock', apiBaseUrl: 'http://localhost:3003/api/v1', observatory: 'humedales' },
}))
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('$fetch', vi.fn())

// Mock localStorage
const store: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
})

// Mock import.meta
vi.stubGlobal('import', { meta: { server: false, client: true } })
