<script setup lang="ts">
import type { Humedal } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const store = useHumedalesStore()
const formatters = useFormatters()
const { available: backendAvailable, check: checkBackend } = useBackendStatus()

const loading = ref(true)
const isOnline = ref(false)

async function load() {
  loading.value = true
  isOnline.value = await checkBackend()
  if (isOnline.value) {
    try {
      const res = await apiFetch(`/observatory/${obs}/admin/humedales`)
      const items = (res as any).items || (res as any).data
      if (items?.length) {
        store.setHumedales(items)
      }
    } catch { /* use store fallback */ }
  }
  loading.value = false
}
onMounted(load)

// ── Advanced filters ──
const advFilter = reactive({
  alcaldia: '',
  tipo: '',
  estado: '',
  visibilidad: '',
  archivo: '',
})
const hasAdvFilters = computed(() => Object.values(advFilter).some(v => !!v))
function clearAdvFilters() { Object.assign(advFilter, { alcaldia: '', tipo: '', estado: '', visibilidad: '', archivo: '' }) }

const filteredRows = computed(() => {
  return store.humedales.filter(h => {
    if (advFilter.alcaldia && h.alcaldia !== advFilter.alcaldia) return false
    if (advFilter.tipo && h.tipoHumedal !== advFilter.tipo) return false
    if (advFilter.estado && h.estado !== advFilter.estado) return false
    if (advFilter.visibilidad === 'visible' && (h.visible === false)) return false
    if (advFilter.visibilidad === 'oculto' && (h.visible !== false)) return false
    if (advFilter.archivo === 'activo' && h.archivado) return false
    if (advFilter.archivo === 'archivado' && !h.archivado) return false
    return true
  })
})

const columns = [
  { key: 'id', label: 'ID', class: 'w-12' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'alcaldia', label: 'Alcaldía' },
  { key: 'tipoHumedal', label: 'Tipo HA' },
  { key: 'superficie', label: 'm²', class: 'text-right tabular-nums' },
  { key: 'estado', label: 'Estado' },
  { key: 'anioImplementacion', label: 'Año' },
  { key: 'visible', label: 'Visible', class: 'w-20 text-center' },
  { key: 'archivado', label: 'Archivado', class: 'w-20 text-center' },
]

// ── Form state ──
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)

const emptyForm = {
  nombre: '',
  alcaldia: '',
  ubicacion: '',
  tipoHumedal: 'ha_fws' as string,
  tipoVegetacion: [] as string[],
  funcionPrincipal: '',
  superficie: null as number | null,
  volumen: null as number | null,
  capacidadTratamiento: '',
  anioImplementacion: '',
  vegetacion: '' ,
  sustrato: '',
  usoAgua: '',
  serviciosEcosistemicos: [] as string[],
  monitoreo: '',
  estado: 'activo' as string,
  lat: 19.4326,
  lng: -99.1332,
  imagen: '',
  fuente: '',
  fuenteImagen: '',
  visible: true,
  archivado: false,
}

const form = reactive({ ...emptyForm })
const imagePreview = computed(() => form.imagen || '')

