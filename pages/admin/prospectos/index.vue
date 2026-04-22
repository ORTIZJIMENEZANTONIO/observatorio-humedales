<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const observatory = config.public.observatory as string
const prospectosStore = useProspectosStore()
const humedalesStore = useHumedalesStore()
const formatters = useFormatters()
const { available: backendUp, check: checkBackend } = useBackendStatus()

// ══════════════════════════════════════════
//  Tab state
// ══════════════════════════════════════════
const activeTab = ref<'cola' | 'detector'>('cola')
const isOnline = ref(false)

// ══════════════════════════════════════════
//  Cola de aprobacion state
// ══════════════════════════════════════════
const loadingProspects = ref(true)
const filter = ref('pendiente')

const allProspects = computed(() => prospectosStore.byStatus(filter.value))

// ── Cola pagination ──
const colaPage = ref(1)
const colaPerPage = ref(15)
const colaTotalPages = computed(() => Math.ceil(allProspects.value.length / colaPerPage.value) || 1)
const prospects = computed(() => allProspects.value.slice((colaPage.value - 1) * colaPerPage.value, colaPage.value * colaPerPage.value))

watch([filter], () => { colaPage.value = 1 })

async function loadProspects() {
  loadingProspects.value = true
  isOnline.value = await checkBackend()
  if (isOnline.value) {
    try {
      const res = await apiFetch(`/observatory/${observatory}/admin/prospectos?status=${filter.value}`)
      const items = (res as any).items || (res as any).data || []
      if (items.length) prospectosStore.setProspectos(items)
    } catch { /* use store fallback */ }
  }
  loadingProspects.value = false
}

onMounted(loadProspects)
watch(filter, () => { if (isOnline.value) loadProspects() })

async function approve(id: number) {
  try {
    if (isOnline.value) {
      await apiFetch(`/observatory/${observatory}/admin/prospectos/${id}/aprobar`, { method: 'POST' })
      await loadProspects()
    } else {
      const p = prospectosStore.prospectos.find(x => x.id === id)
      if (p) {
        // Move to humedales store
        humedalesStore.addHumedal({
          nombre: p.data.nombre,
          alcaldia: p.data.alcaldia as any,
          ubicacion: p.data.ubicacion,
          tipoHumedal: (p.data.tipoHumedal || 'ha_fws') as any,
          funcionPrincipal: p.data.funcionPrincipal,
          superficie: p.data.superficie ?? undefined,
          volumen: p.data.volumen ?? undefined,
          anioImplementacion: p.data.anio || '',
          sustrato: p.data.sustrato || '',
          vegetacion: p.data.vegetacion ? p.data.vegetacion.split(',').map(v => v.trim()) : [],
          estado: 'piloto',
          fuente: p.data.documentoDescripcion || p.data.institucion || 'Propuesta ciudadana',
        })
        prospectosStore.aprobar(id)
      }
    }
  } catch {
    prospectosStore.aprobar(id)
  }
}

const rejectNotes = ref('')
const rejectingId = ref<number | null>(null)

function startReject(id: number) {
  rejectingId.value = id
  rejectNotes.value = ''
}

async function confirmReject() {
  if (!rejectingId.value || !rejectNotes.value) return
  try {
    if (isOnline.value) {
      await apiFetch(`/observatory/${observatory}/admin/prospectos/${rejectingId.value}/rechazar`, {
        method: 'POST',
        body: { notas: rejectNotes.value },
      })
      await loadProspects()
    } else {
      prospectosStore.rechazar(rejectingId.value, rejectNotes.value)
    }
  } catch {
    prospectosStore.rechazar(rejectingId.value!, rejectNotes.value)
  }
  rejectingId.value = null
}

// ══════════════════════════════════════════
//  Detector state
// ══════════════════════════════════════════
const allResults = ref<any[]>([])
const selected = ref<Set<number>>(new Set())
const loadingDetector = ref(false)
const submitting = ref(false)
const phase = ref<'config' | 'results'>('config')
const showFilters = ref(true)
const expandedRow = ref<number | null>(null)
const showMethodology = ref(false)
const showConfigMethodology = ref(false)

const minArea = ref(100)
const minScore = ref(20)
const bbox = reactive({ south: 19.25, west: -99.12, north: 19.29, east: -99.08 })
const detectorPage = ref(1)
const perPage = ref(25)

const detectorFilters = reactive({
  search: '', tipo: '', scoreMin: 0, scoreMax: 100,
  areaMin: 0, areaMax: 999999, ndwiMin: 0, serviciosMin: 0, tipoSuelo: '',
  sortBy: 'score' as string, sortDir: 'desc' as 'asc' | 'desc',
})

