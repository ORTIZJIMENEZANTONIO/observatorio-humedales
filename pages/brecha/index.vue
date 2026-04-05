<template>
  <div>
    <!-- 1. Header Banner -->
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Brecha de cobertura</h1>
        <p class="mt-2 text-base text-white/80">5 de 16 alcaldias cuentan con humedales artificiales en la Ciudad de Mexico</p>
      </div>
    </section>

    <section class="bg-surface section-padding">
      <div class="container-wide">

        <!-- 2. KPI Cards -->
        <div ref="kpiRef" class="stagger-children mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="kpi-card reveal">
            <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Alcaldias totales</p>
            <p class="text-3xl font-extrabold text-primary">16</p>
            <p class="text-xs text-slate-custom">Ciudad de Mexico</p>
          </div>
          <div class="kpi-card reveal">
            <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Con humedales</p>
            <p class="text-3xl font-extrabold text-eco">5</p>
            <p class="text-xs text-slate-custom">31% de cobertura</p>
          </div>
          <div class="kpi-card reveal">
            <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Sin humedales</p>
            <p class="text-3xl font-extrabold text-alert">11</p>
            <p class="text-xs text-slate-custom">69% sin cobertura</p>
          </div>
          <div class="kpi-card reveal">
            <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Indice promedio (sin humedal)</p>
            <p class="text-3xl font-extrabold text-accent">{{ avgIndiceNecesidad }}</p>
            <p class="text-xs text-slate-custom">Necesidad de las 11 alcaldias</p>
          </div>
        </div>

        <!-- 3. Coverage Map -->
        <div ref="mapRef" class="reveal mb-12">
          <CommonSectionTitle title="Mapa de cobertura" subtitle="Distribucion espacial de alcaldias con y sin humedales artificiales." tag="Mapa" />
          <div class="panel">
            <div class="h-[500px] overflow-hidden rounded-lg">
              <ClientOnly>
                <MapCoverageMap :alcaldias="alcaldias" />
                <template #fallback>
                  <div class="flex h-[500px] items-center justify-center bg-surface text-sm text-slate-custom">
                    Cargando mapa...
                  </div>
                </template>
              </ClientOnly>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-custom">
              <div class="flex items-center gap-2">
                <span class="inline-block h-3 w-3 rounded-full bg-primary" />
                Con humedal
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-block h-3 w-3 rounded-full bg-alert" />
                Sin humedal
              </div>
              <div class="flex items-center gap-2">
                <span class="text-ink-muted">Tamano del circulo = indice de necesidad</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Ranking Table -->
        <div ref="tableRef" class="reveal mb-12">
          <CommonSectionTitle title="Ranking por alcaldía" subtitle="Tabla comparativa con indicadores de vulnerabilidad hidrica y ambiental. Haz clic en los encabezados para ordenar." tag="Tabla" />
          <div class="panel">
            <div class="overflow-x-auto">
              <table class="table-base min-w-[800px]">
                <thead>
                  <tr>
                    <th class="cursor-pointer select-none" @click="toggleSort('nombre')">
                      Alcaldia <span>{{ sortIcon('nombre') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('poblacion')">
                      Poblacion <span>{{ sortIcon('poblacion') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('zonasInundacion')">
                      Inundacion <span>{{ sortIcon('zonasInundacion') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('islasCalor')">
                      Isla de Calor <span>{{ sortIcon('islasCalor') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('disponibilidadAgua')">
                      Agua <span>{{ sortIcon('disponibilidadAgua') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('indiceNecesidad')">
                      Indice Necesidad <span>{{ sortIcon('indiceNecesidad') }}</span>
                    </th>
                    <th class="cursor-pointer select-none" @click="toggleSort('estado')">Estado <span class="text-[10px] opacity-60">{{ sortIcon('estado') }}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="a in paginatedTable"
                    :key="a.nombre"
                    :class="{ 'bg-alert/5': !a.tieneHumedal }"
                  >
                    <td class="font-medium whitespace-nowrap">{{ a.nombre }}</td>
                    <td class="tabular-nums">{{ a.poblacion.toLocaleString('es-MX') }}</td>
                    <td class="tabular-nums text-center">
                      <span :class="vulnerabilityBadge(a.zonasInundacion)">{{ a.zonasInundacion }}/5</span>
                    </td>
                    <td class="tabular-nums text-center">
                      <span :class="vulnerabilityBadge(a.islasCalor)">{{ a.islasCalor }}/5</span>
                    </td>
                    <td class="tabular-nums text-center">
                      <span :class="vulnerabilityBadge(a.disponibilidadAgua)">{{ a.disponibilidadAgua }}/5</span>
                    </td>
                    <td class="tabular-nums text-center font-semibold">
                      {{ a.indiceNecesidad?.toFixed(2) ?? '—' }}
                    </td>
                    <td>
                      <span :class="a.tieneHumedal ? 'badge-primary' : 'badge-alert'">
                        {{ a.tieneHumedal ? 'Con humedal' : 'Sin humedal' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4">
              <CommonPaginationControls
                v-model:current-page="currentPage"
                :total-pages="totalPages"
                :total-items="sortedTable.length"
                :per-page="perPage"
              />
            </div>
          </div>
        </div>

        <!-- 5. Top 5 Priority Cards -->
        <div ref="priorityRef" class="mb-12">
          <CommonSectionTitle title="Top 5 alcaldías prioritarias" subtitle="Alcaldias sin humedales con mayor indice de necesidad. El indicador mas critico se resalta en cada caso." tag="Prioridad" />
          <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(a, i) in topFive" :key="a.nombre" class="card-interactive reveal p-6">
              <div class="mb-3 flex items-center justify-between">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-alert/10 text-sm font-bold text-alert">
                  {{ i + 1 }}
                </span>
                <span class="badge-alert">Indice: {{ a.indiceNecesidad?.toFixed(2) }}</span>
              </div>
              <h3 class="mb-2 text-lg font-bold text-ink">{{ a.nombre }}</h3>
              <p class="mb-3 text-xs text-slate-custom">
                Poblacion: {{ a.poblacion.toLocaleString('es-MX') }} hab. &middot;
                Densidad: {{ a.densidadPoblacional.toLocaleString('es-MX') }} hab/km²
              </p>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-custom">Inundacion</span>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-20 rounded-full bg-gray-100">
                      <div class="h-2 rounded-full bg-primary" :style="{ width: `${(a.zonasInundacion / 5) * 100}%` }" />
                    </div>
                    <span class="w-8 text-right tabular-nums font-medium" :class="{ 'text-alert font-bold': highestMetric(a) === 'zonasInundacion' }">{{ a.zonasInundacion }}/5</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-custom">Isla de calor</span>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-20 rounded-full bg-gray-100">
                      <div class="h-2 rounded-full bg-accent" :style="{ width: `${(a.islasCalor / 5) * 100}%` }" />
                    </div>
                    <span class="w-8 text-right tabular-nums font-medium" :class="{ 'text-alert font-bold': highestMetric(a) === 'islasCalor' }">{{ a.islasCalor }}/5</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-custom">Escasez de agua</span>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-20 rounded-full bg-gray-100">
                      <div class="h-2 rounded-full bg-secondary" :style="{ width: `${(a.disponibilidadAgua / 5) * 100}%` }" />
                    </div>
                    <span class="w-8 text-right tabular-nums font-medium" :class="{ 'text-alert font-bold': highestMetric(a) === 'disponibilidadAgua' }">{{ a.disponibilidadAgua }}/5</span>
                  </div>
                </div>
              </div>
              <p class="mt-3 text-xs text-ink-muted">
                Metrica mas critica: <strong class="text-alert">{{ metricLabel(highestMetric(a)) }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- 6. Methodology Note -->
        <div ref="methRef" class="reveal">
          <div class="container-narrow">
            <div class="rounded-card border border-accent/30 bg-accent/5 p-6">
              <h3 class="mb-3 text-base font-semibold text-accent-dark">Nota metodologica</h3>
              <div class="space-y-3 text-sm text-ink">
                <p>
                  El <strong>Indice de Necesidad</strong> se calcula como un promedio ponderado de cuatro variables
                  para cada alcaldia, en escala de 1 a 5:
                </p>
                <ul class="ml-4 list-disc space-y-1 text-sm">
                  <li><strong>Zonas de inundacion (30%)</strong> — Frecuencia y severidad de inundaciones reportadas.</li>
                  <li><strong>Islas de calor (25%)</strong> — Intensidad del efecto de isla de calor urbana.</li>
                  <li><strong>Disponibilidad de agua (30%)</strong> — Escasez hidrica relativa (5 = mas escasa).</li>
                  <li><strong>Densidad poblacional normalizada (15%)</strong> — Poblacion por km², normalizada respecto al maximo de las 16 alcaldias y escalada a 5.</li>
                </ul>
                <p class="text-xs text-ink-muted">
                  Formula: <code class="rounded bg-white px-1.5 py-0.5 text-xs text-primary">Indice = (inundacion * 0.3) + (calor * 0.25) + (agua * 0.3) + (densidadNorm * 0.15)</code>
                </p>
                <p class="text-xs text-ink-muted">
                  Los valores de vulnerabilidad son estimaciones basadas en literatura disponible y fuentes oficiales
                  (Censo INEGI 2020, reportes de SEDEMA y Proteccion Civil CDMX). No corresponden a mediciones directas.
                  Este indice es una herramienta de priorizacion orientativa y no sustituye estudios de factibilidad sitio-especificos.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AlcaldiaCDMX } from '~/types'
import { alcaldiasCDMXConIndice } from '~/data/alcaldias-cdmx'

const { revealRef: kpiRef } = useScrollReveal({ stagger: true })
const { revealRef: mapRef } = useScrollReveal()
const { revealRef: tableRef } = useScrollReveal()
const { revealRef: priorityRef } = useScrollReveal({ stagger: true })
const { revealRef: methRef } = useScrollReveal()

const alcaldias = alcaldiasCDMXConIndice

// ── KPIs ──
const sinHumedal = computed(() => alcaldias.filter((a) => !a.tieneHumedal))

const avgIndiceNecesidad = computed(() => {
  const vals = sinHumedal.value.map((a) => a.indiceNecesidad || 0)
  if (vals.length === 0) return '—'
  const avg = vals.reduce((sum, v) => sum + v, 0) / vals.length
  return avg.toFixed(2)
})

// ── Pagination ──
const currentPage = ref(1)
const perPage = 15

// ── Sortable Table ──
const sortCol = ref('indiceNecesidad')
const sortDir = ref<'asc' | 'desc'>('desc')

function toggleSort(col: string) {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'desc'
  }
}

function sortIcon(col: string) {
  if (sortCol.value !== col) return '\u21D5'
  return sortDir.value === 'asc' ? '\u2191' : '\u2193'
}

const sortedTable = computed(() => {
  const data = [...alcaldias]
  if (!sortCol.value) return data
  const dir = sortDir.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    switch (sortCol.value) {
      case 'nombre':
        return dir * a.nombre.localeCompare(b.nombre)
      case 'poblacion':
        return dir * (a.poblacion - b.poblacion)
      case 'zonasInundacion':
        return dir * (a.zonasInundacion - b.zonasInundacion)
      case 'islasCalor':
        return dir * (a.islasCalor - b.islasCalor)
      case 'disponibilidadAgua':
        return dir * (a.disponibilidadAgua - b.disponibilidadAgua)
      case 'indiceNecesidad':
        return dir * ((a.indiceNecesidad || 0) - (b.indiceNecesidad || 0))
      case 'estado':
        return dir * (Number(a.tieneHumedal) - Number(b.tieneHumedal))
      default:
        return 0
    }
  })
})

const totalPages = computed(() => Math.ceil(sortedTable.value.length / perPage) || 1)
const paginatedTable = computed(() => sortedTable.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage))

watch([sortCol, sortDir], () => { currentPage.value = 1 })

// ── Top 5 Priority ──
const topFive = computed(() =>
  [...sinHumedal.value]
    .sort((a, b) => (b.indiceNecesidad || 0) - (a.indiceNecesidad || 0))
    .slice(0, 5),
)

function highestMetric(a: AlcaldiaCDMX): string {
  const metrics = [
    { key: 'zonasInundacion', val: a.zonasInundacion },
    { key: 'islasCalor', val: a.islasCalor },
    { key: 'disponibilidadAgua', val: a.disponibilidadAgua },
  ]
  metrics.sort((x, y) => y.val - x.val)
  return metrics[0].key
}

function metricLabel(key: string): string {
  const labels: Record<string, string> = {
    zonasInundacion: 'Inundacion',
    islasCalor: 'Isla de calor',
    disponibilidadAgua: 'Escasez de agua',
  }
  return labels[key] || key
}

// ── Vulnerability badge classes ──
function vulnerabilityBadge(value: number): string {
  if (value >= 4) return 'badge-alert'
  if (value >= 3) return 'badge-accent'
  return 'badge-eco'
}
</script>

<style scoped>
th.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
