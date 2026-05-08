import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContributorsStore } from '~/stores/contributors'
import { contributorsDefaults } from '~/data/tiers-defaults'

describe('Contributors Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initialization', () => {
    it('loads defaults when localStorage is empty', () => {
      const store = useContributorsStore()
      expect(store.items.length).toBe(contributorsDefaults.length)
    })

    it('exposes only public + visible contributors via publicContributors', () => {
      const store = useContributorsStore()
      // todos los seeds estan public + visible + verified
      expect(store.publicContributors.length).toBe(contributorsDefaults.length)
    })
  })

  describe('addContributor', () => {
    it('creates with required fields and applies defaults', () => {
      const store = useContributorsStore()
      const before = store.items.length
      const created = store.addContributor({
        displayName: 'Ana López',
        handle: 'ana-lopez',
        role: 'estudiante',
      })
      expect(created.id).toBeGreaterThan(0)
      expect(store.items.length).toBe(before + 1)
      expect(created.tier).toBe('aprendiz')
      expect(created.reputationScore).toBe(0)
      expect(created.publicProfile).toBe(true)
      expect(created.verified).toBe(false)
      expect(created.joinedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('respects passed-in overrides', () => {
      const store = useContributorsStore()
      const created = store.addContributor({
        displayName: 'Pedro Gómez',
        handle: 'pedro-g',
        role: 'investigador',
        tier: 'especialista',
        reputationScore: 500,
        verified: true,
      })
      expect(created.tier).toBe('especialista')
      expect(created.reputationScore).toBe(500)
      expect(created.verified).toBe(true)
    })
  })

  describe('updateContributor', () => {
    it('patches a contributor and recomputes acceptance', () => {
      const store = useContributorsStore()
      const c = store.items[0]
      store.updateContributor(c.id, {
        validatedContributions: 10,
        rejectedContributions: 2,
        acceptanceRate: 10 / 12,
      })
      const updated = store.getContributor(c.id)!
      expect(updated.validatedContributions).toBe(10)
      expect(updated.rejectedContributions).toBe(2)
      expect(updated.acceptanceRate).toBeCloseTo(10 / 12, 3)
    })
  })

  describe('deleteContributor', () => {
    it('soft-deletes (archives + hides)', () => {
      const store = useContributorsStore()
      const id = store.items[0].id
      store.deleteContributor(id)
      const item = store.items.find(x => x.id === id)!
      expect(item.archived).toBe(true)
      expect(item.visible).toBe(false)
      expect(store.publicContributors.find(x => x.id === id)).toBeUndefined()
    })
  })

  describe('filters', () => {
    it('filters by role', () => {
      const store = useContributorsStore()
      store.filterRole = 'institucion'
      const result = store.filtered
      expect(result.every(c => c.role === 'institucion')).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('filters by tier', () => {
      const store = useContributorsStore()
      store.filterTier = 'custodio'
      expect(store.filtered.every(c => c.tier === 'custodio')).toBe(true)
    })

    it('filters by verified yes/no', () => {
      const store = useContributorsStore()
      store.filterVerified = 'yes'
      expect(store.filtered.every(c => c.verified)).toBe(true)
      store.filterVerified = 'no'
      expect(store.filtered.every(c => !c.verified)).toBe(true)
    })

    it('searches by displayName, handle or affiliation', () => {
      const store = useContributorsStore()
      store.search = 'gaia'
      expect(store.filtered.length).toBe(1)
      expect(store.filtered[0].handle).toBe('gaia-fq-unam')
    })

    it('clearFilters resets all filters', () => {
      const store = useContributorsStore()
      store.search = 'foo'
      store.filterRole = 'investigador'
      store.filterVerified = 'no'
      store.clearFilters()
      expect(store.search).toBe('')
      expect(store.filterRole).toBe('all')
      expect(store.filterVerified).toBe('all')
    })
  })
})
