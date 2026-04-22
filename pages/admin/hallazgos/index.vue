<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const store = useHallazgosStore()
const { check: checkBackend } = useBackendStatus()

const loading = ref(true)
const isOnline = ref(false)

async function load() {
  loading.value = true
  isOnline.value = await checkBackend()
  if (isOnline.value) {
    try {
      const res = await apiFetch(`/observatory/${obs}/admin/hallazgos`)
      const items = (res as any).items || (res as any).data || []
      if (items.length) store.setHallazgos(items)
    } catch { /* use store fallback */ }
  }
  loading.value = false
}
onMounted(load)

// ── Advanced filters ──
const advFilter = reactive({ impacto: '', plazo: '', visibilidad: '', archivo: '' })
const hasAdvFilters = computed(() => Object.values(advFilter).some(v => !!v))
function clearAdvFilters() { Object.assign(advFilter, { impacto: '', plazo: '', visibilidad: '', archivo: '' }) }

const columns = [
  { key: 'id', label: 'ID', class: 'w-12' },
  { key: 'titulo', label: 'Título' },
  { key: 'impacto', label: 'Impacto', class: 'w-24' },
  { key: 'plazo', label: 'Plazo', class: 'w-24' },
  { key: 'visible', label: 'Visible', class: 'w-20 text-center' },
  { key: 'archivado', label: 'Archivado', class: 'w-20 text-center' },
]

const rows = computed(() => {
  return store.hallazgos.filter((h: any) => {
    if (advFilter.impacto && h.impacto !== advFilter.impacto) return false
    if (advFilter.plazo && h.recomendacion?.plazo !== advFilter.plazo) return false
    if (advFilter.visibilidad === 'visible' && (h.visible === false)) return false
    if (advFilter.visibilidad === 'oculto' && (h.visible !== false)) return false
    if (advFilter.archivo === 'activo' && h.archivado) return false
    if (advFilter.archivo === 'archivado' && !h.archivado) return false
    return true
  }).map((h: any) => ({
    ...h,
    plazo: h.recomendacion?.plazo || '—',
  }))
})

function handleEdit(row: any) {
  navigateTo(`/admin/hallazgos/${row.id}`)
}

async function toggleVisible(row: any) {
  const newVal = !(row.visible ?? true)
  store.updateHallazgo(row.id, { visible: newVal })
  if (isOnline.value) {
    try { await apiFetch(`/observatory/${obs}/admin/hallazgos/${row.id}`, { method: 'PATCH', body: { visible: newVal } }) } catch {}
  }
}

async function toggleArchivado(row: any) {
  const newVal = !row.archivado
  store.updateHallazgo(row.id, { archivado: newVal })
  if (isOnline.value) {
    try { await apiFetch(`/observatory/${obs}/admin/hallazgos/${row.id}`, { method: 'PATCH', body: { archivado: newVal } }) } catch {}
  }
}

async function handleDelete(row: any) {
  if (!confirm(`¿Eliminar "${row.titulo}"?`)) return
  try {
    if (isOnline.value) {
      await apiFetch(`/observatory/${obs}/admin/hallazgos/${row.id}`, { method: 'DELETE' })
      await load()
    } else {
      store.deleteHallazgo(row.id)
    }
  } catch {
    store.deleteHallazgo(row.id)
  }
}
</script>

<template>
  <div>
    <!-- Context banner -->
    <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5 flex-shrink-0 text-eco" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span class="text-sm font-semibold text-ink">Contenido editorial</span>
      </div>
      <p class="mt-2 text-sm text-slate-custom">
        Hallazgos y recomendaciones del inventario. Se muestran en la página pública /analisis/hallazgos.
        <span v-if="!isOnline" class="ml-1 text-accent font-medium">(modo local)</span>
      </p>
    </div>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-xl sm:text-2xl font-semibold text-ink">Hallazgos y recomendaciones</h2>
        <p class="mt-1 text-sm text-slate-custom">{{ store.hallazgos.length }} hallazgos registrados</p>
      </div>
      <NuxtLink to="/admin/hallazgos/nuevo" class="btn-primary flex-shrink-0">+ Agregar</NuxtLink>
    </div>

    <AdminDataTable
      :columns="columns"
      :rows="rows"
      :loading="loading"
      search-placeholder="Buscar hallazgo..."
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #filters>
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <select v-model="advFilter.impacto" class="select !py-1.5 text-xs max-w-[150px]">
            <option value="">Todos los impactos</option>
            <option value="critico">Crítico</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
          </select>
          <select v-model="advFilter.plazo" class="select !py-1.5 text-xs max-w-[150px]">
            <option value="">Todos los plazos</option>
            <option value="corto">Corto</option>
            <option value="mediano">Mediano</option>
            <option value="largo">Largo</option>
          </select>
          <select v-model="advFilter.visibilidad" class="select !py-1.5 text-xs max-w-[140px]">
            <option value="">Visibilidad: todos</option>
            <option value="visible">Solo visibles</option>
            <option value="oculto">Solo ocultos</option>
          </select>
          <select v-model="advFilter.archivo" class="select !py-1.5 text-xs max-w-[140px]">
            <option value="">Archivo: todos</option>
            <option value="activo">Solo activos</option>
            <option value="archivado">Solo archivados</option>
          </select>
          <button v-if="hasAdvFilters" @click="clearAdvFilters" class="btn-ghost !py-1 text-xs">Limpiar filtros</button>
        </div>
      </template>
      <template #cell-impacto="{ value }">
        <span
          class="badge text-[10px]"
          :class="{
            'bg-alert/10 text-alert': value === 'critico',
            'bg-accent/10 text-accent-dark': value === 'alto',
            'bg-secondary/10 text-secondary-dark': value === 'medio',
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-plazo="{ value }">
        <span
          class="badge text-[10px]"
          :class="{
            'badge-eco': value === 'corto',
            'badge-secondary': value === 'mediano',
            'badge-primary': value === 'largo',
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-visible="{ row }">
        <button
          @click.stop="toggleVisible(row)"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          :class="(row.visible ?? true) ? 'text-eco hover:bg-eco/10' : 'text-gray-300 hover:bg-gray-100'"
          :title="(row.visible ?? true) ? 'Visible — clic para ocultar' : 'Oculto — clic para mostrar'"
        >
          <svg v-if="row.visible ?? true" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
        </button>
      </template>
      <template #cell-archivado="{ row }">
        <button
          @click.stop="toggleArchivado(row)"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          :class="row.archivado ? 'text-accent hover:bg-accent/10' : 'text-gray-300 hover:bg-gray-100'"
          :title="row.archivado ? 'Archivado — clic para restaurar' : 'Activo — clic para archivar'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        </button>
      </template>
    </AdminDataTable>
  </div>
</template>