function resetForm() {
  Object.assign(form, { ...emptyForm, tipoVegetacion: [], serviciosEcosistemicos: [] })
  editingId.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function handleEdit(row: any) {
  editingId.value = row.id
  Object.assign(form, {
    nombre: row.nombre || '',
    alcaldia: row.alcaldia || '',
    ubicacion: row.ubicacion || '',
    tipoHumedal: row.tipoHumedal || 'ha_fws',
    tipoVegetacion: row.tipoVegetacion ? [...row.tipoVegetacion] : [],
    funcionPrincipal: row.funcionPrincipal || '',
    superficie: row.superficie ?? null,
    volumen: row.volumen ?? null,
    capacidadTratamiento: row.capacidadTratamiento || '',
    anioImplementacion: row.anioImplementacion || '',
    vegetacion: Array.isArray(row.vegetacion) ? row.vegetacion.join(', ') : (row.vegetacion || ''),
    sustrato: row.sustrato || '',
    usoAgua: row.usoAgua || '',
    serviciosEcosistemicos: row.serviciosEcosistemicos ? [...row.serviciosEcosistemicos] : [],
    monitoreo: row.monitoreo || '',
    estado: row.estado || 'activo',
    lat: row.lat ?? 19.4326,
    lng: row.lng ?? -99.1332,
    imagen: row.imagen || '',
    fuente: row.fuente || '',
    fuenteImagen: row.fuenteImagen || '',
    visible: row.visible ?? true,
    archivado: row.archivado ?? false,
  })
  showForm.value = true
}

function formToHumedal(): Partial<Humedal> {
  return {
    nombre: form.nombre,
    alcaldia: form.alcaldia as any,
    ubicacion: form.ubicacion,
    tipoHumedal: form.tipoHumedal as any,
    tipoVegetacion: form.tipoVegetacion as any[],
    funcionPrincipal: form.funcionPrincipal,
    superficie: form.superficie ?? undefined,
    volumen: form.volumen ?? undefined,
    capacidadTratamiento: form.capacidadTratamiento || undefined,
    anioImplementacion: form.anioImplementacion,
    vegetacion: form.vegetacion ? form.vegetacion.split(',').map((v: string) => v.trim()).filter(Boolean) : [],
    sustrato: form.sustrato,
    usoAgua: form.usoAgua,
    serviciosEcosistemicos: form.serviciosEcosistemicos as any[],
    serviciosDescripcion: [],
    monitoreo: form.monitoreo,
    estado: form.estado as any,
    lat: form.lat,
    lng: form.lng,
    imagen: form.imagen || undefined,
    fuente: form.fuente || undefined,
    fuenteImagen: form.fuenteImagen || undefined,
    visible: form.visible,
    archivado: form.archivado,
  }
}

async function saveForm() {
  saving.value = true
  const body = formToHumedal()
  try {
    if (isOnline.value) {
      if (editingId.value) {
        await apiFetch(`/observatory/${obs}/admin/humedales/${editingId.value}`, { method: 'PATCH', body })
      } else {
        await apiFetch(`/observatory/${obs}/admin/humedales`, { method: 'POST', body })
      }
      await load()
    } else {
      if (editingId.value) {
        store.updateHumedal(editingId.value, body)
      } else {
        store.addHumedal(body)
      }
    }
    showForm.value = false
  } catch {
    // API failed — save locally as fallback
    if (editingId.value) {
      store.updateHumedal(editingId.value, body)
    } else {
      store.addHumedal(body)
    }
    showForm.value = false
  }
  saving.value = false
}

async function toggleVisible(row: any) {
  const newVal = !(row.visible ?? true)
  store.updateHumedal(row.id, { visible: newVal })
  if (isOnline.value) {
    try { await apiFetch(`/observatory/${obs}/admin/humedales/${row.id}`, { method: 'PATCH', body: { visible: newVal } }) } catch {}
  }
}

async function toggleArchivado(row: any) {
  const newVal = !row.archivado
  store.updateHumedal(row.id, { archivado: newVal })
  if (isOnline.value) {
    try { await apiFetch(`/observatory/${obs}/admin/humedales/${row.id}`, { method: 'PATCH', body: { archivado: newVal } }) } catch {}
  }
}

async function handleDelete(row: any) {
  if (!confirm(`¿Eliminar "${row.nombre}"?`)) return
  try {
    if (isOnline.value) {
      await apiFetch(`/observatory/${obs}/admin/humedales/${row.id}`, { method: 'DELETE' })
      await load()
    } else {
      store.deleteHumedal(row.id)
    }
  } catch {
    store.deleteHumedal(row.id)
  }
}

const allServicios = [
  { value: 'depuracion_agua', label: 'Tratamiento de agua' },
  { value: 'habitat_fauna', label: 'Hábitat de fauna' },
  { value: 'educacion_ambiental', label: 'Educación ambiental' },
  { value: 'captura_carbono', label: 'Captura de carbono' },
  { value: 'regulacion_termica', label: 'Regulación térmica' },
  { value: 'control_inundaciones', label: 'Control de inundaciones' },
  { value: 'recarga_acuiferos', label: 'Recarga de acuíferos' },
  { value: 'banco_germoplasma', label: 'Banco de germoplasma' },
  { value: 'recreacion', label: 'Recreación' },
  { value: 'reduccion_lst', label: 'Reducción LST' },
]

function toggleServicio(val: string) {
  const idx = form.serviciosEcosistemicos.indexOf(val)
  if (idx >= 0) form.serviciosEcosistemicos.splice(idx, 1)
  else form.serviciosEcosistemicos.push(val)
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
      <p class="mt-2 text-sm text-slate-custom">
        Humedales artificiales registrados en la CDMX. Estos son los que se muestran en el mapa público e inventario del observatorio.
        <span v-if="!isOnline" class="ml-1 text-accent font-medium">(modo local — cambios no se sincronizan al servidor)</span>
      </p>
    </div>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-xl sm:text-2xl font-semibold text-ink">Inventario de humedales</h2>
        <p class="mt-1 text-sm text-slate-custom">{{ store.totalCount }} humedales artificiales registrados</p>
      </div>
      <button class="btn-primary flex-shrink-0" @click="openCreate">+ Agregar</button>
    </div>

    <AdminDataTable
      :columns="columns"
      :rows="filteredRows"
      :loading="loading"
      search-placeholder="Buscar humedal..."
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #filters>
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <select v-model="advFilter.alcaldia" class="select !py-1.5 text-xs max-w-[180px]">
            <option value="">Todas las alcaldías</option>
            <option v-for="a in store.alcaldias" :key="a" :value="a">{{ a }}</option>
          </select>
          <select v-model="advFilter.tipo" class="select !py-1.5 text-xs max-w-[200px]">
            <option value="">Todos los tipos</option>
            <option value="ha_fws">FWS — Flujo superficial</option>
            <option value="ha_sfs_horizontal">HSSF — Subsuperficial horizontal</option>
            <option value="ha_sfs_vertical">VSSF — Subsuperficial vertical</option>
            <option value="ha_hibrido">Híbrido (FWS + SFS)</option>
          </select>
          <select v-model="advFilter.estado" class="select !py-1.5 text-xs max-w-[160px]">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en_construccion">En construcción</option>
            <option value="en_expansion">En expansión</option>
            <option value="piloto">Piloto</option>
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
      <template #cell-tipoHumedal="{ value }">
        <span :class="['badge text-[10px]', formatters.tipoHumedalBadgeClass(value)]">
          {{ formatters.formatTipoHumedalCorto(value) }}
        </span>
      </template>
      <template #cell-estado="{ value }">
        <span :class="['badge text-[10px]', formatters.estadoHumedalBadgeClass(value)]">
          {{ formatters.formatEstadoHumedal(value) }}
        </span>
      </template>
      <template #cell-superficie="{ value }">
        {{ value ? Number(value).toLocaleString('es-MX') : '—' }}
      </template>
      <template #cell-visible="{ row }">
        <button
          @click.stop="toggleVisible(row)"
          class="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          :class="(row.visible ?? true) ? 'text-eco hover:bg-eco/10' : 'text-gray-300 hover:bg-gray-100'"
          :title="(row.visible ?? true) ? 'Visible en público — clic para ocultar' : 'Oculto — clic para hacer visible'"
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

    <!-- Create/Edit panel (no Teleport) -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showForm = false">
        <div class="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 animate-scale-in">
          <h3 class="mb-4 text-lg font-semibold text-ink">
            {{ editingId ? 'Editar humedal' : 'Agregar humedal' }}
          </h3>
          <form class="space-y-4" @submit.prevent="saveForm">
            <!-- Nombre -->
            <div class="form-group">
              <label class="form-label">Nombre del humedal <span class="text-alert">*</span></label>
              <input v-model="form.nombre" class="input w-full" required />
            </div>

            <!-- Alcaldía + Tipo -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Alcaldía <span class="text-alert">*</span></label>
                <input v-model="form.alcaldia" class="input w-full" required />
              </div>
              <div class="form-group">
                <label class="form-label">Tipo de HA <span class="text-alert">*</span></label>
                <select v-model="form.tipoHumedal" class="select w-full">
                  <option value="ha_fws">HA flujo superficial (FWS)</option>
                  <option value="ha_sfs_horizontal">HA subsuperficial horizontal (HSSF)</option>
                  <option value="ha_sfs_vertical">HA subsuperficial vertical (VSSF)</option>
                  <option value="ha_hibrido">HA híbrido (FWS + SFS)</option>
                </select>
              </div>
            </div>

            <!-- Ubicación -->
            <div class="form-group">
              <label class="form-label">Ubicación</label>
              <input v-model="form.ubicacion" class="input w-full" placeholder="Dirección o referencia..." />
            </div>

            <!-- Función principal -->
            <div class="form-group">
              <label class="form-label">Función principal <span class="text-alert">*</span></label>
              <input v-model="form.funcionPrincipal" class="input w-full" required />
            </div>

            <!-- Superficie, Volumen, Capacidad, Año -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div class="form-group">
                <label class="form-label">Superficie (m²)</label>
                <input v-model.number="form.superficie" class="input w-full" type="number" />
              </div>
              <div class="form-group">
                <label class="form-label">Volumen (m³)</label>
                <input v-model.number="form.volumen" class="input w-full" type="number" />
              </div>
              <div class="form-group">
                <label class="form-label">Capacidad</label>
                <input v-model="form.capacidadTratamiento" class="input w-full" placeholder="250 m³/d" />
              </div>
              <div class="form-group">
                <label class="form-label">Año <span class="text-alert">*</span></label>
                <input v-model="form.anioImplementacion" class="input w-full" required placeholder="2012" />
              </div>
            </div>

            <!-- Coordenadas + Estado -->
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Latitud <span class="text-alert">*</span></label>
                <input v-model.number="form.lat" class="input w-full" type="number" step="any" required />
              </div>
              <div class="form-group">
                <label class="form-label">Longitud <span class="text-alert">*</span></label>
                <input v-model.number="form.lng" class="input w-full" type="number" step="any" required />
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="form.estado" class="select w-full">
                  <option value="activo">Activo</option>
                  <option value="en_construccion">En construcción</option>
                  <option value="en_expansion">En expansión</option>
                  <option value="piloto">Piloto</option>
                </select>
              </div>
            </div>

            <!-- Vegetación + Sustrato -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Vegetación</label>
                <input v-model="form.vegetacion" class="input w-full" placeholder="Typha, Juncus, Arundo donax..." />
                <p class="form-hint">Separar especies con comas</p>
              </div>
              <div class="form-group">
                <label class="form-label">Tipo de vegetación</label>
                <div class="flex flex-wrap gap-2 mt-1">
                  <label v-for="tv in ['emergente', 'flotante', 'sumergida']" :key="tv" class="checkbox-label text-xs">
                    <input type="checkbox" :value="tv" v-model="form.tipoVegetacion" class="checkbox" />
                    {{ tv.charAt(0).toUpperCase() + tv.slice(1) }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Sustrato + Uso del agua -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Sustrato</label>
                <input v-model="form.sustrato" class="input w-full" placeholder="Grava sílica, tezontle..." />
              </div>
              <div class="form-group">
                <label class="form-label">Uso del agua tratada</label>
                <input v-model="form.usoAgua" class="input w-full" placeholder="Riego, recirculación..." />
              </div>
            </div>

            <!-- Servicios ecosistémicos -->
            <div class="form-group">
              <label class="form-label">Servicios ecosistémicos</label>
              <div class="flex flex-wrap gap-2 mt-1">
                <button
                  v-for="s in allServicios" :key="s.value"
                  type="button"
                  class="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
                  :class="form.serviciosEcosistemicos.includes(s.value) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-custom border-gray-200 hover:border-primary/40'"
                  @click="toggleServicio(s.value)"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>

            <!-- Monitoreo -->
            <div class="form-group">
              <label class="form-label">Monitoreo / eficiencias</label>
              <textarea v-model="form.monitoreo" class="input w-full" rows="3" placeholder="Datos de eficiencia, fuentes..."></textarea>
            </div>

            <!-- Imagen + Fuentes -->
            <div class="form-group">
              <label class="form-label">Imagen (ruta o URL)</label>
              <input v-model="form.imagen" class="input w-full" placeholder="/images/humedales/... o https://..." />
              <div v-if="imagePreview" class="mt-2 overflow-hidden rounded-xl border border-gray-200">
                <img :src="imagePreview" alt="Vista previa" class="h-40 w-full object-cover" @error="($event.target as HTMLImageElement).style.display='none'" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Crédito imagen</label>
                <input v-model="form.fuenteImagen" class="input w-full" placeholder="Gobierno CDMX, UNAM..." />
              </div>
              <div class="form-group">
                <label class="form-label">Fuente de datos</label>
                <input v-model="form.fuente" class="input w-full" placeholder="Artículo, inventario, institución..." />
              </div>
            </div>

            <!-- Visibilidad y archivo -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Visibilidad</label>
                <label class="checkbox-label mt-1 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="form.visible" class="checkbox" />
                  Visible en la página pública
                </label>
                <p class="form-hint">Si se desactiva, el humedal no aparecerá en inventario, mapa ni análisis públicos</p>
              </div>
              <div class="form-group">
                <label class="form-label">Archivo</label>
                <label class="checkbox-label mt-1 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="form.archivado" class="checkbox" />
                  Archivado
                </label>
                <p class="form-hint">Los registros archivados se conservan pero no se muestran públicamente</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" class="btn-ghost" @click="showForm = false">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
