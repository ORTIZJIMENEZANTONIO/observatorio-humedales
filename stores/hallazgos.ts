import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Hallazgo, ComparativoCostos } from '~/types'
import { hallazgos as mockHallazgos, comparativoCostos as mockCostos } from '~/data/hallazgos'

const STORAGE_KEY = 'obs-hallazgos-overrides'

function loadOverrides(): Record<number, { visible?: boolean; archivado?: boolean }> {
  if (typeof localStorage === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function saveOverrides(overrides: Record<number, { visible?: boolean; archivado?: boolean }>) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function applyOverrides(items: Hallazgo[]): Hallazgo[] {
  const overrides = loadOverrides()
  return items.map(h => {
    const ov = overrides[h.id]
    return ov ? { ...h, ...ov } : h
  })
}

export const useHallazgosStore = defineStore('hallazgos', () => {
  const hallazgos = ref<Hallazgo[]>(applyOverrides(mockHallazgos.map(h => ({ ...h, recomendacion: { ...h.recomendacion } }))))
  const comparativoCostos = ref<ComparativoCostos[]>(mockCostos.map(c => ({ ...c })))
  const loading = ref(false)

  const publicHallazgos = computed(() =>
    hallazgos.value.filter(h => !h.archivado && h.visible !== false)
  )

  // ── CRUD hallazgos ──
  function addHallazgo(data: Partial<Hallazgo>): Hallazgo {
    const maxId = hallazgos.value.reduce((max, h) => Math.max(max, h.id), 0)
    const nuevo: Hallazgo = {
      id: maxId + 1,
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      evidencia: data.evidencia || [],
      impacto: data.impacto || 'medio',
      recomendacion: data.recomendacion || {
        titulo: '', descripcion: '', acciones: [], responsables: [], plazo: 'mediano',
      },
      visible: data.visible ?? true,
      archivado: data.archivado ?? false,
    }
    hallazgos.value = [...hallazgos.value, nuevo]
    return nuevo
  }

  function updateHallazgo(id: number, data: Partial<Hallazgo>): Hallazgo | null {
    const idx = hallazgos.value.findIndex(h => h.id === id)
    if (idx === -1) return null
    const current = hallazgos.value[idx]
    const updated: Hallazgo = {
      ...current,
      ...data,
      id,
      recomendacion: data.recomendacion
        ? { ...current.recomendacion, ...data.recomendacion }
        : current.recomendacion,
    }
    hallazgos.value = hallazgos.value.map(h => h.id === id ? updated : h)

    if ('visible' in data || 'archivado' in data) {
      const overrides = loadOverrides()
      overrides[id] = { ...overrides[id], ...(data.visible !== undefined ? { visible: data.visible } : {}), ...(data.archivado !== undefined ? { archivado: data.archivado } : {}) }
      saveOverrides(overrides)
    }
    return updated
  }

  function deleteHallazgo(id: number) {
    hallazgos.value = hallazgos.value.filter(h => h.id !== id)
  }

  function setHallazgos(items: Hallazgo[]) {
    hallazgos.value = applyOverrides(items)
  }

  return { hallazgos, publicHallazgos, comparativoCostos, loading, addHallazgo, updateHallazgo, deleteHallazgo, setHallazgos }
})
