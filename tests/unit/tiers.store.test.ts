import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTiersStore } from '~/stores/tiers'
import { tiersDefaults } from '~/data/tiers-defaults'

describe('Tiers Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initialization', () => {
    it('loads defaults when localStorage is empty', () => {
      const store = useTiersStore()
      expect(store.items.length).toBe(tiersDefaults.length)
    })

    it('exposes 5 visible tiers sorted by sortOrder', () => {
      const store = useTiersStore()
      expect(store.visibleTiers.length).toBe(5)
      const orders = store.visibleTiers.map(t => t.sortOrder)
      const sorted = [...orders].sort((a, b) => a - b)
      expect(orders).toEqual(sorted)
    })

    it('default slugs cover the 5 modes of participation', () => {
      const store = useTiersStore()
      const slugs = store.items.map(t => t.slug)
      expect(slugs).toContain('aprendiz')
      expect(slugs).toContain('observador')
      expect(slugs).toContain('caracterizador')
      expect(slugs).toContain('especialista')
      expect(slugs).toContain('custodio')
    })
  })

  describe('getTier', () => {
    it('returns the tier matching a slug', () => {
      const store = useTiersStore()
      const t = store.getTier('especialista')
      expect(t).toBeDefined()
      expect(t!.label).toBe('Especialista')
    })

    it('returns undefined for unknown slug', () => {
      const store = useTiersStore()
      expect(store.getTier('does-not-exist')).toBeUndefined()
    })
  })

  describe('tierForScore', () => {
    it('returns "aprendiz" for low scores', () => {
      const store = useTiersStore()
      expect(store.tierForScore(0)).toBe('aprendiz')
      expect(store.tierForScore(15)).toBe('aprendiz')
    })

    it('returns "observador" between 20 and 99', () => {
      const store = useTiersStore()
      expect(store.tierForScore(20)).toBe('observador')
      expect(store.tierForScore(99)).toBe('observador')
    })

    it('returns "caracterizador" between 100 and 299', () => {
      const store = useTiersStore()
      expect(store.tierForScore(100)).toBe('caracterizador')
      expect(store.tierForScore(299)).toBe('caracterizador')
    })

    it('returns "especialista" between 300 and 999', () => {
      const store = useTiersStore()
      expect(store.tierForScore(300)).toBe('especialista')
      expect(store.tierForScore(999)).toBe('especialista')
    })

    it('returns "custodio" for 1000+ (no upper bound)', () => {
      const store = useTiersStore()
      expect(store.tierForScore(1000)).toBe('custodio')
      expect(store.tierForScore(99999)).toBe('custodio')
    })
  })

  describe('CRUD', () => {
    it('addTier creates a new tier with auto-generated id', () => {
      const store = useTiersStore()
      const before = store.items.length
      const created = store.addTier({
        slug: 'embajador',
        label: 'Embajador',
        minScore: 2000,
        maxScore: null,
        color: 'primary',
        sortOrder: 6,
        visible: true,
        archived: false,
      })
      expect(created.id).toBeGreaterThan(0)
      expect(store.items.length).toBe(before + 1)
      expect(store.getTier('embajador')).toBeDefined()
    })

    it('updateTier patches a tier in place', () => {
      const store = useTiersStore()
      const aprendiz = store.getTier('aprendiz')!
      store.updateTier(aprendiz.id!, { label: 'Aprendiz Modificado' })
      expect(store.getTier('aprendiz')!.label).toBe('Aprendiz Modificado')
    })

    it('deleteTier soft-deletes (marks archived + invisible)', () => {
      const store = useTiersStore()
      const t = store.getTier('observador')!
      store.deleteTier(t.id!)
      const updated = store.items.find(x => x.id === t.id)!
      expect(updated.archived).toBe(true)
      expect(updated.visible).toBe(false)
      expect(store.visibleTiers.find(x => x.slug === 'observador')).toBeUndefined()
    })
  })

  describe('persistence', () => {
    it('saves changes to localStorage', () => {
      const store = useTiersStore()
      store.updateTier(store.getTier('aprendiz')!.id!, { label: 'Nuevo' })
      const raw = localStorage.getItem('obs-humedales-tiers')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      const aprendiz = parsed.find((t: any) => t.slug === 'aprendiz')
      expect(aprendiz.label).toBe('Nuevo')
    })
  })
})