// -- Column definitions --
const columns = [
  { key: 'indices.refId', label: 'Ref', align: 'left', tip: 'Identificador unico del elemento en OpenStreetMap (Way ID). Permite rastrear y verificar el sitio en osm.org.' },
  { key: 'nombre', label: 'Nombre', align: 'left', tip: 'Nombre del sitio segun OSM, o tipo detectado + OSM ID si no tiene nombre.' },
  { key: 'tipo', label: 'Tipo', align: 'left', tip: 'Clasificacion: humedal_existente (natural=wetland), cuerpo_agua (natural=water), via_acuatica (waterway=*), infraestructura_hidrica (wastewater_plant), vaso_regulador (basin/reservoir), area_verde (park/grass).' },
  { key: 'score', label: 'Score', align: 'right', tip: 'Puntaje compuesto (0-100). Se asigna por tipo de feature (max 35 para humedales) + superficie (max 15) + identificacion (max 5). Click en triangulo para desglose.' },
  { key: 'areaM2', label: 'm2', align: 'right', tip: 'Superficie del poligono en metros cuadrados. Calculada con Turf.js sobre la geometria OSM.' },
  { key: 'indices.ndwiPotencial', label: 'NDWI', align: 'right', tip: 'Normalized Difference Water Index potencial (0-1). NO es NDWI satelital (B3-B8/B3+B8 Sentinel-2). Es un proxy por tipo OSM: humedal=0.70, agua=0.85, waterway=0.60, infra=0.50, verde=0.20.' },
  { key: 'indices.capacidadRetencion', label: 'Ret. m3', align: 'right', tip: 'Capacidad de retencion hidrica estimada (m3). Formula: area x 1m (profundidad promedio) x 0.30 (factor retencion). Rango real: 0.2-0.5 segun sustrato y tipo de humedal.' },
  { key: 'indices.conectividadHidrica', label: 'Conect.', align: 'right', tip: 'Conectividad con la red hidrica urbana (0-1). Humedales=0.9 (integrados), waterways=0.8, agua=0.7, infra=0.6, verde=0.3. Validacion ideal: datos CONAGUA/SACMEX.' },
  { key: 'indices.serviciosEcosistemicos', label: 'Serv.', align: 'right', tip: 'Servicios ecosistemicos estimados (0-5): depuracion de agua, habitat fauna, regulacion termica, captacion pluvial, recreacion. Ref: Evaluacion de Ecosistemas del Milenio (MEA, 2005).' },
  { key: 'indices.biodiversidadPotencial', label: 'Biodiv.', align: 'right', tip: 'Potencial de biodiversidad (proxy Shannon, 0-1). Humedales=0.85, agua=0.60, vaso=0.50, verde=0.45. Ref: Mitsch & Gosselink (2015), Wetlands.' },
  { key: 'indices.reduccionTemperatura', label: 'Temp', align: 'right', tip: 'Reduccion termica local estimada (grados C). Formula: min(area/20000, 3.5). Ref: efecto enfriamiento evaporativo, Gunawardena et al. (2017).' },
  { key: 'indices.tipoSuelo', label: 'Suelo', align: 'left', tip: 'Tipo de suelo estimado: lacustre (agua presente, NDWI>=0.6), aluvial (area verde), intervenido (infraestructura). Ref para datos reales: INEGI Serie Edafologica.' },
]

// -- Score composition --
const scoreComponents = [
  { key: 'humedal', label: 'Humedal existente', max: 35, desc: 'natural=wetland en OSM = 35 pts', why: 'Humedales naturales existentes son la maxima prioridad: ya cumplen funcion ecosistemica, requieren conservacion y pueden ser modelos para replicacion.' },
  { key: 'infra', label: 'Infraestructura hidrica', max: 30, desc: 'wastewater_plant = 30 pts', why: 'Plantas de tratamiento son sitios ideales para humedales artificiales de flujo subsuperficial: ya tienen infraestructura, permisos y necesidad de tratamiento terciario.' },
  { key: 'agua', label: 'Cuerpo de agua', max: 25, desc: 'natural=water = 25 pts', why: 'Lagos, estanques y canales son indicadores de disponibilidad hidrica. Pueden albergar o conectar con humedales construidos para fitodepuracion.' },
  { key: 'vaso', label: 'Vaso regulador', max: 20, desc: 'landuse=basin/reservoir = 20 pts', why: 'Vasos reguladores controlan inundaciones y pueden integrarse con humedales para tratamiento de escurrimientos pluviales y recarga de acuiferos.' },
  { key: 'waterway', label: 'Via acuatica', max: 15, desc: 'waterway=* = 15 pts', why: 'Canales, rios y drenes son la red de conectividad hidrica. Humedales riberenos a lo largo de waterways maximizan servicios de depuracion y biodiversidad.' },
  { key: 'verde', label: 'Area verde', max: 10, desc: 'park/grass = 10 pts', why: 'Parques y areas verdes son sitios potenciales para restauracion hidrologica con humedales artificiales, especialmente en zonas con problemas de inundacion.' },
  { key: 'superficie', label: 'Superficie', max: 15, desc: '>=5,000 m2 = 15 | >=1,000 = 10 | <1,000 = 5', why: 'Mayor superficie = mayor capacidad de retencion, tratamiento y servicios ecosistemicos. Humedales <500 m2 son generalmente pilotos demostrativos.' },
  { key: 'nombre', label: 'Identificacion', max: 5, desc: 'Feature con nombre en OSM = 5 pts', why: 'Sitios nombrados son generalmente reconocidos oficialmente, facilitando gestion, monitoreo y acceso a recursos publicos.' },
]

const tipoLabels: Record<string, string> = {
  cuerpo_agua: 'Cuerpo de agua', humedal_existente: 'Humedal', via_acuatica: 'Via acuatica',
  infraestructura_hidrica: 'Infra. hidrica', vaso_regulador: 'Vaso regulador', area_verde: 'Area verde', potencial: 'Potencial',
}

function estimateComponentScore(r: any, key: string): number {
  const t = r.tipo
  switch (key) {
    case 'humedal': return t === 'humedal_existente' ? 35 : 0
    case 'infra': return t === 'infraestructura_hidrica' ? 30 : 0
    case 'agua': return t === 'cuerpo_agua' ? 25 : 0
    case 'vaso': return t === 'vaso_regulador' ? 20 : 0
    case 'waterway': return t === 'via_acuatica' ? 15 : 0
    case 'verde': return t === 'area_verde' ? 10 : 0
    case 'superficie': return r.areaM2 >= 5000 ? 15 : r.areaM2 >= 1000 ? 10 : 5
    case 'nombre': return r.nombre && !r.nombre.includes('(OSM') ? 5 : 0
    default: return 0
  }
}
function activeComponents(r: any) { return scoreComponents.filter(c => estimateComponentScore(r, c.key) > 0) }

