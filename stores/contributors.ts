import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contributor } from '~/types'
import { contributorsDefaults } from '~/data/tiers-defaults'

const STORAGE_KEY = 'obs-humedales-contributors'

function loadFromStorage(): Contributor[] | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(items: Contributor[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useContributorsStore = defineStore('humedales-contributors', () => {
  const items = ref<Contributor[]>(loadFromStorage() ?? contributorsDefaults.map(c => ({ ...c })))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros del listado admin.
  const search = ref('')
  const filterRole = ref<string>('all')
  const filterTier = ref<string>('all')
  const filterVerified = ref<'all' | 'yes' | 'no'>('all')

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return items.value.filter(c => {
      if (c.archived) return false
      if (q && !`${c.displayName} ${c.handle} ${c.affiliation || ''}`.toLowerCase().includes(q)) return false
      if (filterRole.value !== 'all' && c.role !== filterRole.value) return false
      if (filterTier.value !== 'all' && c.tier !== filterTier.value) return false
      if (filterVerified.value === 'yes' && !c.verified) return false
      if (filterVerified.value === 'no' && c.verified) return false
      return true
    })
  })

  // Solo perfiles publicos verificados (para la pagina publica).
  const publicContributors = computed(() =>
    items.value.filter(c => !c.archived && c.visible !== false && c.publicProfile),
  )

  function getContributor(id: number): Contributor | undefined {
    return items.value.find(c => c.id === id)
  }

  function setContributors(newItems: Contributor[]) {
    items.value = [...newItems]
    saveToStorage(items.value)
  }

  function addContributor(c: Partial<Omit<Contributor, 'id'>> & Pick<Contributor, 'displayName' | 'handle' | 'role'>): Contributor {
    const maxId = items.value.reduce((m, x) => Math.max(m, x.id ?? 0), 0)
    const defaults = {
      reputationScore: 0,
      validatedContributions: 0,
      rejectedContributions: 0,
      acceptanceRate: 0,
      averageQuality: 0,
      consecutiveMonthsActive: 0,
      publicProfile: true,
      verified: false,
      tier: 'aprendiz' as const,
      visible: true,
      archived: false,
      joinedAt: new Date().toISOString().slice(0, 10),
    }
    const created: Contributor = {
      ...defaults,
      ...c,
      id: maxId + 1,
    }
    items.value = [...items.value, created]
    saveToStorage(items.value)
    return created
  }

  function updateContributor(id: number, patch: Partial<Contributor>): Contributor | undefined {
    let result: Contributor | undefined
    items.value = items.value.map(c => {
      if (c.id !== id) return c
      result = { ...c, ...patch }
      return result
    })
    saveToStorage(items.value)
    return result
  }

  function deleteContributor(id: number) {
    updateContributor(id, { archived: true, visible: false })
  }

  function clearFilters() {
    search.value = ''
    filterRole.value = 'all'
    filterTier.value = 'all'
    filterVerified.value = 'all'
  }

  return {
    items,
    loading,
    error,
    search,
    filterRole,
    filterTier,
    filterVerified,
    filtered,
    publicContributors,
    getContributor,
    setContributors,
    addContributor,
    updateContributor,
    deleteContributor,
    clearFilters,
  }
})
