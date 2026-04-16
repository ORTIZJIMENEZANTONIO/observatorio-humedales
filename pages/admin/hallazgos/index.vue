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

const columns = [
  { key: 'id', label: 'ID', class: 'w-12' },
  { key: 'titulo', label: 'Título' },
  { key: 'impacto', label: 'Impacto', class: 'w-24' },
  { key: 'plazo', label: 'Plazo', class: 'w-24' },
]

const rows = computed(() =>
  store.hallazgos.map((h: any) => ({
    ...h,
    plazo: h.recomendacion?.plazo || '—',
  }))
)

function handleEdit(row: any) {
  navigateTo(`/admin/hallazgos/${row.id}`)
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
    </AdminDataTable>
  </div>
</template>