const filtered = computed(() => {
  let rows = allResults.value
  const q = detectorFilters.search.toLowerCase()
  if (q) rows = rows.filter(r => r.nombre.toLowerCase().includes(q) || r.indices?.refId?.toLowerCase().includes(q))
  if (detectorFilters.tipo) rows = rows.filter(r => r.tipo === detectorFilters.tipo)
  if (detectorFilters.scoreMin > 0) rows = rows.filter(r => r.score >= detectorFilters.scoreMin)
  if (detectorFilters.scoreMax < 100) rows = rows.filter(r => r.score <= detectorFilters.scoreMax)
  if (detectorFilters.areaMin > 0) rows = rows.filter(r => r.areaM2 >= detectorFilters.areaMin)
  if (detectorFilters.areaMax < 999999) rows = rows.filter(r => r.areaM2 <= detectorFilters.areaMax)
  if (detectorFilters.ndwiMin > 0) rows = rows.filter(r => (r.indices?.ndwiPotencial ?? 0) >= detectorFilters.ndwiMin)
  if (detectorFilters.serviciosMin > 0) rows = rows.filter(r => (r.indices?.serviciosEcosistemicos ?? 0) >= detectorFilters.serviciosMin)
  if (detectorFilters.tipoSuelo) rows = rows.filter(r => r.indices?.tipoSuelo === detectorFilters.tipoSuelo)
  const dir = detectorFilters.sortDir === 'asc' ? 1 : -1
  rows = [...rows].sort((a, b) => {
    const k = detectorFilters.sortBy
    const va = k.includes('.') ? a.indices?.[k.split('.')[1]] : a[k]
    const vb = k.includes('.') ? b.indices?.[k.split('.')[1]] : b[k]
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return String(va || '').localeCompare(String(vb || '')) * dir
  })
  return rows
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage.value) || 1)
const paginated = computed(() => filtered.value.slice((detectorPage.value - 1) * perPage.value, detectorPage.value * perPage.value))
const uniqueTipos = computed(() => [...new Set(allResults.value.map(r => r.tipo))].filter(Boolean).sort())
const uniqueSuelos = computed(() => [...new Set(allResults.value.map(r => r.indices?.tipoSuelo))].filter(Boolean).sort())
watch([detectorFilters], () => { detectorPage.value = 1 }, { deep: true })

