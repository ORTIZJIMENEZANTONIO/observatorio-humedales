import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Humedal } from '~/types'
import { humedales as mockData } from '~/data/mock-humedales'

// ── LocalStorage persistence for admin overrides ──
const STORAGE_KEY = 'obs-humedales-overrides'

function loadOverrides(): Record<number, { visible?: boolean; archivado?: boolean }> {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveOverrides(overrides: Record<number, { visible?: boolean; archivado?: boolean }>) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function applyOverrides(items: Humedal[]): Humedal[] {
  const overrides = loadOverrides()
  return items.map(h => {
    const ov = overrides[h.id]
    return ov ? { ...h, ...ov } : h
  })
}

export const useHumedalesStore = defineStore('humedales', () => {
  const humedales = ref<Humedal[]>(applyOverrides(mockData.map(h => ({ ...h }))))
  const loading = ref(false)
  const searchQuery = ref('')
  const filterAlcaldia = ref('')
  const filterTipo = ref('')
  const filterEstado = ref('')

  const filtered = computed(() => {
    return humedales.value.filter((h) => {
      if (h.archivado) return false
      if (h.visible === false) return false
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        if (
          !h.nombre.toLowerCase().includes(q) &&
          !h.alcaldia.toLowerCase().includes(q) &&
          !h.funcionPrincipal.toLowerCase().includes(q)
        ) return false
      }
      if (filterAlcaldia.value && h.alcaldia !== filterAlcaldia.value) return false
      if (filterTipo.value && h.tipoHumedal !== filterTipo.value) return false
      if (filterEstado.value && h.estado !== filterEstado.value) return false
      return true
    })
  })

  const hasActiveFilters = computed(() => !!searchQuery.value || !!filterAlcaldia.value || !!filterTipo.value || !!filterEstado.value)

  function clearFilters() {
    searchQuery.value = ''
    filterAlcaldia.value = ''
    filterTipo.value = ''
    filterEstado.value = ''
  }

  const publicHumedales = computed(() =>
    humedales.value.filter(h => !h.archivado && h.visible !== false)
  )

  const alcaldias = computed(() => {
    const set = new Set(publicHumedales.value.map((h) => h.alcaldia))
    return Array.from(set).sort()
  })

  const totalSuperficie = computed(() =>
    publicHumedales.value.reduce((sum, h) => sum + (h.superficie || 0), 0)
  )

  const totalCount = computed(() => publicHumedales.value.length)

  // ── CRUD operations ──
  function addHumedal(data: Partial<Humedal>) {
    const maxId = humedales.value.reduce((max, h) => Math.max(max, h.id), 0)
    const nuevo: Humedal = {
      id: maxId + 1,
      nombre: data.nombre || '',
      alcaldia: data.alcaldia as any || 'Miguel Hidalgo',
      ubicacion: data.ubicacion || '',
      tipoHumedal: data.tipoHumedal || 'ha_fws',
      tipoVegetacion: data.tipoVegetacion || [],
      funcionPrincipal: data.funcionPrincipal || '',
      superficie: data.superficie,
      volumen: data.volumen,
      capacidadTratamiento: data.capacidadTratamiento,
      anioImplementacion: data.anioImplementacion || '',
      vegetacion: data.vegetacion || [],
      sustrato: data.sustrato || '',
      usoAgua: data.usoAgua || '',
      serviciosEcosistemicos: data.serviciosEcosistemicos || [],
      serviciosDescripcion: data.serviciosDescripcion || [],
      monitoreo: data.monitoreo || '',
      estado: data.estado || 'activo',
      lat: data.lat || 19.4326,
      lng: data.lng || -99.1332,
      imagen: data.imagen,
      fuente: data.fuente,
      fuenteImagen: data.fuenteImagen,
      visible: data.visible ?? true,
      archivado: data.archivado ?? false,
    }
    humedales.value = [...humedales.value, nuevo]
    return nuevo
  }

  function updateHumedal(id: number, data: Partial<Humedal>) {
    const idx = humedales.value.findIndex(h => h.id === id)
    if (idx === -1) return null
    const updated = { ...humedales.value[idx], ...data, id }
    humedales.value = humedales.value.map(h => h.id === id ? updated : h)

    // Persist visible/archivado overrides to localStorage
    if ('visible' in data || 'archivado' in data) {
      const overrides = loadOverrides()
      overrides[id] = { ...overrides[id], ...(data.visible !== undefined ? { visible: data.visible } : {}), ...(data.archivado !== undefined ? { archivado: data.archivado } : {}) }
      saveOverrides(overrides)
    }
    return updated
  }

  function setHumedales(items: Humedal[]) {
    humedales.value = applyOverrides(items)
  }

  function deleteHumedal(id: number) {
    humedales.value = humedales.value.filter(h => h.id !== id)
  }

  return { humedales, publicHumedales, loading, setHumedales, searchQuery, filterAlcaldia, filterTipo, filterEstado, filtered, hasActiveFilters, clearFilters, alcaldias, totalSuperficie, totalCount, addHumedal, updateHumedal, deleteHumedal }
})
