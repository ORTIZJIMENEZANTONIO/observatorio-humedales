import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tier } from '~/types'
import { tiersDefaults } from '~/data/tiers-defaults'

const STORAGE_KEY = 'obs-humedales-tiers'

function loadFromStorage(): Tier[] | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(items: Tier[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useTiersStore = defineStore('humedales-tiers', () => {
  const items = ref<Tier[]>(loadFromStorage() ?? tiersDefaults.map(t => ({ ...t })))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Solo tiers visibles, ordenados por sortOrder ascendente.
  const visibleTiers = computed(() =>
    [...items.value]
      .filter(t => t.visible !== false && !t.archived)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.minScore - b.minScore),
  )

  // Devuelve un tier por slug. Util para badges.
  function getTier(slug: string): Tier | undefined {
    return items.value.find(t => t.slug === slug)
  }

  function setTiers(newItems: Tier[]) {
    items.value = [...newItems]
    saveToStorage(items.value)
  }

  function addTier(tier: Omit<Tier, 'id'>): Tier {
    const maxId = items.value.reduce((m, t) => Math.max(m, t.id ?? 0), 0)
    const created: Tier = { id: maxId + 1, ...tier }
    items.value = [...items.value, created]
    saveToStorage(items.value)
    return created
  }

  function updateTier(id: number, patch: Partial<Tier>): Tier | undefined {
    let result: Tier | undefined
    items.value = items.value.map(t => {
      if (t.id !== id) return t
      result = { ...t, ...patch }
      return result
    })
    saveToStorage(items.value)
    return result
  }

  function deleteTier(id: number) {
    // Soft delete: marca como archivado en lugar de remover
    updateTier(id, { archived: true, visible: false })
  }

  // Recalcula el tier slug correspondiente a un score dado.
  function tierForScore(score: number): string {
    const sorted = visibleTiers.value
    for (const t of sorted) {
      if (score >= t.minScore && (t.maxScore === null || t.maxScore === undefined || score <= t.maxScore)) {
        return t.slug
      }
    }
    return sorted[0]?.slug ?? 'aprendiz'
  }

  return {
    items,
    loading,
    error,
    visibleTiers,
    getTier,
    setTiers,
    addTier,
    updateTier,
    deleteTier,
    tierForScore,
  }
})
