import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Humedal } from '~/types'
import { humedales as mockData } from '~/data/mock-humedales'

export const useHumedalesStore = defineStore('humedales', () => {
  const humedales = ref<Humedal[]>(mockData.map(h => ({ ...h })))
  const loading = ref(false)
  const searchQuery = ref('')
  const filterAlcaldia = ref('')
  const filterTipo = ref('')
  const filterEstado = ref('')

  const filtered = computed(() => {
    // Always return a new array to guarantee reactivity on filter changes
    return humedales.value.filter((h) => {
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

  const alcaldias = computed(() => {
    const set = new Set(humedales.value.map((h) => h.alcaldia))
    return Array.from(set).sort()
  })

  const totalSuperficie = computed(() =>
    humedales.value.reduce((sum, h) => sum + (h.superficie || 0), 0)
  )

  const totalCount = computed(() => humedales.value.length)

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
    }
    humedales.value = [...humedales.value, nuevo]
    return nuevo
  }

  function updateHumedal(id: number, data: Partial<Humedal>) {
    const idx = humedales.value.findIndex(h => h.id === id)
    if (idx === -1) return null
    const updated = { ...humedales.value[idx], ...data, id }
    humedales.value = humedales.value.map(h => h.id === id ? updated : h)
    return updated
  }

  function deleteHumedal(id: number) {
    humedales.value = humedales.value.filter(h => h.id !== id)
  }

  return { humedales, loading, searchQuery, filterAlcaldia, filterTipo, filterEstado, filtered, hasActiveFilters, clearFilters, alcaldias, totalSuperficie, totalCount, addHumedal, updateHumedal, deleteHumedal }
})
