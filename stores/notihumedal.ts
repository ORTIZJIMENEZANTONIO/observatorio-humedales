import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ArticuloNotihumedal } from '~/types'
import { articulos as mockData } from '~/data/notihumedal'

export const useNotihumedalStore = defineStore('notihumedal', () => {
  const articulos = ref<ArticuloNotihumedal[]>(mockData.map(a => ({ ...a })))
  const loading = ref(false)
  const searchQuery = ref('')

  const filtered = computed(() => {
    if (!searchQuery.value) return articulos.value
    const q = searchQuery.value.toLowerCase()
    return articulos.value.filter(a =>
      a.titulo.toLowerCase().includes(q) ||
      a.resumen.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    )
  })

  // ── CRUD operations ──
  function addArticulo(data: Partial<ArticuloNotihumedal>): ArticuloNotihumedal {
    const maxId = articulos.value.reduce((max, a) => Math.max(max, a.id), 0)
    const slug = data.slug || (data.titulo || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const nuevo: ArticuloNotihumedal = {
      id: maxId + 1,
      slug,
      titulo: data.titulo || '',
      fecha: data.fecha || new Date().toISOString().slice(0, 10),
      resumen: data.resumen || '',
      contenido: data.contenido || '',
      imagen: data.imagen,
      fuenteImagen: data.fuenteImagen,
      autor: data.autor || 'Observatorio de Humedales Artificiales CDMX',
      tags: data.tags || [],
    }
    articulos.value = [...articulos.value, nuevo]
    return nuevo
  }

  function updateArticulo(id: number, data: Partial<ArticuloNotihumedal>): ArticuloNotihumedal | null {
    const idx = articulos.value.findIndex(a => a.id === id)
    if (idx === -1) return null
    const updated = { ...articulos.value[idx], ...data, id }
    if (data.titulo && !data.slug) {
      updated.slug = data.titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    articulos.value = articulos.value.map(a => a.id === id ? updated : a)
    return updated
  }

  function deleteArticulo(id: number) {
    articulos.value = articulos.value.filter(a => a.id !== id)
  }

  function setArticulos(items: ArticuloNotihumedal[]) {
    articulos.value = items
  }

  return { articulos, loading, searchQuery, filtered, addArticulo, updateArticulo, deleteArticulo, setArticulos }
})
