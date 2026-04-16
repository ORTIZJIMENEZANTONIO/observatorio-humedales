<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Inventario de humedales artificiales</h1>
        <p class="mt-2 text-base text-white/80">{{ store.totalCount }} humedales identificados en {{ store.alcaldias.length }} alcaldías de la Ciudad de México</p>
      </div>
    </section>

    <!-- Filters -->
    <div class="sticky top-16 z-30 border-b bg-white/95 backdrop-blur-sm">
      <div class="container-wide py-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="input-icon-wrapper max-w-xs">
            <Icon name="lucide:search" size="18" class="input-icon" />
            <input v-model="store.searchQuery" type="text" placeholder="Buscar por nombre, alcaldía..." class="input" />
          </div>
          <select v-model="store.filterAlcaldia" class="select max-w-[200px]">
            <option value="">Todas las alcaldías</option>
            <option v-for="a in store.alcaldias" :key="a" :value="a">{{ a }}</option>
          </select>
          <select v-model="store.filterTipo" class="select max-w-[240px]">
            <option value="">Todos los tipos</option>
            <option value="ha_fws">HA flujo superficial (FWS)</option>
            <option value="ha_sfs_horizontal">HA subsuperficial horizontal (HSSF)</option>
            <option value="ha_sfs_vertical">HA subsuperficial vertical (VSSF)</option>
            <option value="ha_hibrido">HA híbrido (FWS + SFS)</option>
          </select>
          <select v-model="sortBy" class="select max-w-[200px]">
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
            <option value="alcaldia_asc">Alcaldía (A-Z)</option>
            <option value="anio_desc">Año (reciente)</option>
            <option value="anio_asc">Año (antiguo)</option>
            <option value="superficie_desc">Superficie (mayor)</option>
          </select>
          <span class="text-sm text-slate-custom">{{ store.filtered.length }} resultados</span>
          <!-- View toggle -->
          <div class="ml-auto flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
            <button @click="viewMode = 'list'" :class="[viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:bg-gray-50']" class="rounded-md px-2.5 py-1.5 transition-all" aria-label="Vista lista">
              <Icon name="lucide:layout-grid" size="16" />
            </button>
            <button @click="viewMode = 'mapa'" :class="[viewMode === 'mapa' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:bg-gray-50']" class="rounded-md px-2.5 py-1.5 transition-all" aria-label="Vista mapa">
              <Icon name="lucide:map" size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Map View -->
    <section v-show="viewMode === 'mapa'" class="bg-surface">
      <div class="h-[calc(100vh-12rem)]">
        <ClientOnly>
          <MapPanel />
          <template #fallback>
            <div class="flex h-full items-center justify-center bg-gray-100">
              <p class="text-sm text-ink-muted">Cargando mapa...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <!-- Cards -->
    <section v-show="viewMode === 'list'" class="bg-surface py-10">
      <div class="container-wide">
        <div ref="gridRef" class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="h in paginatedHumedales" :key="h.id" class="card-interactive overflow-hidden reveal" @click="selected = h">
            <!-- Image header -->
            <div class="relative h-40 overflow-hidden">
              <img v-if="h.imagen" :src="h.imagen" :alt="h.nombre" class="h-full w-full object-cover" loading="lazy" />
              <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-primary to-secondary/60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-base font-bold text-ink">{{ h.nombre }}</h3>
              <p class="mt-1 text-xs text-slate-custom">{{ h.alcaldia }} · {{ h.anioImplementacion }}</p>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span :class="['badge', formatters.tipoHumedalBadgeClass(h.tipoHumedal)]">{{ formatters.formatTipoHumedal(h.tipoHumedal) }}</span>
                <span :class="['badge', formatters.estadoHumedalBadgeClass(h.estado)]">{{ formatters.formatEstadoHumedal(h.estado) }}</span>
              </div>
              <div class="mt-4 space-y-1.5 text-xs text-slate-custom">
                <p><strong>Función:</strong> {{ h.funcionPrincipal }}</p>
                <p v-if="h.superficie"><strong>Superficie:</strong> {{ formatters.formatArea(h.superficie) }}</p>
                <p><strong>Sustrato:</strong> {{ h.sustrato }}</p>
                <p v-if="h.tipoVegetacion?.length"><strong>Vegetación:</strong> {{ h.tipoVegetacion.map(v => formatters.formatTipoVegetacion(v)).join(', ') }}</p>
              </div>
              <div class="mt-3 flex flex-wrap gap-1">
                <span v-for="s in h.serviciosEcosistemicos.slice(0, 3)" :key="s" class="rounded-badge bg-primary-50/60 px-2 py-0.5 text-[10px] text-primary">
                  {{ formatters.formatServicioEcosistemico(s) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <CommonPaginationControls
            v-model:current-page="currentPage"
            :total-pages="totalPages"
            :total-items="store.filtered.length"
            :per-page="perPage"
          />
        </div>
      </div>
    </section>

    <!-- Detail Drawer -->
    <Transition name="fade">
      <div v-if="selected" class="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" @click="selected = null" />
    </Transition>
    <Transition name="slide-right">
      <div v-if="selected" class="fixed right-0 top-0 z-[101] flex h-full w-full max-w-lg flex-col bg-white shadow-2xl overflow-y-auto">
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-lg font-bold text-ink">{{ selected.nombre }}</h2>
          <button class="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100" @click="selected = null">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>
        <div class="flex-1 p-6 space-y-6">
          <div class="flex flex-wrap gap-2">
            <span :class="['badge', formatters.tipoHumedalBadgeClass(selected.tipoHumedal)]">{{ formatters.formatTipoHumedal(selected.tipoHumedal) }}</span>
            <span :class="['badge', formatters.estadoHumedalBadgeClass(selected.estado)]">{{ formatters.formatEstadoHumedal(selected.estado) }}</span>
          </div>

          <div class="space-y-3">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Información general</h4>
            <dl class="grid grid-cols-2 gap-3 text-sm">
              <div><dt class="text-xs text-ink-muted">Alcaldía</dt><dd class="font-medium">{{ selected.alcaldia }}</dd></div>
              <div><dt class="text-xs text-ink-muted">Año</dt><dd class="font-medium">{{ selected.anioImplementacion }}</dd></div>
              <div><dt class="text-xs text-ink-muted">Función</dt><dd class="font-medium">{{ selected.funcionPrincipal }}</dd></div>
              <div v-if="selected.superficie"><dt class="text-xs text-ink-muted">Superficie</dt><dd class="font-medium">{{ formatters.formatArea(selected.superficie) }}</dd></div>
              <div v-if="selected.volumen"><dt class="text-xs text-ink-muted">Volumen</dt><dd class="font-medium">{{ formatters.formatVolume(selected.volumen) }}</dd></div>
              <div v-if="selected.capacidadTratamiento"><dt class="text-xs text-ink-muted">Capacidad</dt><dd class="font-medium">{{ selected.capacidadTratamiento }}</dd></div>
            </dl>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Sustrato</h4>
            <p class="text-sm">{{ selected.sustrato }}</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Uso del agua</h4>
            <p class="text-sm">{{ selected.usoAgua }}</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Vegetación</h4>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="v in selected.vegetacion" :key="v" class="badge badge-eco">{{ v }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Servicios ecosistémicos</h4>
            <ul class="space-y-1 text-sm">
              <li v-for="s in selected.serviciosDescripcion" :key="s" class="flex items-start gap-2">
                <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {{ s }}
              </li>
            </ul>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Monitoreo / Resultados</h4>
            <p class="text-sm text-slate-custom">{{ selected.monitoreo }}</p>
          </div>

          <div v-if="selected.tipoVegetacion?.length" class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tipo de vegetación</h4>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="v in selected.tipoVegetacion" :key="v" class="badge badge-eco">{{ formatters.formatTipoVegetacion(v) }}</span>
            </div>
          </div>

          <div v-if="selected.fuente" class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Fuente de datos</h4>
            <p class="text-sm text-slate-custom">{{ selected.fuente }}</p>
          </div>

          <div v-if="selected.fuenteImagen" class="space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Crédito de imagen</h4>
            <p class="text-sm text-slate-custom">{{ selected.fuenteImagen }}</p>
          </div>

          <div class="rounded-lg bg-surface p-3 text-xs text-ink-muted">
            <strong>Coordenadas:</strong> {{ selected.lat }}, {{ selected.lng }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Humedal } from '~/types'
import { useHumedalesStore } from '~/stores/humedales'

const route = useRoute()
const store = useHumedalesStore()
const formatters = useFormatters()
const selected = ref<Humedal | null>(null)
const sortBy = ref('nombre_asc')
const viewMode = ref<'list' | 'mapa'>(route.query.vista === 'mapa' ? 'mapa' : 'list')
const currentPage = ref(1)
const perPage = 15
const { revealRef: gridRef } = useScrollReveal({ stagger: true })

const sortedHumedales = computed(() => {
  const arr = [...store.filtered]
  switch (sortBy.value) {
    case 'nombre_asc': return arr.sort((a, b) => a.nombre.localeCompare(b.nombre))
    case 'nombre_desc': return arr.sort((a, b) => b.nombre.localeCompare(a.nombre))
    case 'alcaldia_asc': return arr.sort((a, b) => a.alcaldia.localeCompare(b.alcaldia))
    case 'anio_desc': return arr.sort((a, b) => b.anioImplementacion.localeCompare(a.anioImplementacion))
    case 'anio_asc': return arr.sort((a, b) => a.anioImplementacion.localeCompare(b.anioImplementacion))
    case 'superficie_desc': return arr.sort((a, b) => (b.superficie || 0) - (a.superficie || 0))
    default: return arr
  }
})

const totalPages = computed(() => Math.ceil(sortedHumedales.value.length / perPage) || 1)
const paginatedHumedales = computed(() => sortedHumedales.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage))

watch(() => [store.searchQuery, store.filterAlcaldia, store.filterTipo, sortBy.value], () => { currentPage.value = 1 })
</script>

<style scoped>
.slide-right-enter-active { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-right-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
