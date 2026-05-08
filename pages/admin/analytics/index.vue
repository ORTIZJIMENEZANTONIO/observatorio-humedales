<script setup lang="ts">
import type { Humedal, Hallazgo, ArticuloNotihumedal } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const observatory = (config.public.observatory as string) || 'humedales'
const humedalesStore = useHumedalesStore()
const hallazgosStore = useHallazgosStore()
const notihumedalStore = useNotihumedalStore?.()
const math = useAnalyticsMath()

interface AnalyticsSummary {
  observatory: string
  from: string
  to: string
  days: number
  totals: {
    events: number
    sessions: number
    pageviews: number
    clicks: number
    submits: number
    downloads: number
  }
  byType: Record<string, number>
  series: { date: string; events: number; sessions: number }[]
  topPaths: { key: string; count: number }[]
  topTargets: { key: string; count: number }[]
}

const summary = ref<AnalyticsSummary | null>(null)
const loading = ref(true)
const error = ref('')
const days = ref(30)
const activeTab = ref<'interacciones' | 'descriptivo' | 'inferencial' | 'modelado'>('interacciones')
const k = ref(3)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const sum = await apiFetch<{ success: boolean; data: AnalyticsSummary }>(
      `/observatory/${observatory}/admin/analytics/summary?days=${days.value}`,
    )
    summary.value = sum.data
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'No se pudieron cargar los datos analíticos'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(days, load)