async function runDetection() {
  loadingDetector.value = true; allResults.value = []; selected.value = new Set(); detectorPage.value = 1
  try { const res = await apiFetch(`/observatory/${observatory}/detector/run`, { method: 'POST', body: { bbox: { ...bbox }, minAreaM2: minArea.value, minScore: minScore.value } }); allResults.value = res.data || []; phase.value = 'results' }
  catch (e: any) { alert(e?.data?.error?.message || 'Error') }
  loadingDetector.value = false
}
function toggleSelect(gIdx: number) { const s = new Set(selected.value); s.has(gIdx) ? s.delete(gIdx) : s.add(gIdx); selected.value = s }
function selectAllPage() { const s = new Set(selected.value); const ids = paginated.value.map(r => allResults.value.indexOf(r)); const all = ids.every(i => s.has(i)); ids.forEach(i => all ? s.delete(i) : s.add(i)); selected.value = s }
async function submitSelected() {
  const cands = [...selected.value].map(i => allResults.value[i]); if (!cands.length) return; submitting.value = true
  try {
    const res = await apiFetch(`/observatory/${observatory}/detector/submit`, { method: 'POST', body: { candidates: cands } })
    alert(`${res.data.submitted} prospectos enviados`)
    const idxs = new Set(selected.value); allResults.value = allResults.value.filter((_, i) => !idxs.has(i)); selected.value = new Set()
    // Auto-switch to approval queue and reload
    filter.value = 'pendiente'
    activeTab.value = 'cola'
    await loadProspects()
  }
  catch (e: any) { alert(e?.data?.error?.message || 'Error') } submitting.value = false
}
function toggleSort(col: string) { if (detectorFilters.sortBy === col) detectorFilters.sortDir = detectorFilters.sortDir === 'asc' ? 'desc' : 'asc'; else { detectorFilters.sortBy = col; detectorFilters.sortDir = 'desc' } }
function sortIcon(col: string) { return detectorFilters.sortBy !== col ? '↕' : detectorFilters.sortDir === 'asc' ? '↑' : '↓' }
function scoreClass(s: number) { return s >= 70 ? 'bg-green-100 text-green-800' : s >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800' }
function barWidth(val: number, max: number) { return `${Math.round((val / max) * 100)}%` }
</script>

<template>
  <div>
    <!-- Pipeline context banner -->
    <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="whitespace-nowrap rounded bg-secondary/10 px-2 py-1 font-semibold text-secondary">Detector</span>
        <span class="text-gray-300">&rarr;</span>
        <span class="whitespace-nowrap rounded bg-accent/10 px-2 py-1 font-semibold text-accent ring-2 ring-accent/30">Prospectos</span>
        <span class="text-gray-300">&rarr;</span>
        <span class="whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-medium text-gray-500">Inventario</span>
      </div>
      <p class="mt-2 text-sm text-slate-custom">El detector identifica sitios potenciales para humedales via OpenStreetMap. Los prospectos pendientes esperan tu revision para incorporarse al inventario.</p>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!--  Tab navigation                           -->
    <!-- ══════════════════════════════════════════ -->
    <div class="sticky top-0 z-30 -mx-4 mb-6 border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm lg:-mx-6 lg:px-6">
      <nav class="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
        <button
          class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
          :class="activeTab === 'cola'
            ? 'bg-primary text-white shadow-sm scale-[1.02]'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'"
          @click="activeTab = 'cola'"
        >
          <span class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cola de aprobacion
          </span>
        </button>
        <button
          class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
          :class="activeTab === 'detector'
            ? 'bg-primary text-white shadow-sm scale-[1.02]'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'"
          @click="activeTab = 'detector'"
        >
          <span class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Detector
          </span>
        </button>
      </nav>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!--  TAB 1: Cola de aprobacion                -->
    <!-- ══════════════════════════════════════════ -->
    <div v-show="activeTab === 'cola'">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-ink">Prospectos por aprobar</h2>
        <p class="mt-1 text-sm text-slate-custom">Prospectos detectados por el sistema esperando revision</p>
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-2">
        <button
          v-for="f in ['pendiente', 'aprobado', 'rechazado']"
          :key="f"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
          :class="filter === f
            ? 'bg-primary text-white shadow-sm scale-[1.02]'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'"
          @click="filter = f"
        >
          {{ f.charAt(0).toUpperCase() + f.slice(1) }}s
        </button>
        <span class="ml-2 text-sm text-slate-custom">{{ allProspects.length }} {{ allProspects.length === 1 ? 'prospecto' : 'prospectos' }}</span>
        <div class="ml-auto flex items-center gap-1.5">
          <label class="text-xs text-slate-custom whitespace-nowrap">Por página:</label>
          <select v-model.number="colaPerPage" class="select !py-1 !pl-2 !pr-7 text-xs w-[70px]" @change="colaPage = 1">
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div v-if="loadingProspects" class="space-y-3">
        <div v-for="i in 3" :key="i" class="card animate-pulse p-4">
          <div class="h-4 w-48 rounded bg-gray-200" />
          <div class="mt-2 h-3 w-full rounded bg-gray-100" />
        </div>
      </div>

      <div v-else-if="prospects.length === 0" class="card p-12 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg v-if="filter === 'pendiente'" class="h-8 w-8 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="filter === 'aprobado'" class="h-8 w-8 text-eco/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-8 w-8 text-alert/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="mt-4 text-lg font-medium text-gray-500">No hay prospectos {{ filter }}s</p>
          <p class="mt-1 text-sm text-gray-400">
            <template v-if="filter === 'pendiente'">Ejecuta el detector para encontrar nuevos candidatos</template>
            <template v-else-if="filter === 'aprobado'">Los prospectos aprobados apareceran aqui</template>
            <template v-else>Los prospectos rechazados apareceran aqui</template>
          </p>
          <button v-if="filter === 'pendiente'" class="btn-primary mt-4 inline-flex items-center gap-2" @click="activeTab = 'detector'">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Ir al detector
          </button>
        </div>
      </div>

      <TransitionGroup v-else name="slide-up" tag="div" class="space-y-3">
        <div v-for="p in prospects" :key="p.id" class="card p-4 transition-shadow duration-200 hover:shadow-card-hover">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-ink">#{{ p.id }}</span>
                <span
                  class="badge-primary whitespace-nowrap text-xs"
                  :class="{
                    '!bg-yellow-100 !text-yellow-800': p.status === 'pendiente',
                    '!bg-green-100 !text-green-800': p.status === 'aprobado',
                    '!bg-red-100 !text-red-800': p.status === 'rechazado',
                  }"
                >
                  {{ p.status }}
                </span>
                <span v-if="p.source" class="text-xs text-slate-custom">via {{ p.source }}</span>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-gray-50 p-3 text-xs sm:grid-cols-3">
                <div v-if="p.data?.nombre"><span class="text-ink-muted">Nombre:</span> <strong>{{ p.data.nombre }}</strong></div>
                <div v-if="p.data?.alcaldia"><span class="text-ink-muted">Alcaldía:</span> <strong>{{ p.data.alcaldia }}</strong></div>
                <div v-if="p.data?.tipoHumedal"><span class="text-ink-muted">Tipo:</span> <strong>{{ formatters.formatTipoHumedalCorto(p.data.tipoHumedal) }}</strong></div>
                <div v-if="p.data?.funcionPrincipal" class="col-span-2"><span class="text-ink-muted">Función:</span> {{ p.data.funcionPrincipal }}</div>
                <div v-if="p.data?.superficie"><span class="text-ink-muted">Superficie:</span> {{ Number(p.data.superficie).toLocaleString('es-MX') }} m²</div>
                <div v-if="p.data?.anio"><span class="text-ink-muted">Año:</span> {{ p.data.anio }}</div>
                <div v-if="p.data?.sustrato"><span class="text-ink-muted">Sustrato:</span> {{ p.data.sustrato }}</div>
                <div v-if="p.data?.vegetacion"><span class="text-ink-muted">Vegetación:</span> {{ p.data.vegetacion }}</div>
                <div v-if="p.data?.ubicacion" class="col-span-2"><span class="text-ink-muted">Ubicación:</span> {{ p.data.ubicacion }}</div>
                <div v-if="p.data?.institucion"><span class="text-ink-muted">Institución:</span> {{ p.data.institucion }}</div>
                <div v-if="p.data?.documentoLink" class="col-span-2"><span class="text-ink-muted">Documento:</span> <a :href="p.data.documentoLink" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline truncate">{{ p.data.documentoLink }}</a></div>
                <div v-if="p.data?.documentoDescripcion" class="col-span-full"><span class="text-ink-muted">Desc. documento:</span> {{ p.data.documentoDescripcion }}</div>
                <div v-if="p.data?.email"><span class="text-ink-muted">Contacto:</span> {{ p.data.email }}</div>
              </div>
              <p v-if="p.notasAdmin" class="mt-2 text-sm text-alert">
                <strong>Motivo rechazo:</strong> {{ p.notasAdmin }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                {{ new Date(p.createdAt).toLocaleDateString('es-MX', { dateStyle: 'medium' }) }}
                <span v-if="p.source" class="ml-2 badge bg-gray-100 text-ink-muted text-[10px]">{{ p.source === 'formulario' ? 'Formulario público' : 'Detector IA' }}</span>
              </p>
            </div>

            <div v-if="p.status === 'pendiente'" class="flex flex-shrink-0 gap-2">
              <button class="btn-eco text-sm" @click="approve(p.id)">Aprobar</button>
              <button class="btn-outline text-sm !border-red-300 !text-red-600 hover:!bg-red-50" @click="startReject(p.id)">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Cola pagination -->
      <div class="mt-4">
        <CommonPaginationControls
          v-model:current-page="colaPage"
          :total-pages="colaTotalPages"
          :total-items="allProspects.length"
          :per-page="colaPerPage"
        />
      </div>

      <!-- Reject modal (no Teleport) -->
      <Transition name="fade">
        <div v-if="rejectingId" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="rejectingId = null">
          <div class="card w-full max-w-md p-6 shadow-panel animate-scale-in">
            <h3 class="mb-3 text-lg font-semibold text-ink">Rechazar prospecto #{{ rejectingId }}</h3>
            <label class="mb-1 block text-sm font-medium text-ink">Motivo del rechazo</label>
            <textarea
              v-model="rejectNotes"
              class="input w-full"
              rows="3"
              placeholder="Describe el motivo..."
            />
            <div class="mt-4 flex justify-end gap-3">
              <button class="btn-ghost" @click="rejectingId = null">Cancelar</button>
              <button class="btn-primary !bg-red-600 hover:!bg-red-700" :disabled="!rejectNotes" @click="confirmReject">
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!--  TAB 2: Detector                          -->
    <!-- ══════════════════════════════════════════ -->
    <div v-show="activeTab === 'detector'">
      <div class="mb-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-xl font-semibold text-ink sm:text-2xl">Detector de sitios para humedales</h2>
            <p class="mt-1 text-sm text-slate-custom">Analisis geoespacial — OpenStreetMap (Overpass API) + Turf.js</p>
          </div>
          <button v-if="phase === 'results'" class="btn-ghost flex-shrink-0 text-sm" @click="phase = 'config'; allResults = []; selected = new Set()">&larr; Nueva busqueda</button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════ -->
      <!--  PHASE 1: Config + Full Documentation  -->
      <!-- ═══════════════════════════════════════ -->
      <div v-if="phase === 'config'" class="space-y-5">

        <div class="rounded-lg border border-primary/20 bg-primary-50 p-4">
          <h3 class="flex items-center gap-2 font-semibold text-primary-dark">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Como funciona el detector
          </h3>
          <p class="mt-1 text-sm text-primary-dark/80">
            El detector consulta <strong>cuerpos de agua, humedales, waterways, plantas de tratamiento y areas verdes</strong> en OpenStreetMap.
            Calcula indices hidrologicos con <strong>Turf.js</strong> y asigna un score (0-100) por tipo de feature y superficie.
            Los sitios con mayor potencial se envian a la <strong>cola de prospectos</strong> para revision.
          </p>
        </div>

        <div class="card p-5">
          <h3 class="mb-3 font-semibold text-ink">Area de busqueda</h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><label class="mb-1 block text-xs text-slate-custom">Sur (lat)</label><input v-model.number="bbox.south" class="input w-full" type="number" step="0.001" /></div>
            <div><label class="mb-1 block text-xs text-slate-custom">Oeste (lng)</label><input v-model.number="bbox.west" class="input w-full" type="number" step="0.001" /></div>
            <div><label class="mb-1 block text-xs text-slate-custom">Norte (lat)</label><input v-model.number="bbox.north" class="input w-full" type="number" step="0.001" /></div>
            <div><label class="mb-1 block text-xs text-slate-custom">Este (lng)</label><input v-model.number="bbox.east" class="input w-full" type="number" step="0.001" /></div>
          </div>
          <p class="mt-2 text-xs text-slate-custom">~{{ ((bbox.north - bbox.south) * 111).toFixed(1) }} x {{ ((bbox.east - bbox.west) * 85).toFixed(1) }} km (auto-limitado a 5x5 km)</p>
          <div class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label class="mb-1 block text-xs text-slate-custom">Min m2</label><input v-model.number="minArea" class="input w-full" type="number" /></div>
            <div><label class="mb-1 block text-xs text-slate-custom">Score min (0-100)</label><input v-model.number="minScore" class="input w-full" type="number" min="0" max="100" /></div>
          </div>
        </div>

        <button class="btn-primary w-full py-3 text-lg" :disabled="loadingDetector" @click="runDetection">
          <svg v-if="loadingDetector" class="h-5 w-5 animate-spin-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loadingDetector ? 'Consultando Overpass API (15-60s)...' : 'Ejecutar deteccion' }}
        </button>

        <!-- Collapsible methodology accordion -->
        <div class="rounded-lg border border-gray-200">
          <button
            class="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
            @click="showConfigMethodology = !showConfigMethodology"
          >
            <span class="flex items-center gap-2">
              <svg class="h-4 w-4 text-slate-custom" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Metodologia, indices y referencias
            </span>
            <svg class="h-5 w-5 text-gray-400 transition-transform duration-200" :class="showConfigMethodology ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          <Transition name="slide-up">
            <div v-if="showConfigMethodology" class="space-y-5 border-t border-gray-200 p-5">
              <!-- Score Composition -->
              <div>
                <h3 class="mb-3 font-semibold text-ink">Composicion del score (0-100 puntos)</h3>
                <p class="mb-3 text-sm text-slate-custom">El puntaje se basa en el tipo de feature hidrico detectado en OSM. Un sitio acumula puntos del tipo que le corresponde + superficie + identificacion.</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead><tr class="border-b text-left text-xs uppercase text-gray-500"><th class="py-2 pr-3">Factor</th><th class="py-2 pr-3 text-center">Max</th><th class="py-2 pr-3">Criterio</th><th class="py-2">Justificacion</th></tr></thead>
                    <tbody><tr v-for="c in scoreComponents" :key="c.key" class="border-b border-gray-100"><td class="py-2 pr-3 font-medium whitespace-nowrap">{{ c.label }}</td><td class="py-2 pr-3 text-center font-bold tabular-nums text-primary">{{ c.max }}</td><td class="py-2 pr-3 text-xs text-slate-custom">{{ c.desc }}</td><td class="py-2 text-xs text-slate-custom/80">{{ c.why }}</td></tr></tbody>
                  </table>
                </div>
              </div>

              <hr class="border-gray-100" />

              <!-- Index Glossary -->
              <div>
                <h3 class="mb-3 font-semibold text-ink">Glosario de indices tecnicos</h3>
                <p class="mb-3 text-sm text-slate-custom">Cada columna de la tabla de resultados. Hover sobre el encabezado para descripcion rapida.</p>
                <dl class="divide-y divide-gray-100">
                  <div v-for="col in columns" :key="col.key" class="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[130px_1fr] sm:gap-3">
                    <dt class="text-sm font-medium text-ink">{{ col.label }}</dt>
                    <dd class="text-sm text-slate-custom">{{ col.tip }}</dd>
                  </div>
                </dl>
              </div>

              <hr class="border-gray-100" />

              <!-- Pipeline -->
              <div>
                <h3 class="mb-3 font-semibold text-ink">Pipeline de deteccion</h3>
                <ol class="space-y-2">
                  <li class="flex gap-3 text-sm"><span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span><span class="text-slate-custom"><strong class="text-ink">Overpass API</strong> -- Consulta water, wetland, waterway, basin, reservoir, wastewater_plant, park, grass en el bounding box.</span></li>
                  <li class="flex gap-3 text-sm"><span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span><span class="text-slate-custom"><strong class="text-ink">Turf.js</strong> -- Calcula area, perimetro, centroide y compacidad Polsby-Popper por poligono.</span></li>
                  <li class="flex gap-3 text-sm"><span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span><span class="text-slate-custom"><strong class="text-ink">Clasificacion + Scoring</strong> -- Asigna tipo, estima NDWI, retencion, conectividad, servicios, biodiversidad y reduccion termica.</span></li>
                  <li class="flex gap-3 text-sm"><span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">4</span><span class="text-slate-custom"><strong class="text-ink">Ranking</strong> -- Ordena por score, max 200. Admin filtra, selecciona y envia a prospectos.</span></li>
                </ol>
              </div>

              <hr class="border-gray-100" />

              <!-- Sources + Limitations -->
              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <h3 class="mb-2 font-semibold text-ink">Fuentes de datos</h3>
                  <ul class="space-y-1 text-sm text-slate-custom">
                    <li><strong>OpenStreetMap</strong> -- Cuerpos de agua, humedales, waterways, infraestructura. ODbL.</li>
                    <li><strong>Turf.js v7</strong> -- Analisis geoespacial. MIT.</li>
                    <li><strong>Mitsch & Gosselink (2015)</strong> -- Wetlands, 5th Ed. Ref biodiversidad.</li>
                    <li><strong>MEA (2005)</strong> -- Evaluacion Ecosistemas del Milenio. Ref servicios.</li>
                    <li><strong>Gunawardena et al. (2017)</strong> -- Enfriamiento evaporativo urbano.</li>
                    <li><strong>CONAGUA / SACMEX</strong> -- Ref para validacion de red hidrica.</li>
                    <li><strong>INEGI</strong> -- Series edafologicas para tipo de suelo.</li>
                  </ul>
                </div>
                <div>
                  <h3 class="mb-2 font-semibold text-ink">Limitaciones</h3>
                  <ul class="space-y-1 text-sm text-slate-custom">
                    <li>No utiliza imagenes satelitales. NDWI es un <strong>proxy por tipo OSM</strong>, no indice espectral.</li>
                    <li>Retencion es estimacion simplificada (profundidad 1m, factor 0.3).</li>
                    <li>Conectividad no considera red de drenaje subterranea ni SACMEX.</li>
                    <li>Servicios ecosistemicos son estimados por tipo, no medidos in situ.</li>
                    <li>Datos OSM en zonas periurbanas de CDMX pueden ser incompletos.</li>
                    <li>Bbox limitado a ~5x5 km. <strong>Costo: $0</strong> (OSM + Overpass gratuitos).</li>
                  </ul>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- ═══════════════════════════════════════ -->
      <!--  PHASE 2: Results                      -->
      <!-- ═══════════════════════════════════════ -->
      <div v-if="phase === 'results'">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <span class="text-sm text-slate-custom">{{ filtered.length }} de {{ allResults.length }} resultados</span>
          <span v-if="selected.size" class="text-sm font-medium text-primary">| {{ selected.size }} seleccionados</span>
          <div class="ml-auto flex flex-wrap gap-2">
            <button class="btn-outline text-xs" @click="showFilters = !showFilters">{{ showFilters ? 'Ocultar' : 'Mostrar' }} filtros</button>
            <button class="btn-outline text-xs" @click="selectAllPage">Sel. pagina</button>
            <button class="btn-eco whitespace-nowrap text-xs" :disabled="!selected.size || submitting" @click="submitSelected">{{ submitting ? '...' : `Enviar ${selected.size} a prospectos` }}</button>
          </div>
        </div>

        <Transition name="slide-up">
          <div v-if="showFilters" class="card mb-4 p-4">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <div><label class="mb-1 block text-xs text-slate-custom">Buscar</label><input v-model="detectorFilters.search" class="input w-full text-sm" placeholder="Nombre o ref..." /></div>
              <div><label class="mb-1 block text-xs text-slate-custom">Tipo</label><select v-model="detectorFilters.tipo" class="select w-full text-sm"><option value="">Todos</option><option v-for="t in uniqueTipos" :key="t" :value="t">{{ tipoLabels[t] || t }}</option></select></div>
              <div><label class="mb-1 block text-xs text-slate-custom">Score min</label><input v-model.number="detectorFilters.scoreMin" class="input w-full text-sm" type="number" min="0" max="100" /></div>
              <div><label class="mb-1 block text-xs text-slate-custom">NDWI min</label><input v-model.number="detectorFilters.ndwiMin" class="input w-full text-sm" type="number" min="0" max="1" step="0.1" /></div>
              <div><label class="mb-1 block text-xs text-slate-custom">Serv. eco min</label><input v-model.number="detectorFilters.serviciosMin" class="input w-full text-sm" type="number" min="0" max="5" /></div>
              <div><label class="mb-1 block text-xs text-slate-custom">Tipo suelo</label><select v-model="detectorFilters.tipoSuelo" class="select w-full text-sm"><option value="">Todos</option><option v-for="s in uniqueSuelos" :key="s" :value="s">{{ s }}</option></select></div>
            </div>
          </div>
        </Transition>

        <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div class="rounded-lg border border-gray-200">
          <table class="w-full min-w-[1100px] text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th class="w-10 px-3 py-2"><input type="checkbox" @change="selectAllPage" /></th>
                <th class="w-8 px-1 py-2" />
                <th
                  v-for="col in columns" :key="col.key"
                  class="cursor-pointer select-none px-3 py-2"
                  :class="col.align === 'right' ? 'text-right' : 'text-left'"
                  :title="col.tip" @click="toggleSort(col.key)"
                >
                  <span class="border-b border-dashed border-gray-400">{{ col.label }}</span>
                  <span class="ml-0.5 text-gray-400">{{ sortIcon(col.key) }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="paginated.length === 0"><td :colspan="columns.length + 2" class="px-4 py-8 text-center text-gray-400">Sin resultados</td></tr>
              <template v-for="r in paginated" :key="r.indices?.refId">
                <tr class="cursor-pointer transition-colors hover:bg-gray-50" :class="selected.has(allResults.indexOf(r)) ? 'bg-primary-50/40' : ''" @click="toggleSelect(allResults.indexOf(r))">
                  <td class="px-3 py-2"><input type="checkbox" :checked="selected.has(allResults.indexOf(r))" @click.stop="toggleSelect(allResults.indexOf(r))" /></td>
                  <td class="px-1 py-2"><button class="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-ink" title="Ver desglose" @click.stop="expandedRow = expandedRow === allResults.indexOf(r) ? null : allResults.indexOf(r)"><svg class="h-4 w-4 transition-transform" :class="expandedRow === allResults.indexOf(r) ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg></button></td>
                  <td class="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-custom">{{ r.indices?.refId }}</td>
                  <td class="max-w-[180px] truncate px-3 py-2 font-medium text-ink" :title="r.nombre">{{ r.nombre }}</td>
                  <td class="whitespace-nowrap px-3 py-2"><span class="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">{{ tipoLabels[r.tipo] || r.tipo }}</span></td>
                  <td class="px-3 py-2 text-right"><span :class="['rounded-full px-2 py-0.5 text-xs font-bold', scoreClass(r.score)]">{{ r.score }}</span></td>
                  <td class="whitespace-nowrap px-3 py-2 text-right tabular-nums">{{ r.areaM2?.toLocaleString('es-MX') }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ r.indices?.ndwiPotencial?.toFixed(2) }}</td>
                  <td class="whitespace-nowrap px-3 py-2 text-right tabular-nums">{{ r.indices?.capacidadRetencion?.toLocaleString('es-MX') }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ r.indices?.conectividadHidrica?.toFixed(2) }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ r.indices?.serviciosEcosistemicos }}/5</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ r.indices?.biodiversidadPotencial?.toFixed(2) }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">-{{ r.indices?.reduccionTemperatura?.toFixed(1) }}°C</td>
                  <td class="whitespace-nowrap px-3 py-2 text-xs">{{ r.indices?.tipoSuelo }}</td>
                </tr>
                <!-- Expanded breakdown -->
                <tr v-if="expandedRow === allResults.indexOf(r)">
                  <td :colspan="columns.length + 2" class="border-l-4 border-l-primary bg-gray-50 px-5 py-4">
                    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div>
                        <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Desglose del Score: {{ r.score }}/100</h4>
                        <div class="space-y-2">
                          <div v-for="comp in activeComponents(r)" :key="comp.key">
                            <div class="flex items-center gap-2">
                              <span class="w-24 flex-shrink-0 text-xs font-medium text-ink sm:w-32">{{ comp.label }}</span>
                              <div class="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
                                <div class="flex h-full items-center rounded-full bg-blue-500 pl-1 text-[10px] font-bold text-white transition-all" :style="{ width: barWidth(estimateComponentScore(r, comp.key), comp.max) }">
                                  {{ estimateComponentScore(r, comp.key) }}
                                </div>
                              </div>
                              <span class="w-10 flex-shrink-0 text-right text-xs tabular-nums text-slate-custom">/{{ comp.max }}</span>
                            </div>
                            <p class="ml-[6.5rem] text-[11px] text-gray-400 sm:ml-[8.5rem]">{{ comp.why }}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Datos tecnicos</h4>
                        <dl class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                          <dt class="text-slate-custom">Ref OSM</dt><dd class="font-mono font-medium">{{ r.indices?.refId }}</dd>
                          <dt class="text-slate-custom">Perimetro</dt><dd class="font-medium tabular-nums">{{ r.indices?.perimetroM?.toLocaleString('es-MX') }} m</dd>
                          <dt class="text-slate-custom">Compacidad</dt><dd class="font-medium tabular-nums">{{ (r.indices?.compacidad * 100)?.toFixed(0) }}%</dd>
                          <dt class="text-slate-custom">Captacion pluvial</dt><dd class="font-medium tabular-nums">{{ r.indices?.captacionPluvial?.toLocaleString('es-MX') }} L/ano</dd>
                          <dt class="text-slate-custom">Coordenadas</dt><dd class="font-medium tabular-nums">{{ r.lat?.toFixed(6) }}, {{ r.lng?.toFixed(6) }}</dd>
                        </dl>
                        <div v-if="r.reasons?.length" class="mt-3">
                          <h4 class="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">Razones del puntaje</h4>
                          <ul class="list-inside list-disc space-y-0.5 text-xs text-slate-custom">
                            <li v-for="(reason, ri) in r.reasons" :key="ri">{{ reason }}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-custom">
          <div class="flex items-center gap-2"><span>Filas:</span><select v-model.number="perPage" class="select text-sm" @change="detectorPage = 1"><option :value="10">10</option><option :value="25">25</option><option :value="50">50</option><option :value="100">100</option></select></div>
          <div class="flex items-center gap-1"><button class="min-h-[44px] min-w-[44px] rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-30" :disabled="detectorPage <= 1" @click="detectorPage--">&laquo;</button><span class="tabular-nums">{{ detectorPage }} / {{ totalPages }}</span><button class="min-h-[44px] min-w-[44px] rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-30" :disabled="detectorPage >= totalPages" @click="detectorPage++">&raquo;</button></div>
        </div>

        <!-- Methodology (collapsible in results) -->
        <div class="mt-6">
          <button class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3 text-left text-sm font-semibold text-ink hover:bg-gray-50" @click="showMethodology = !showMethodology">
            Justificacion y metodologia
            <svg class="h-5 w-5 text-gray-400 transition-transform" :class="showMethodology ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div v-if="showMethodology" class="card mt-2 space-y-4 p-4 text-sm sm:p-5">
            <div>
              <h4 class="mb-2 font-semibold text-ink">Composicion del score</h4>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[500px] text-xs"><thead><tr class="border-b text-left text-gray-500"><th class="py-1.5 pr-3">Factor</th><th class="py-1.5 pr-3 text-center">Max</th><th class="py-1.5 pr-3">Criterio</th><th class="py-1.5">Justificacion</th></tr></thead>
                  <tbody><tr v-for="c in scoreComponents" :key="c.key" class="border-b border-gray-100"><td class="py-1.5 pr-3 font-medium whitespace-nowrap">{{ c.label }}</td><td class="py-1.5 pr-3 text-center font-bold tabular-nums">{{ c.max }}</td><td class="py-1.5 pr-3 text-slate-custom">{{ c.desc }}</td><td class="py-1.5 text-slate-custom/80">{{ c.why }}</td></tr></tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 class="mb-2 font-semibold text-ink">Glosario de columnas</h4>
              <dl class="divide-y divide-gray-100 text-xs"><div v-for="col in columns" :key="col.key" class="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[120px_1fr] sm:gap-3"><dt class="font-medium text-ink">{{ col.label }}</dt><dd class="text-slate-custom">{{ col.tip }}</dd></div></dl>
            </div>
            <div>
              <h4 class="mb-1 font-semibold text-ink">Fuentes</h4>
              <ul class="list-inside list-disc text-xs text-slate-custom">
                <li>OpenStreetMap (Overpass API) — ODbL</li><li>Turf.js v7 — MIT</li><li>Mitsch & Gosselink (2015) — Wetlands</li><li>MEA (2005) — Servicios ecosistemicos</li><li>Gunawardena et al. (2017) — Enfriamiento evaporativo</li><li>CONAGUA, INEGI — validacion futura</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
