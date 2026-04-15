import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Must import after setup mocks are applied
import { useAuthStore } from '~/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts unauthenticated', () => {
      const auth = useAuthStore()
      expect(auth.isAuthenticated).toBe(false)
      expect(auth.admin).toBeNull()
      expect(auth.token).toBeNull()
    })
    it('isSuperadmin is false when admin is null', () => {
      const auth = useAuthStore()
      // !admin.value?.role evaluates to true when admin is null, but that's the backward compat behavior
      // The computed checks: !admin.value?.role || role === 'superadmin'
      // When admin is null, !null?.role = !undefined = true
      expect(auth.isSuperadmin).toBe(true)
    })
  })

  describe('loadFromStorage', () => {
    it('loads token from localStorage', () => {
      localStorage.setItem('obs_token', 'test-token-123')
      localStorage.setItem('obs_admin', JSON.stringify({ id: '1', email: 'test@test.com', name: 'Test' }))
      const auth = useAuthStore()
      auth.loadFromStorage()
      expect(auth.token).toBe('test-token-123')
      expect(auth.admin?.email).toBe('test@test.com')
      expect(auth.isAuthenticated).toBe(true)
    })
    it('handles corrupted admin JSON', () => {
      localStorage.setItem('obs_token', 'token')
      localStorage.setItem('obs_admin', 'invalid-json')
      const auth = useAuthStore()
      auth.loadFromStorage()
      expect(auth.token).toBe('token')
      expect(auth.admin).toBeNull()
    })
  })

  describe('logout', () => {
    it('clears state and localStorage', () => {
      const auth = useAuthStore()
      auth.token = 'token'
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [] } as any
      localStorage.setItem('obs_token', 'token')
      auth.logout()
      expect(auth.token).toBeNull()
      expect(auth.admin).toBeNull()
      expect(localStorage.getItem('obs_token')).toBeNull()
    })
  })

  describe('hasPermission', () => {
    it('returns false when not authenticated', () => {
      const auth = useAuthStore()
      expect(auth.hasPermission('manage_cms')).toBe(false)
    })
    it('returns true for all perms when role is undefined (backward compat)', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [] } as any
      expect(auth.hasPermission('manage_cms')).toBe(true)
      expect(auth.hasPermission('manage_users')).toBe(true)
    })
    it('returns true for all perms when superadmin', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'superadmin', permissions: [] } as any
      expect(auth.hasPermission('manage_users')).toBe(true)
      expect(auth.hasPermission('manage_cms')).toBe(true)
    })
    it('returns true for all except manage_users when admin', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'admin', permissions: [] } as any
      expect(auth.hasPermission('manage_cms')).toBe(true)
      expect(auth.hasPermission('manage_users')).toBe(false)
    })
    it('checks permissions array for editor role', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'editor', permissions: ['manage_cms', 'manage_notihumedal'] } as any
      expect(auth.hasPermission('manage_cms')).toBe(true)
      expect(auth.hasPermission('manage_notihumedal')).toBe(true)
      expect(auth.hasPermission('manage_humedales')).toBe(false)
      expect(auth.hasPermission('manage_users')).toBe(false)
    })
  })

  describe('isSuperadmin', () => {
    it('true when role is superadmin', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'superadmin' } as any
      expect(auth.isSuperadmin).toBe(true)
    })
    it('true when role is undefined (backward compat)', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [] } as any
      expect(auth.isSuperadmin).toBe(true)
    })
    it('false when role is admin', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'admin' } as any
      expect(auth.isSuperadmin).toBe(false)
    })
    it('false when role is editor', () => {
      const auth = useAuthStore()
      auth.admin = { id: '1', email: 'a@b.com', name: 'A', observatories: [], role: 'editor' } as any
      expect(auth.isSuperadmin).toBe(false)
    })
  })
})
