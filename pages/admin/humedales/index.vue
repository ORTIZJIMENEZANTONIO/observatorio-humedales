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
    const res = await apiFetch(`/observatory/${obs}/admin/humedales`)
    items.value = res.items || []
  } catch {
    // Fallback: load from local store if API unavailable
    const store = useHumedalesStore()
    items.value = store.humedales.map((h: any) => ({ ...h }))
  }
  loading.value = false
}
onMounted(load)

const columns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'alcaldia', label: 'Alcaldía' },
  { key: 'tipoHumedal', label: 'Tipo' },
  { key: 'superficie', label: 'm²', class: 'text-right tabular-nums' },
  { key: 'estado', label: 'Estado' },
  { key: 'anioImplementacion', label: 'Año' },
]

// ── Form state ──
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  nombre: '', alcaldia: '', ubicacion: '', tipoHumedal: 'conservacion',
  funcionPrincipal: '', superficie: null as number | null, volumen: null as number | null,
  capacidadTratamiento: '', anioImplementacion: '', sustrato: '', usoAgua: '',
  monitoreo: '', estado: 'activo', lat: 19.4326, lng: -99.1332, imagen: '',
})

function resetForm() {
  Object.assign(form, {
    nombre: '', alcaldia: '', ubicacion: '', tipoHumedal: 'conservacion',
    funcionPrincipal: '', superficie: null, volumen: null,
    capacidadTratamiento: '', anioImplementacion: '', sustrato: '', usoAgua: '',
    monitoreo: '', estado: 'activo', lat: 19.4326, lng: -99.1332, imagen: '',
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
    nombre: row.nombre || '', alcaldia: row.alcaldia || '', ubicacion: row.ubicacion || '',
    tipoHumedal: row.tipoHumedal || 'conservacion', funcionPrincipal: row.funcionPrincipal || '',
    superficie: row.superficie, volumen: row.volumen,
    capacidadTratamiento: row.capacidadTratamiento || '', anioImplementacion: row.anioImplementacion || '',
    sustrato: row.sustrato || '', usoAgua: row.usoAgua || '', monitoreo: row.monitoreo || '',
    estado: row.estado || 'activo', lat: row.lat ?? 19.4326, lng: row.lng ?? -99.1332,
    imagen: row.imagen || '',
  })
  showForm.value = true
}

async function saveForm() {
  const body = { ...form }
  try {
    if (editingId.value) {
      await apiFetch(`/observatory/${obs}/admin/humedales/${editingId.value}`, { method: 'PATCH', body })
    } else {
      await apiFetch(`/observatory/${obs}/admin/humedales`, { method: 'POST', body })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar')
  }
}

async function handleDelete(row: any) {
  if (!confirm(`Eliminar "${row.nombre}"?`)) return
  try {
    await apiFetch(`/observatory/${obs}/admin/humedales/${row.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al eliminar')
  }
}
</script>

<template>
  <div>
    <!-- Pipeline context banner -->
    <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-medium text-gray-500">Detector</span>
        <span class="text-gray-300">&rarr;</span>
        <span class="whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-medium text-gray-500">Prospectos</span>
        <span class="text-gray-300">&rarr;</span>
        <span class="whitespace-nowrap rounded bg-primary-50 px-2 py-1 font-semibold text-primary ring-2 ring-primary/30">Inventario</span>
      </div>
      <p class="mt-2 text-sm text-slate-custom">Humedales artificiales registrados en la CDMX. Estos son los que se muestran en el mapa publico e inventario del observatorio.</p>
    </div>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-xl sm:text-2xl font-semibold text-ink">Inventario de humedales</h2>
        <p class="mt-1 text-sm text-slate-custom">Humedales artificiales registrados en la CDMX</p>
      </div>
      <button class="btn-primary flex-shrink-0" @click="openCreate">+ Agregar</button>
    </div>

    <AdminDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      search-placeholder="Buscar humedal..."
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #cell-estado="{ value }">
        <span
          class="badge-primary text-xs"
          :class="{
            '!bg-green-100 !text-green-800': value === 'activo',
            '!bg-blue-100 !text-blue-800': value === 'en_construccion',
            '!bg-purple-100 !text-purple-800': value === 'en_expansion',
            '!bg-yellow-100 !text-yellow-800': value === 'piloto',
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-superficie="{ value }">
        {{ value ? Number(value).toLocaleString('es-MX') : '—' }}
      </template>
    </AdminDataTable>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showForm = false">
        <div class="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 animate-scale-in">
          <h3 class="mb-4 text-lg font-semibold text-ink">
            {{ editingId ? 'Editar humedal' : 'Agregar humedal' }}
          </h3>
          <form class="space-y-3" @submit.prevent="saveForm">
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Nombre *</label>
              <input v-model="form.nombre" class="input w-full" required />
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Alcaldía *</label>
                <input v-model="form.alcaldia" class="input w-full" required />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Tipo *</label>
                <select v-model="form.tipoHumedal" class="select w-full">
                  <option value="conservacion">Conservación</option>
                  <option value="tratamiento_aguas">Tratamiento de aguas</option>
                  <option value="recreativo">Recreativo</option>
                  <option value="captacion_pluvial">Captación pluvial</option>
                  <option value="restauracion_hidrologica">Restauración hidrológica</option>
                </select>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Función principal *</label>
              <input v-model="form.funcionPrincipal" class="input w-full" required />
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Superficie (m²)</label>
                <input v-model.number="form.superficie" class="input w-full" type="number" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Latitud *</label>
                <input v-model.number="form.lat" class="input w-full" type="number" step="any" required />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Longitud *</label>
                <input v-model.number="form.lng" class="input w-full" type="number" step="any" required />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Año implementación *</label>
                <input v-model="form.anioImplementacion" class="input w-full" required />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-ink">Estado</label>
                <select v-model="form.estado" class="select w-full">
                  <option value="activo">Activo</option>
                  <option value="en_construccion">En construcción</option>
                  <option value="en_expansion">En expansión</option>
                  <option value="piloto">Piloto</option>
                </select>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Ubicación</label>
              <input v-model="form.ubicacion" class="input w-full" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-ink">Imagen (URL)</label>
              <input v-model="form.imagen" class="input w-full" placeholder="/images/humedales/..." />
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