// ────────── INTERACCIONES ──────────
const seriesChart = computed(() => {
  if (!summary.value) return null
  return {
    labels: summary.value.series.map((s) => s.date.slice(5)),
    datasets: [
      { label: 'Eventos', data: summary.value.series.map((s) => s.events), borderColor: '#0EA5E9', backgroundColor: 'rgba(14,165,233,0.15)', fill: true, tension: 0.3 },
      { label: 'Sesiones únicas', data: summary.value.series.map((s) => s.sessions), borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', fill: true, tension: 0.3 },
    ],
  }
})

const eventTypeChart = computed(() => {
  if (!summary.value) return null
  const entries = Object.entries(summary.value.byType)
  return {
    labels: entries.map(([k]) => k),
    datasets: [{ data: entries.map(([, v]) => v), backgroundColor: ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#FF7A66', '#94A3B8'] }],
  }
})

const topPathsChart = computed(() => {
  if (!summary.value) return null
  return {
    labels: summary.value.topPaths.map((p) => p.key.length > 30 ? p.key.slice(0, 30) + '…' : p.key),
    datasets: [{ label: 'Pageviews', data: summary.value.topPaths.map((p) => p.count), backgroundColor: '#0EA5E9' }],
  }
})

const topTargetsChart = computed(() => {
  if (!summary.value) return null
  return {
    labels: summary.value.topTargets.map((p) => p.key),
    datasets: [{ label: 'Clicks', data: summary.value.topTargets.map((p) => p.count), backgroundColor: '#10B981' }],
  }
})

// ────────── DESCRIPTIVO ──────────
const humedales = computed<Humedal[]>(() => humedalesStore.humedales)
const hallazgos = computed<Hallazgo[]>(() => hallazgosStore.hallazgos)
const articulos = computed<ArticuloNotihumedal[]>(() =>
  Array.isArray(notihumedalStore?.articulos) ? notihumedalStore.articulos : [],
)

const alcaldiaDist = computed(() => math.frequency(humedales.value.map((h) => h.alcaldia)))
const tipoDist = computed(() => math.frequency(humedales.value.map((h) => h.tipoHumedal)))
const estadoDist = computed(() => math.frequency(humedales.value.map((h) => h.estado)))
const serviciosDist = computed(() =>
  math.frequency(humedales.value.flatMap((h) => h.serviciosEcosistemicos || [])),
)

const superficieValues = computed(() =>
  humedales.value.map((h) => Number(h.superficie)).filter((v) => Number.isFinite(v) && v > 0),
)
const superficieStats = computed(() => math.describe(superficieValues.value))
const superficieHist = computed(() => math.histogram(superficieValues.value, 8))

const alcaldiaChart = computed(() => ({
  labels: alcaldiaDist.value.map((d) => d.key),
  datasets: [{ label: 'Humedales', data: alcaldiaDist.value.map((d) => d.count), backgroundColor: '#10B981' }],
}))

const tipoChart = computed(() => ({
  labels: tipoDist.value.map((d) => d.key),
  datasets: [{ data: tipoDist.value.map((d) => d.count), backgroundColor: ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'] }],
}))

const estadoChart = computed(() => ({
  labels: estadoDist.value.map((d) => d.key),
  datasets: [{ data: estadoDist.value.map((d) => d.count), backgroundColor: ['#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6'] }],
}))

const serviciosChart = computed(() => ({
  labels: serviciosDist.value.map((d) => d.key),
  datasets: [{ label: 'Frecuencia', data: serviciosDist.value.map((d) => d.count), backgroundColor: '#06B6D4' }],
}))

const superficieHistChart = computed(() => ({
  labels: superficieHist.value.map((b) => b.bin + ' m²'),
  datasets: [{ label: 'Humedales', data: superficieHist.value.map((b) => b.count), backgroundColor: '#0EA5E9' }],
}))

const hallazgosByImpacto = computed(() => math.frequency(hallazgos.value.map((h) => h.impacto)))
const hallazgosImpactoChart = computed(() => ({
  labels: hallazgosByImpacto.value.map((d) => d.key),
  datasets: [{ data: hallazgosByImpacto.value.map((d) => d.count), backgroundColor: ['#10B981', '#F59E0B', '#EF4444'] }],
}))

const articulosByMonth = computed(() => {
  const counts: Record<string, number> = {}
  for (const a of articulos.value) {
    const ts = new Date(a.fecha)
    if (Number.isNaN(ts.getTime())) continue
    const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}`
    counts[key] = (counts[key] || 0) + 1
  }
  return Object.entries(counts).sort(([a], [b]) => (a < b ? -1 : 1))
})

// ────────── INFERENCIAL ──────────
// Correlación: superficie vs número de servicios ecosistémicos prestados
const sizeVsServices = computed(() => {
  const data = humedales.value
    .filter((h) => Number.isFinite(Number(h.superficie)) && Number(h.superficie) > 0)
    .map((h) => ({
      humedal: h,
      superficie: Number(h.superficie),
      nServicios: (h.serviciosEcosistemicos || []).length,
    }))
  return data
})

const corrSizeServices = computed(() =>
  math.correlation(
    sizeVsServices.value.map((d) => d.superficie),
    sizeVsServices.value.map((d) => d.nServicios),
  ),
)

const regSizeServices = computed(() =>
  math.linearRegression(
    sizeVsServices.value.map((d) => d.superficie),
    sizeVsServices.value.map((d) => d.nServicios),
  ),
)

const scatterSizeServices = computed(() => {
  const points = sizeVsServices.value.map((d) => ({ x: d.superficie, y: d.nServicios }))
  if (points.length < 2) return null
  const xs = points.map((p) => p.x)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const reg = regSizeServices.value
  return {
    datasets: [
      { label: 'Humedal', data: points, backgroundColor: '#10B981', pointRadius: 6 },
      {
        label: `Tendencia (R²=${reg.r2.toFixed(2)})`,
        data: [{ x: minX, y: reg.predict(minX) }, { x: maxX, y: reg.predict(maxX) }],
        type: 'line', borderColor: '#0EA5E9', backgroundColor: 'transparent', pointRadius: 0, showLine: true,
      },
    ],
  }
})

// Anomalías de superficie por z-score
const superficieAnomalies = computed(() => {
  const xs = superficieValues.value
  const flags = math.flagAnomalies(xs, 1.5)
  const z = math.zScores(xs)
  const list = humedales.value.filter((h) => Number.isFinite(Number(h.superficie)) && Number(h.superficie) > 0)
  return list
    .map((h, i) => ({ humedal: h, z: z[i], isAnomaly: flags[i] }))
    .filter((x) => x.isAnomaly)
    .sort((a, b) => Math.abs(b.z) - Math.abs(a.z))
})

// Comparación entre alcaldías (sólo las que tienen ≥ 2 humedales)
const alcaldiaStats = computed(() => {
  const groups: Record<string, number[]> = {}
  for (const h of humedales.value) {
    if (!Number.isFinite(Number(h.superficie))) continue
    if (!groups[h.alcaldia]) groups[h.alcaldia] = []
    groups[h.alcaldia].push(Number(h.superficie))
  }
  return Object.entries(groups)
    .map(([alcaldia, values]) => ({ alcaldia, ...math.describe(values) }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.mean - a.mean)
})

// ────────── MODELADO ──────────
// Índice de salud compuesto del humedal: 0–100. Combina:
//   – Tiene superficie reportada (peso 0.3)
//   – Número de servicios ecosistémicos (peso 0.4, normalizado a 5)
//   – Tipo de vegetación rica (≥2 tipos) (peso 0.15)
//   – Estado activo (peso 0.15)
const healthIndex = computed(() => {
  return humedales.value.map((h) => {
    const hasSize = Number.isFinite(Number(h.superficie)) && Number(h.superficie) > 0 ? 30 : 0
    const services = Math.min(5, (h.serviciosEcosistemicos || []).length) / 5 * 40
    const vegRich = (h.tipoVegetacion || []).length >= 2 ? 15 : 0
    const active = h.estado === 'activo' ? 15 : h.estado === 'en_expansion' ? 10 : 5
    return { humedal: h, score: hasSize + services + vegRich + active }
  }).sort((a, b) => b.score - a.score)
})

// K-means: agrupa humedales por (superficie normalizada, n_servicios, n_vegetacion)
const clusterPoints = computed(() => {
  const data = humedales.value
    .filter((h) => Number.isFinite(Number(h.superficie)) && Number(h.superficie) > 0)
    .map((h) => ({
      humedal: h,
      raw: [
        Math.log10(Math.max(1, Number(h.superficie))),
        (h.serviciosEcosistemicos || []).length,
        (h.tipoVegetacion || []).length,
      ],
    }))
  if (data.length === 0) return { humedales: [], points: [] }
  const dim = 3
  const mins = [Infinity, Infinity, Infinity]
  const maxs = [-Infinity, -Infinity, -Infinity]
  for (const d of data) {
    for (let i = 0; i < dim; i++) {
      if (d.raw[i] < mins[i]) mins[i] = d.raw[i]
      if (d.raw[i] > maxs[i]) maxs[i] = d.raw[i]
    }
  }
  const points = data.map((d) =>
    d.raw.map((v, i) => (maxs[i] === mins[i] ? 0 : (v - mins[i]) / (maxs[i] - mins[i]))),
  )
  return { humedales: data.map((d) => d.humedal), points }
})

const clusters = computed(() => {
  const { humedales: hs, points } = clusterPoints.value
  if (points.length === 0) return null
  const result = math.kmeans(points, Math.min(k.value, points.length))
  const groups: { humedales: Humedal[]; centroid: number[] }[] = []
  for (let c = 0; c < result.centroids.length; c++) {
    groups.push({ humedales: [], centroid: result.centroids[c] })
  }
  for (let i = 0; i < hs.length; i++) {
    groups[result.assignments[i]].humedales.push(hs[i])
  }
  return groups.filter((g) => g.humedales.length > 0)
})

// Pronóstico de publicaciones del blog mensuales
const articulosForecast = computed(() => {
  const series = articulosByMonth.value
  if (series.length < 3) return null
  const xs = series.map((_, i) => i)
  const ys = series.map(([, v]) => v)
  const reg = math.linearRegression(xs, ys)
  const futureMonths = 3
  const futureLabels: string[] = []
  const futureValues: number[] = []
  const lastDate = series[series.length - 1][0]
  const [yy, mm] = lastDate.split('-').map(Number)
  for (let i = 1; i <= futureMonths; i++) {
    const d = new Date(yy, (mm - 1) + i, 1)
    futureLabels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    futureValues.push(Math.max(0, Math.round(reg.predict(xs.length - 1 + i))))
  }
  return {
    labels: [...series.map(([k]) => k), ...futureLabels],
    historic: [...ys, ...new Array(futureMonths).fill(null)],
    forecast: [...new Array(series.length - 1).fill(null), ys[ys.length - 1], ...futureValues],
    slope: reg.slope,
    r2: reg.r2,
  }
})

const forecastChart = computed(() => {
  const f = articulosForecast.value
  if (!f) return null
  return {
    labels: f.labels,
    datasets: [
      { label: 'Histórico', data: f.historic, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', fill: false, tension: 0.2 },
      { label: 'Pronóstico', data: f.forecast, borderColor: '#0EA5E9', backgroundColor: 'transparent', borderDash: [6, 4], fill: false, tension: 0.2 },
    ],
  }
})

const baseLineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } } }
const baseBarOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, indexAxis: 'y' as const }
const baseDoughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const } } }
const scatterOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { title: { display: true, text: 'Superficie (m²)' } },
    y: { title: { display: true, text: 'Servicios ecosistémicos' } },
  },
  plugins: { legend: { position: 'bottom' as const } },
}

const formatNumber = (v: number) => v.toLocaleString('es-MX', { maximumFractionDigits: 2 })
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold text-ink">Monitoreo y análisis</h2>
        <p class="mt-1 text-sm text-slate-custom">
          Estadística descriptiva, inferencial y modelado de los humedales artificiales,
          junto con métricas de uso de la plataforma.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model.number="days" class="select !py-1.5 text-xs">
          <option :value="7">Últimos 7 días</option>
          <option :value="30">Últimos 30 días</option>
          <option :value="90">Últimos 90 días</option>
          <option :value="180">Últimos 180 días</option>
        </select>
        <button class="btn-ghost btn-sm" @click="load" :disabled="loading">Actualizar</button>
      </div>
    </header>

    <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>

    <div class="flex flex-wrap gap-2 border-b border-gray-200">
      <button
        v-for="tab in [
          { key: 'interacciones', label: 'Interacciones' },
          { key: 'descriptivo', label: 'Descriptivo' },
          { key: 'inferencial', label: 'Inferencial' },
          { key: 'modelado', label: 'Modelado' },
        ]"
        :key="tab.key"
        class="px-3 py-2 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-slate-custom hover:text-ink'"
        @click="activeTab = tab.key as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- INTERACCIONES -->
    <section v-if="activeTab === 'interacciones'" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Pageviews</p>
          <p class="mt-1 text-3xl font-bold text-primary">{{ summary?.totals.pageviews ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Sesiones únicas</p>
          <p class="mt-1 text-3xl font-bold text-eco">{{ summary?.totals.sessions ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Clicks</p>
          <p class="mt-1 text-3xl font-bold text-secondary">{{ summary?.totals.clicks ?? 0 }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Envíos / aportes</p>
          <p class="mt-1 text-3xl font-bold text-accent">{{ summary?.totals.submits ?? 0 }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-ink">Evolución diaria</h3>
        <div class="h-72">
          <ChartsLineChart v-if="seriesChart" :data="seriesChart" :options="baseLineOptions" />
          <p v-else class="text-sm text-slate-custom">Sin datos</p>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Tipo de evento</h3>
          <div class="h-64">
            <ChartsDoughnutChart v-if="eventTypeChart" :data="eventTypeChart" :options="baseDoughnutOptions" />
            <p v-else class="text-sm text-slate-custom">Sin datos</p>
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Top rutas (pageviews)</h3>
          <div class="h-64">
            <ChartsBarChart v-if="topPathsChart && summary?.topPaths.length" :data="topPathsChart" :options="baseBarOptions" />
            <p v-else class="text-sm text-slate-custom">Sin tráfico todavía</p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-ink">Top elementos clickeados (data-track)</h3>
        <div class="h-64">
          <ChartsBarChart v-if="topTargetsChart && summary?.topTargets.length" :data="topTargetsChart" :options="baseBarOptions" />
          <p v-else class="text-sm text-slate-custom">Sin clicks instrumentados todavía. Marca elementos con <code>data-track="..."</code>.</p>
        </div>
      </div>
    </section>

    <!-- DESCRIPTIVO -->
    <section v-if="activeTab === 'descriptivo'" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Total humedales</p>
          <p class="mt-1 text-3xl font-bold text-primary">{{ humedales.length }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Superficie media (m²)</p>
          <p class="mt-1 text-3xl font-bold text-eco">{{ formatNumber(superficieStats.mean) }}</p>
          <p class="mt-1 text-xs text-slate-custom">σ = {{ formatNumber(superficieStats.std) }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Hallazgos abiertos</p>
          <p class="mt-1 text-3xl font-bold text-accent">{{ hallazgos.length }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Artículos publicados</p>
          <p class="mt-1 text-3xl font-bold text-secondary">{{ articulos.length }}</p>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Humedales por alcaldía</h3>
          <div class="h-64">
            <ChartsBarChart :data="alcaldiaChart" :options="baseBarOptions" />
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Tipo de humedal</h3>
          <div class="h-64">
            <ChartsDoughnutChart :data="tipoChart" :options="baseDoughnutOptions" />
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Estado actual</h3>
          <div class="h-64">
            <ChartsDoughnutChart :data="estadoChart" :options="baseDoughnutOptions" />
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Servicios ecosistémicos</h3>
          <div class="h-64">
            <ChartsBarChart :data="serviciosChart" :options="baseBarOptions" />
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Distribución de superficie (m²)</h3>
          <div class="h-64">
            <ChartsBarChart :data="superficieHistChart" :options="{ ...baseBarOptions, indexAxis: 'x' }" />
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Hallazgos por impacto</h3>
          <div class="h-64">
            <ChartsDoughnutChart :data="hallazgosImpactoChart" :options="baseDoughnutOptions" />
          </div>
        </div>
      </div>
    </section>

    <!-- INFERENCIAL -->
    <section v-if="activeTab === 'inferencial'" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Correlación superficie ↔ servicios</p>
          <p class="mt-1 text-3xl font-bold" :class="corrSizeServices > 0.3 ? 'text-eco' : corrSizeServices < -0.3 ? 'text-red-600' : 'text-ink'">
            {{ formatNumber(corrSizeServices) }}
          </p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">R² regresión</p>
          <p class="mt-1 text-3xl font-bold text-primary">{{ formatNumber(regSizeServices.r2) }}</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <p class="text-xs uppercase tracking-wide text-slate-custom">Anomalías de superficie (|z|&gt;1.5)</p>
          <p class="mt-1 text-3xl font-bold text-accent">{{ superficieAnomalies.length }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-ink">Superficie vs número de servicios</h3>
        <div class="h-72">
          <ChartsScatterChart v-if="scatterSizeServices" :data="scatterSizeServices" :options="scatterOptions" />
          <p v-else class="text-sm text-slate-custom">Datos insuficientes</p>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Comparación entre alcaldías</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs">
                <tr>
                  <th class="px-2 py-2 text-left">Alcaldía</th>
                  <th class="px-2 py-2 text-right">N</th>
                  <th class="px-2 py-2 text-right">Media (m²)</th>
                  <th class="px-2 py-2 text-right">σ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="row in alcaldiaStats" :key="row.alcaldia">
                  <td class="px-2 py-2 font-medium">{{ row.alcaldia }}</td>
                  <td class="px-2 py-2 text-right">{{ row.count }}</td>
                  <td class="px-2 py-2 text-right">{{ formatNumber(row.mean) }}</td>
                  <td class="px-2 py-2 text-right">{{ formatNumber(row.std) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Anomalías de superficie</h3>
          <div v-if="superficieAnomalies.length > 0" class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="row in superficieAnomalies" :key="row.humedal.id" class="flex items-center justify-between border-b border-gray-100 py-2">
              <div>
                <p class="text-sm font-medium text-ink">{{ row.humedal.nombre }}</p>
                <p class="text-xs text-slate-custom">{{ row.humedal.alcaldia }} · {{ formatNumber(Number(row.humedal.superficie)) }} m²</p>
              </div>
              <span class="rounded-full px-2 py-0.5 text-xs" :class="row.z < 0 ? 'bg-red-100 text-red-700' : 'bg-eco/15 text-eco'">
                z = {{ formatNumber(row.z) }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-slate-custom">Sin anomalías significativas</p>
        </div>
      </div>
    </section>

    <!-- MODELADO -->
    <section v-if="activeTab === 'modelado'" class="space-y-5">
      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-ink">Índice compuesto de salud (top 10)</h3>
        <p class="mb-3 text-xs text-slate-custom">
          Combina 4 factores: superficie reportada (30%), número de servicios ecosistémicos (40%),
          riqueza de vegetación (15%) y estado activo (15%).
        </p>
        <ul class="divide-y divide-gray-100">
          <li v-for="row in healthIndex.slice(0, 10)" :key="row.humedal.id" class="flex items-center justify-between py-2 text-sm">
            <div>
              <p class="font-medium text-ink">{{ row.humedal.nombre }}</p>
              <p class="text-xs text-slate-custom">{{ row.humedal.alcaldia }}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                <div class="h-full bg-eco" :style="`width: ${row.score}%`"></div>
              </div>
              <span class="text-sm font-bold text-ink w-10 text-right">{{ row.score.toFixed(0) }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-ink">K-means de humedales</h3>
          <div class="flex items-center gap-2 text-xs">
            <label class="text-slate-custom">k =</label>
            <input v-model.number="k" type="number" min="2" max="6" class="w-16 rounded-md border border-gray-200 px-2 py-1 text-xs" />
          </div>
        </div>
        <p class="mb-3 text-xs text-slate-custom">
          Agrupa humedales por similitud combinando superficie (escala log), número de servicios
          ecosistémicos y riqueza de vegetación. Variables normalizadas min-max.
        </p>
        <div v-if="clusters && clusters.length > 0" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(group, idx) in clusters" :key="idx" class="rounded-xl border border-gray-200 bg-white p-4">
            <p class="mb-2 text-xs font-semibold text-primary">Cluster {{ idx + 1 }} · {{ group.humedales.length }} humedales</p>
            <ul class="space-y-1 text-xs">
              <li v-for="h in group.humedales" :key="h.id" class="flex items-center justify-between border-b border-gray-100 py-1">
                <span class="font-medium text-ink">{{ h.nombre }}</span>
                <span class="text-slate-custom">{{ formatNumber(Number(h.superficie) || 0) }} m²</span>
              </li>
            </ul>
          </div>
        </div>
        <p v-else class="text-sm text-slate-custom">Sin datos suficientes para clusterizar.</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-ink">Pronóstico de publicaciones del blog</h3>
        <p v-if="!articulosForecast" class="text-sm text-slate-custom">
          Se necesitan al menos 3 meses con artículos para proyectar.
        </p>
        <div v-else>
          <div class="h-64">
            <ChartsLineChart :data="forecastChart!" :options="baseLineOptions" />
          </div>
          <p class="mt-3 text-xs text-slate-custom">
            Tendencia: {{ articulosForecast.slope > 0 ? 'creciente' : articulosForecast.slope < 0 ? 'decreciente' : 'estable' }}
            ({{ formatNumber(articulosForecast.slope) }} artículos/mes). R² = {{ formatNumber(articulosForecast.r2) }}.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
