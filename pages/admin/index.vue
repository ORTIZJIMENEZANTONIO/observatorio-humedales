<script setup lang="ts">
import { GLOSSARY } from '~/data/admin-glossary'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

interface Summary {
  observatory?: string
  contenido?: Partial<Record<string, number>>
  prospectos?: { total: number; pendientes: number; aprobados: number; rechazados: number }
  cmsSections?: number
  humedalesByTipo?: Record<string, number>
  humedalesByEstado?: Record<string, number>
  hallazgosByImpacto?: Record<string, number>
  notiProspects?: { total: number; pending: number }
}

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const observatory = config.public.observatory as string
const auth = useAuthStore()
const humedalesStore = useHumedalesStore()
const hallazgosStore = useHallazgosStore()
const notihumedalStore = useNotihumedalStore()
const prospectosStore = useProspectosStore()

const summary = ref<Summary | null>(null)
const loading = ref(true)
const error = ref('')

const num = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch<{ success: boolean; data: Summary }>(
      `/observatory/${observatory}/admin/summary`,
    )
    summary.value = res.data ?? null
  } catch (e: any) {
    // Fallback al conteo de stores locales si el backend no responde.
    summary.value = {
      contenido: {
        humedales: humedalesStore.humedales.length,
        hallazgos: hallazgosStore.hallazgos.length,
        notihumedal: notihumedalStore.articulos.length,
      },
      prospectos: {
        total: prospectosStore.pendientes.length + prospectosStore.aprobados.length,
        pendientes: prospectosStore.pendientes.length,
        aprobados: prospectosStore.aprobados.length,
        rechazados: 0,
      },
    }
    error.value = e?.data?.error?.message || ''
  } finally {
    loading.value = false
  }
}

onMounted(load)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const contenido = computed(() => summary.value?.contenido ?? {})
const prospectos = computed(() => summary.value?.prospectos ?? { total: 0, pendientes: 0, aprobados: 0, rechazados: 0 })
const humedalesByTipo = computed(() => summary.value?.humedalesByTipo ?? {})
const humedalesByEstado = computed(() => summary.value?.humedalesByEstado ?? {})
const hallazgosByImpacto = computed(() => summary.value?.hallazgosByImpacto ?? {})
const notiProspects = computed(() => summary.value?.notiProspects ?? { total: 0, pending: 0 })

const kpis = computed(() => {
  if (!summary.value) return []
  const c = contenido.value
  return [
    {
      label: 'Humedales artificiales',
      tip: 'Total de HA en el inventario fase 1 (Domínguez-Solís 2025, CIIEMAD-IPN). Visibles + ocultos.',
      value: num(c.humedales),
      icon: 'lucide:droplets',
      tone: 'primary',
      to: '/admin/humedales',
    },
    {
      label: 'Hallazgos publicados',
      tip: 'Recomendaciones derivadas del inventario, con impacto categorizado (alto / medio / crítico).',
      value: num(c.hallazgos),
      icon: 'lucide:lightbulb',
      tone: 'eco',
      to: '/admin/hallazgos',
    },
    {
      label: 'Artículos NotiHumedal',
      tip: 'Artículos editoriales publicados en el sitio público. La cola de prospectos del scraper alimenta la creación.',
      value: num(c.notihumedal),
      icon: 'lucide:newspaper',
      tone: 'secondary',
      to: '/admin/notihumedal',
    },
    {
      label: 'Prospectos pendientes',
      tip: 'Sitios candidatos detectados por el detector OSM esperando validación humana antes de pasar al inventario.',
      value: num(prospectos.value.pendientes),
      icon: 'lucide:inbox',
      tone: 'accent',
      to: '/admin/prospectos',
    },
    {
      label: 'Prospectos noticias',
      tip: 'Artículos candidatos extraídos por el scraper Mongabay México que esperan aprobación.',
      value: num(notiProspects.value.pending),
      icon: 'lucide:rss',
      tone: 'coral',
      to: '/admin/notihumedal',
    },
    {
      label: 'Secciones CMS',
      tip: 'Bloques editables del sitio público registrados en obs_cms_sections. Cada uno se puede editar desde /admin/contenido.',
      value: num(summary.value.cmsSections),
      icon: 'lucide:file-text',
      tone: 'primary',
      to: '/admin/contenido',
    },
    {
      label: 'Total prospectos',
      tip: 'Histórico completo del detector OSM: pendientes + aprobados + rechazados.',
      value: num(prospectos.value.total),
      icon: 'lucide:database',
      tone: 'eco',
      to: '/admin/prospectos',
    },
    {
      label: 'Aprobados',
      tip: 'Prospectos validados que ya forman parte del inventario público.',
      value: num(prospectos.value.aprobados),
      icon: 'lucide:check-circle-2',
      tone: 'eco',
      to: '/admin/humedales',
    },
  ]
})

