<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string

const items = ref<any[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await apiFetch(`/observatory/${obs}/admin/hallazgos`)
    items.value = res.items || []
  } catch {
    // Fallback to local data
    const { hallazgos } = await import('~/data/hallazgos')
    items.value = hallazgos.map((h: any) => ({ ...h }))
  }
  loading.value = false
}
onMounted(load)

const columns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'titulo', label: 'Título' },
  { key: 'impacto', label: 'Impacto' },
  { key: 'plazo', label: 'Plazo' },
]

const rows = computed(() =>
  items.value.map((h: any) => ({
    ...h,
    plazo: h.recomendacion?.plazo || '—',
  }))
)

// ── Form state ──
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  titulo: '', descripcion: '', impacto: 'medio' as string,
  evidencia: '' as string, // comma-separated, parsed on save
  recomendacion: {
    titulo: '', descripcion: '', plazo: 'mediano' as string,
    acciones: '' as string, responsables: '' as string, costoEstimado: '',
  },
})

function resetForm() {
  Object.assign(form, {
    titulo: '', descripcion: '', impacto: 'medio', evidencia: '',
    recomendacion: { titulo: '', descripcion: '', plazo: 'mediano', acciones: '', responsables: '', costoEstimado: '' },
  })
  editingId.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function handleEdit(row: any) {
  editingId.value = row.id
  Object.assign(form, {
    titulo: row.titulo || '', descripcion: row.descripcion || '', impacto: row.impacto || 'medio',
    evidencia: (row.evidencia || []).join(', '),
    recomendacion: {
      titulo: row.recomendacion?.titulo || '', descripcion: row.recomendacion?.descripcion || '',
      plazo: row.recomendacion?.plazo || 'mediano',
      acciones: (row.recomendacion?.acciones || []).join(', '),
      responsables: (row.recomendacion?.responsables || []).join(', '),
      costoEstimado: row.recomendacion?.costoEstimado || '',
    },
  })
  showForm.value = true
}

async function saveForm() {
  const body = {
    titulo: form.titulo,
    descripcion: form.descripcion,
    impacto: form.impacto,
    evidencia: form.evidencia ? form.evidencia.split(',').map(s => s.trim()).filter(Boolean) : [],
    recomendacion: {
      titulo: form.recomendacion.titulo,
      descripcion: form.recomendacion.descripcion,
      plazo: form.recomendacion.plazo,
      acciones: form.recomendacion.acciones ? form.recomendacion.acciones.split(',').map(s => s.trim()).filter(Boolean) : [],
      responsables: form.recomendacion.responsables ? form.recomendacion.responsables.split(',').map(s => s.trim()).filter(Boolean) : [],
      costoEstimado: form.recomendacion.costoEstimado || undefined,
    },
  }
  try {
    if (editingId.value) {
      await apiFetch(`/observatory/${obs}/admin/hallazgos/${editingId.value}`, { method: 'PATCH', body })
    } else {
      await apiFetch(`/observatory/${obs}/admin/hallazgos`, { method: 'POST', body })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar')
  }
}

async function handleDelete(row: any) {
  if (!confirm(`Eliminar "${row.titulo}"?`)) return
  try {
    await apiFetch(`/observatory/${obs}/admin/hallazgos/${row.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al eliminar')
  }
}
</script>

<template>
  <div>
    <!-- Context banner (not part of pipeline) -->
    <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5 flex-shrink-0 text-eco" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span class="text-sm font-semibold text-ink">Contenido editorial</span>
      </div>
      <p class="mt-2 text-sm text-slate-custom">Hallazgos y recomendaciones derivados del analisis del inventario. Contenido editorial para tomadores de decisiones.</p>
    </div>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-xl sm:text-2xl font-semibold text-ink">Hallazgos y recomendaciones</h2>
      <button class="btn-primary flex-shrink-0" @click="openCreate">+ Agregar</button>
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
          class="badge-primary text-xs"
          :class="{
            '!bg-red-100 !text-red-800': value === 'critico',
            '!bg-orange-100 !text-orange-800': value === 'alto',
            '!bg-yellow-100 !text-yellow-800': value === 'medio',
          }"
        >
          {{ value }}
        </span>
      </template>
    </AdminDataTable>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showForm = false">
        <div class="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 animate-scale-in">
          <h3 class="mb-4 text-lg font-semibold text-ink">
            {{ editingId ? 'Editar hallazgo' : 'Agregar hallazgo' }}
          </h3>
          <form class="space-y-3" @submit.prevent="saveForm">
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Título *</label>
              <input v-model="form.titulo" class="input w-full" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Descripción *</label>
              <textarea v-model="form.descripcion" class="input w-full" rows="3" required />
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Impacto *</label>
                <select v-model="form.impacto" class="select w-full">
                  <option value="critico">Crítico</option>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Evidencia (separada por comas)</label>
                <input v-model="form.evidencia" class="input w-full" placeholder="dato1, dato2" />
              </div>
            </div>

            <hr class="my-2 border-gray-200" />
            <p class="text-sm font-semibold text-ink">Recomendación</p>

            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Título *</label>
              <input v-model="form.recomendacion.titulo" class="input w-full" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Descripción *</label>
              <textarea v-model="form.recomendacion.descripcion" class="input w-full" rows="2" required />
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Plazo *</label>
                <select v-model="form.recomendacion.plazo" class="select w-full">
                  <option value="corto">Corto</option>
                  <option value="mediano">Mediano</option>
                  <option value="largo">Largo</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Costo estimado</label>
                <input v-model="form.recomendacion.costoEstimado" class="input w-full" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Acciones (separadas por comas)</label>
              <input v-model="form.recomendacion.acciones" class="input w-full" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Responsables (separados por comas)</label>
              <input v-model="form.recomendacion.responsables" class="input w-full" />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" class="btn-ghost" @click="showForm = false">Cancelar</button>
              <button type="submit" class="btn-primary">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
      </Transition>
    </Teleport>
  </div>
</template>
