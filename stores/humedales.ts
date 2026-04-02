import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Humedal } from '~/types'
import { humedales as mockData } from '~/data/mock-humedales'

export const useHumedalesStore = defineStore('humedales', () => {
  const humedales = ref<Humedal[]>(mockData)
  const loading = ref(false)
  const searchQuery = ref('')
  const filterAlcaldia = ref('')
  const filterTipo = ref('')

  const filtered = computed(() => {
    let result = humedales.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (h) =>
          h.nombre.toLowerCase().includes(q) ||
          h.alcaldia.toLowerCase().includes(q) ||
          h.funcionPrincipal.toLowerCase().includes(q)
      )
    }
    if (filterAlcaldia.value) {
      result = result.filter((h) => h.alcaldia === filterAlcaldia.value)
    }
    if (filterTipo.value) {
      result = result.filter((h) => h.tipoHumedal === filterTipo.value)
    }
    return result
  })

  const alcaldias = computed(() => {
    const set = new Set(humedales.value.map((h) => h.alcaldia))
    return Array.from(set).sort()
  })

  const totalSuperficie = computed(() =>
    humedales.value.reduce((sum, h) => sum + (h.superficie || 0), 0)
  )

  const totalCount = computed(() => humedales.value.length)

  return { humedales, loading, searchQuery, filterAlcaldia, filterTipo, filtered, alcaldias, totalSuperficie, totalCount }
})
