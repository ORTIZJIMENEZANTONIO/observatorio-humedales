import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Hallazgo, ComparativoCostos } from '~/types'
import { hallazgos as mockHallazgos, comparativoCostos as mockCostos } from '~/data/hallazgos'

export const useHallazgosStore = defineStore('hallazgos', () => {
  const hallazgos = ref<Hallazgo[]>(mockHallazgos.map(h => ({ ...h, recomendacion: { ...h.recomendacion } })))
  const comparativoCostos = ref<ComparativoCostos[]>(mockCostos.map(c => ({ ...c })))
  const loading = ref(false)

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
    return updated
  }

  function deleteHallazgo(id: number) {
    hallazgos.value = hallazgos.value.filter(h => h.id !== id)
  }

  function setHallazgos(items: Hallazgo[]) {
    hallazgos.value = items
  }

  return { hallazgos, comparativoCostos, loading, addHallazgo, updateHallazgo, deleteHallazgo, setHallazgos }
})