const toneClass = (tone: string) => ({
  primary: 'bg-primary/10 text-primary',
  coral: 'bg-coral/10 text-coral-dark',
  eco: 'bg-eco/10 text-eco-dark',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
}[tone] || 'bg-gray-100 text-gray-700')

const tipoLabel: Record<string, string> = {
  ha_fws: 'HA-FWS (superficial)',
  ha_sfs: 'HA-SFS (subsuperficial)',
  ha_hssf: 'HA-HSSF (horizontal)',
  ha_vssf: 'HA-VSSF (vertical)',
  ha_hibrido: 'HA híbrido',
}

const estadoLabel: Record<string, string> = {
  activo: 'Activo',
  mantenimiento: 'Mantenimiento',
  inactivo: 'Inactivo',
  historico: 'Histórico',
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold text-ink">
          {{ greeting }}<ClientOnly><span v-if="auth.admin?.name">, {{ auth.admin.name }}</span></ClientOnly>
        </h2>
        <p class="mt-1 text-sm text-slate-custom">
          Panel de administración — Observatorio de Humedales Artificiales CDMX.
        </p>
      </div>
      <button class="btn-outline btn-sm" :disabled="loading" @click="load">
        <svg class="h-4 w-4" :class="loading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refrescar
      </button>
    </header>

    <div v-if="error" class="rounded-lg bg-red-50 p-3 text-xs text-red-700">{{ error }}</div>

    <!-- KPI cards -->
    <div v-if="loading && !summary" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="card animate-pulse p-4">
        <div class="flex items-center gap-2">
          <div class="h-9 w-9 rounded-xl bg-gray-200" />
          <div class="h-3 w-20 rounded bg-gray-200" />
        </div>
        <div class="mt-3 h-7 w-12 rounded bg-gray-200" />
      </div>
    </div>

    <div v-else-if="summary" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <NuxtLink
        v-for="c in kpis"
        :key="c.label"
        :to="c.to"
        class="card-interactive flex flex-col gap-2 p-4"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :class="toneClass(c.tone)">
              <Icon :name="c.icon" size="18" />
            </div>
            <span class="text-[10px] font-medium uppercase tracking-wider text-slate-custom leading-tight">
              {{ c.label }}
            </span>
          </div>
          <AdminInfoTooltip :text="c.tip" variant="icon" placement="bottom" :size="14" />
        </div>
        <span class="text-3xl font-bold text-ink tabular-nums">{{ Number(c.value).toLocaleString('es-MX') }}</span>
      </NuxtLink>
    </div>

    <!-- Acciones rápidas -->
    <div v-if="summary" class="card p-5">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-custom">
        Acciones rápidas
        <AdminInfoTooltip
          text="Operaciones del día a día sin tener que navegar por el sidebar."
          variant="icon"
        />
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/prospectos" class="btn-primary btn-sm">
          <Icon name="lucide:radar" size="14" />
          <AdminInfoTooltip :text="GLOSSARY.detectorOsm" variant="inline">Detector OSM</AdminInfoTooltip>
        </NuxtLink>
        <NuxtLink to="/admin/notihumedal" class="btn-outline btn-sm">
          <Icon name="lucide:newspaper" size="14" />
          <AdminInfoTooltip :text="GLOSSARY.scraperMongabay" variant="inline">Cola Mongabay</AdminInfoTooltip>
          <span v-if="notiProspects.pending > 0" class="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {{ notiProspects.pending }}
          </span>
        </NuxtLink>
        <NuxtLink to="/admin/humedales" class="btn-outline btn-sm">
          <Icon name="lucide:droplets" size="14" />
          Inventario
        </NuxtLink>
        <NuxtLink to="/admin/contenido" class="btn-outline btn-sm">
          <Icon name="lucide:file-text" size="14" />
          Editar contenido
        </NuxtLink>
        <NuxtLink to="/admin/analytics" class="btn-outline btn-sm">
          <Icon name="lucide:line-chart" size="14" />
          Analytics
        </NuxtLink>
      </div>
    </div>

    <!-- Bloques de monitoreo -->
    <div v-if="summary" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Cola de prospectos -->
      <NuxtLink to="/admin/prospectos" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:inbox" size="16" class="text-accent" />
            <AdminInfoTooltip :text="GLOSSARY.prospecto" variant="inline">
              Cola de prospectos
            </AdminInfoTooltip>
          </h3>
          <span class="text-xs text-slate-custom">Detector OSM</span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-lg border border-gray-100 p-2.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-custom">Pendientes</p>
            <p class="mt-1 text-xl font-bold text-accent tabular-nums">{{ prospectos.pendientes }}</p>
          </div>
          <div class="rounded-lg border border-gray-100 p-2.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-custom">Aprobados</p>
            <p class="mt-1 text-xl font-bold text-eco tabular-nums">{{ prospectos.aprobados }}</p>
          </div>
          <div class="rounded-lg border border-gray-100 p-2.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-custom">Rechazados</p>
            <p class="mt-1 text-xl font-bold text-ink-muted tabular-nums">{{ prospectos.rechazados }}</p>
          </div>
        </div>
      </NuxtLink>

      <!-- Humedales por tipología -->
      <NuxtLink to="/admin/humedales" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:droplets" size="16" class="text-primary" />
            <AdminInfoTooltip :text="GLOSSARY.ha" variant="inline">
              Humedales por tipología
            </AdminInfoTooltip>
          </h3>
          <span class="text-xs text-slate-custom">Sistema de flujo</span>
        </div>
        <div v-if="Object.keys(humedalesByTipo).length" class="space-y-1.5">
          <div v-for="(count, tipo) in humedalesByTipo" :key="tipo" class="flex items-center justify-between text-xs">
            <span class="text-ink">{{ tipoLabel[tipo] || tipo }}</span>
            <span class="font-mono font-semibold text-ink tabular-nums">{{ count }}</span>
          </div>
        </div>
        <p v-else class="text-xs text-slate-custom">Sin datos.</p>
      </NuxtLink>

      <!-- Humedales por estado operativo -->
      <NuxtLink to="/admin/humedales" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:activity" size="16" class="text-secondary" />
            <AdminInfoTooltip :text="GLOSSARY.estadoHumedal" variant="inline">
              Estado operativo
            </AdminInfoTooltip>
          </h3>
          <span class="text-xs text-slate-custom">Salud del inventario</span>
        </div>
        <div v-if="Object.keys(humedalesByEstado).length" class="flex flex-wrap gap-1.5">
          <span
            v-for="(count, estado) in humedalesByEstado"
            :key="estado"
            class="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary"
          >
            {{ estadoLabel[estado] || estado }}: <strong class="ml-1 tabular-nums">{{ count }}</strong>
          </span>
        </div>
        <p v-else class="text-xs text-slate-custom">Sin datos.</p>
      </NuxtLink>

      <!-- Hallazgos por impacto -->
      <NuxtLink to="/admin/hallazgos" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:lightbulb" size="16" class="text-eco" />
            <AdminInfoTooltip :text="GLOSSARY.hallazgo" variant="inline">
              Hallazgos por impacto
            </AdminInfoTooltip>
          </h3>
          <span class="text-xs text-slate-custom">Recomendaciones</span>
        </div>
        <div v-if="Object.keys(hallazgosByImpacto).length" class="grid grid-cols-3 gap-2">
          <div
            v-for="(count, impacto) in hallazgosByImpacto"
            :key="impacto"
            class="rounded-lg border p-2 text-center"
            :class="{
              'border-alert/30 bg-alert/5': impacto === 'critico',
              'border-accent/30 bg-accent/5': impacto === 'alto',
              'border-eco/30 bg-eco/5': impacto === 'medio',
            }"
          >
            <p class="text-[9px] font-semibold uppercase tracking-wider text-slate-custom capitalize">{{ impacto }}</p>
            <p class="mt-1 text-lg font-bold text-ink tabular-nums">{{ count }}</p>
          </div>
        </div>
        <p v-else class="text-xs text-slate-custom">Sin hallazgos publicados.</p>
      </NuxtLink>

      <!-- Noticias -->
      <NuxtLink to="/admin/notihumedal" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:newspaper" size="16" class="text-secondary" />
            <AdminInfoTooltip :text="GLOSSARY.notihumedal" variant="inline">
              NotiHumedal
            </AdminInfoTooltip>
          </h3>
          <span v-if="notiProspects.pending > 0" class="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-semibold text-coral-dark">
            {{ notiProspects.pending }} prospecto(s)
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="rounded-lg border border-gray-100 p-2">
            <p class="text-[10px] uppercase tracking-wider text-slate-custom">Publicados</p>
            <p class="mt-1 text-lg font-bold text-ink tabular-nums">{{ contenido.notihumedal ?? 0 }}</p>
          </div>
          <div class="rounded-lg border border-gray-100 p-2">
            <p class="text-[10px] uppercase tracking-wider text-slate-custom">
              <AdminInfoTooltip :text="GLOSSARY.prospectoNoticia" variant="inline">Prospectos</AdminInfoTooltip>
            </p>
            <p class="mt-1 text-lg font-bold text-ink tabular-nums">{{ notiProspects.total ?? 0 }}</p>
          </div>
        </div>
      </NuxtLink>

      <!-- CMS -->
      <NuxtLink to="/admin/contenido" class="card-interactive p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="lucide:file-text" size="16" class="text-primary" />
            <AdminInfoTooltip :text="GLOSSARY.cms" variant="inline">
              Contenido editorial (CMS)
            </AdminInfoTooltip>
          </h3>
          <span class="text-xs text-slate-custom">{{ summary.cmsSections ?? 0 }} secciones</span>
        </div>
        <p class="text-xs text-slate-custom">
          Bloques editables sembrados (home, sobre, análisis). Edita el copy del sitio público sin tocar código.
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
