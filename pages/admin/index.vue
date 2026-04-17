<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const observatory = config.public.observatory as string
const auth = useAuthStore()
const humedalesStore = useHumedalesStore()
const hallazgosStore = useHallazgosStore()
const notihumedalStore = useNotihumedalStore()
const prospectosStore = useProspectosStore()

const loading = ref(true)

const summary = computed(() => ({
  contenido: {
    humedales: humedalesStore.humedales.length,
    hallazgos: hallazgosStore.hallazgos.length,
    articulos: notihumedalStore.articulos.length,
  },
  prospectos: {
    pendientes: prospectosStore.pendientes.length,
    aprobados: prospectosStore.aprobados.length,
  },
}))

onMounted(async () => {
  try {
    const res = await apiFetch(`/observatory/${observatory}/admin/summary`)
    // If API returns data, could sync stores here
    if (res.data) { /* API available */ }
  } catch { /* use store counts */ }
  loading.value = false
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos dias'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const quickLinks = [
  { label: 'Prospectos', to: '/admin/prospectos', description: 'Detector OSM + cola de aprobacion de prospectos', color: 'bg-secondary', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' },
  { label: 'Inventario', to: '/admin/humedales', description: 'Humedales artificiales registrados en la CDMX', color: 'bg-primary', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Hallazgos', to: '/admin/hallazgos', description: 'Hallazgos y recomendaciones editoriales', color: 'bg-eco', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Notihumedal', to: '/admin/notihumedal', description: 'Articulos publicados y prospectos de noticias', color: 'bg-secondary', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
]
</script>

<template>
  <div>
    <!-- Welcome message -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-ink">
        {{ greeting }}{{ auth.admin?.name ? `, ${auth.admin.name}` : '' }}
      </h2>
      <p class="mt-1 text-sm text-slate-custom">Panel de administracion del Observatorio de Humedales</p>
    </div>

    <!-- Stats -->
    <div v-if="!loading" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-5 transition-all duration-200 hover:shadow-panel">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-custom">Humedales</p>
            <p class="text-2xl font-bold tabular-nums text-primary">{{ summary.contenido?.humedales ?? 0 }}</p>
          </div>
        </div>
      </div>
      <div class="card p-5 transition-all duration-200 hover:shadow-panel">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-eco/10">
            <svg class="h-5 w-5 text-eco" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-custom">Hallazgos</p>
            <p class="text-2xl font-bold tabular-nums text-eco">{{ summary.contenido?.hallazgos ?? 0 }}</p>
          </div>
        </div>
      </div>
      <div class="card p-5 transition-all duration-200 hover:shadow-panel">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <svg class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-custom">Artículos</p>
            <p class="text-2xl font-bold tabular-nums text-secondary">{{ summary.contenido?.articulos ?? 0 }}</p>
          </div>
        </div>
      </div>
      <div class="card p-5 transition-all duration-200 hover:shadow-panel">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-custom">Prospectos pendientes</p>
            <p class="text-2xl font-bold tabular-nums text-accent">{{ summary.prospectos?.pendientes ?? 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="card animate-pulse p-5">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-gray-200" />
          <div>
            <div class="h-3 w-20 rounded bg-gray-200" />
            <div class="mt-2 h-7 w-12 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline visual -->
    <div class="mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-custom">Pipeline de datos</h3>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <NuxtLink to="/admin/prospectos" class="group flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-2.5 transition-all duration-200 hover:border-secondary hover:bg-secondary/10">
          <svg class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          <div>
            <p class="text-sm font-semibold text-ink">Detector</p>
            <p class="text-xs text-slate-custom">Busqueda OSM</p>
          </div>
        </NuxtLink>
        <svg class="h-5 w-5 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        <NuxtLink to="/admin/prospectos" class="group flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 transition-all duration-200 hover:border-accent hover:bg-accent/10">
          <svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p class="text-sm font-semibold text-ink">Prospectos</p>
            <p class="text-xs text-slate-custom">Pendientes de revision</p>
          </div>
        </NuxtLink>
        <svg class="h-5 w-5 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        <NuxtLink to="/admin/humedales" class="group flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-50 px-4 py-2.5 transition-all duration-200 hover:border-primary hover:bg-primary-50">
          <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <div>
            <p class="text-sm font-semibold text-ink">Inventario</p>
            <p class="text-xs text-slate-custom">Humedales registrados</p>
          </div>
        </NuxtLink>
      </div>
      <p class="mt-3 text-xs text-slate-custom">El detector identifica sitios via OpenStreetMap. Los prospectos aprobados se incorporan al inventario publico.</p>
    </div>

    <!-- Quick Links -->
    <h3 class="mb-4 text-lg font-semibold text-ink">Secciones</h3>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="card-interactive flex items-start gap-4 p-5"
      >
        <div :class="[link.color, 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg shadow-sm']">
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-ink">{{ link.label }}</p>
          <p class="mt-1 text-sm text-slate-custom">{{ link.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
