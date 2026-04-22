<template>
  <div>
    <!-- Header banner -->
    <CommonHeroSection compact>
      <h1 class="text-3xl font-extrabold text-white md:text-4xl">Hallazgos y recomendaciones</h1>
      <p class="mt-2 text-base text-white/80">Sintesis del inventario Fase 1 y propuestas para la politica publica</p>
    </CommonHeroSection>

    <CommonAnalisisSubNav />

    <!-- Executive summary -->
    <section class="bg-white py-16">
      <div class="container-narrow">
        <div class="panel border-l-4 border-primary">
          <h2 class="mb-3 text-lg font-semibold text-ink">Resumen ejecutivo</h2>
          <p class="text-sm leading-relaxed text-slate-custom">
            El inventario Fase 1 de humedales artificiales en la Ciudad de Mexico (Dominguez Solis, 2025, CIIEMAD-IPN) revela avances significativos en la implementacion de infraestructura verde, pero tambien brechas criticas en monitoreo, cobertura territorial y documentacion de eficiencia. Los 8 humedales artificiales inventariados se concentran en solo 5 de 16 alcaldias y carecen, en su mayoria, de datos cuantitativos de desempeno. Sin embargo, la evidencia academica (Dominguez Solis, 2025; Luna-Pabello &amp; Aburto-Castañeda, 2014) y la ventaja economica estimada — entre $0.50 y $2.00 MXN/m³ frente a $5-15 MXN/m³ en plantas convencionales — respaldan la expansion de esta tecnologia como componente estrategico de la politica hidrica urbana.
          </p>
        </div>
      </div>
    </section>

    <!-- Finding-Recommendation pairs -->
    <section ref="hallazgosRef" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Hallazgos y recomendaciones" subtitle="Cada hallazgo del inventario se acompana de una recomendacion con acciones concretas, responsables y plazos." tag="Analisis" />

        <div class="stagger-children space-y-10">
          <div v-for="h in hallazgos" :key="h.id" class="reveal grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- LEFT: Finding card -->
            <div class="card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div class="mb-4 flex items-start gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {{ h.id }}
                </div>
                <div>
                  <h3 class="text-base font-semibold text-ink">{{ h.titulo }}</h3>
                  <span :class="['mt-1', h.impacto === 'critico' ? 'badge-alert' : 'badge-accent']">
                    Impacto {{ h.impacto }}
                  </span>
                </div>
              </div>
              <p class="mb-4 text-sm leading-relaxed text-slate-custom">{{ h.descripcion }}</p>
              <div class="rounded-lg bg-surface p-4">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Evidencia</h4>
                <ul class="space-y-2">
                  <li v-for="(ev, i) in h.evidencia" :key="i" class="flex items-start gap-2 text-sm text-slate-custom">
                    <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    <span>{{ ev }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- RIGHT: Recommendation card -->
            <div class="card border-t-4 border-eco p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <h3 class="mb-2 text-base font-semibold text-ink">{{ h.recomendacion.titulo }}</h3>
              <p class="mb-4 text-sm leading-relaxed text-slate-custom">{{ h.recomendacion.descripcion }}</p>

              <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Acciones propuestas</h4>
              <ul class="mb-4 space-y-2">
                <li v-for="(accion, i) in h.recomendacion.acciones" :key="i" class="flex items-start gap-2 text-sm text-slate-custom">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-eco" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ accion }}</span>
                </li>
              </ul>

              <div class="mb-3 flex flex-wrap gap-2">
                <span v-for="resp in h.recomendacion.responsables" :key="resp" class="badge-primary">
                  {{ resp }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span :class="plazoClass(h.recomendacion.plazo)">
                  Plazo {{ h.recomendacion.plazo }}
                </span>
                <span v-if="h.recomendacion.costoEstimado" class="badge bg-gray-100 text-ink-muted">
                  {{ h.recomendacion.costoEstimado }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cost comparison table -->
    <section ref="costosRef" class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Comparativo de costos de tratamiento" subtitle="Analisis comparativo entre humedales artificiales y metodos convencionales de tratamiento de agua." tag="Economia" />

        <div ref="tablaRevealRef" class="reveal space-y-6">
          <!-- Card per method -->
          <div v-for="c in sortedCostos" :key="c.metodo" class="panel" :class="{ 'border-l-4 border-primary': c.metodo === 'Humedal artificial' }">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <!-- Header -->
              <div class="md:w-1/4 shrink-0">
                <h3 class="text-base font-semibold text-ink">{{ c.metodo }}</h3>
                <div class="mt-2 flex flex-wrap gap-3">
                  <div>
                    <span class="text-xs text-ink-muted">Costo/m³</span>
                    <p class="text-lg font-bold" :class="c.metodo === 'Humedal artificial' ? 'text-primary' : 'text-ink'">{{ c.costoM3 }}</p>
                  </div>
                  <div>
                    <span class="text-xs text-ink-muted">Eficiencia</span>
                    <p class="text-lg font-bold text-ink">{{ c.eficiencia }}</p>
                  </div>
                </div>
                <!-- Cost bar -->
                <div class="mt-3">
                  <div class="h-2 w-full rounded-full bg-gray-100">
                    <div class="h-2 rounded-full" :class="c.metodo === 'Humedal artificial' ? 'bg-primary' : c.metodo === 'Cloración básica' ? 'bg-secondary' : 'bg-alert'" :style="{ width: costBarWidth(c) }" />
                  </div>
                  <p class="mt-0.5 text-[10px] text-ink-muted">Costo relativo (escala: $0 – $15 MXN/m³)</p>
                </div>
              </div>
              <!-- Ventajas / Desventajas -->
              <div class="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-eco">Ventajas</h4>
                  <ul class="space-y-1.5">
                    <li v-for="(v, i) in c.ventajas" :key="i" class="flex items-start gap-1.5 text-sm text-slate-custom">
                      <span class="mt-0.5 text-eco shrink-0">+</span>
                      <span>{{ v }}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-alert">Desventajas</h4>
                  <ul class="space-y-1.5">
                    <li v-for="(d, i) in c.desventajas" :key="i" class="flex items-start gap-1.5 text-sm text-slate-custom">
                      <span class="mt-0.5 text-alert shrink-0">-</span>
                      <span>{{ d }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- Per-row source -->
            <div class="mt-4 border-t border-gray-100 pt-3">
              <p class="text-xs text-ink-muted"><strong>Fuente del costo:</strong> {{ c.fuente }}</p>
            </div>
          </div>

          <!-- General sources -->
          <div class="rounded-lg bg-surface p-4">
            <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Referencias bibliográficas del comparativo</h4>
            <ul class="space-y-1 text-xs text-slate-custom">
              <li><strong>Domínguez Solís, D. (2025). <em>Inventario de humedales artificiales en la Ciudad de México, Fase 1</em>. Tesis de maestría. CIIEMAD-IPN.</strong></li>
              <li>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1), 32-55. <a href="https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-888X2014000100003" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">SciELO</a></li>
              <li>Fundación UNAM. (2020). UNAM inaugura humedal artificial en el Bosque de San Juan de Aragón. <a href="https://www.fundacionunam.org.mx/donde-paso/unam-inaugura-humedal-artificial-en-el-bosque-de-san-juan-de-aragon/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Enlace</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="bg-primary-50 py-16">
      <div class="container-narrow text-center">
        <h2 class="text-2xl font-bold text-ink md:text-3xl">Continua explorando el inventario</h2>
        <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-custom">
          Estos hallazgos forman parte de un analisis integral de los humedales artificiales de la CDMX. Consulta la brecha de cobertura, los indicadores del inventario y la metodologia empleada para profundizar en el diagnostico.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink to="/analisis/brecha" class="btn-primary">
            Brecha de cobertura
          </NuxtLink>
          <NuxtLink to="/analisis/indicadores" class="btn-outline">
            Indicadores
          </NuxtLink>
          <NuxtLink to="/sobre#metodologia" class="btn-ghost">
            Metodologia
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="bg-surface py-12">
      <div class="container-narrow">
        <div class="rounded-card border border-accent/30 bg-accent/5 p-6">
          <h3 class="mb-2 text-sm font-semibold text-accent-dark">Nota metodologica</h3>
          <p class="text-sm leading-relaxed text-slate-custom">
            Los hallazgos y recomendaciones presentados en esta pagina se basan exclusivamente en la informacion recopilada durante la Fase 1 del inventario de humedales artificiales (Domínguez Solís, 2025) y en evidencia académica publicada (Luna-Pabello & Aburto-Castañeda, 2014). Las estimaciones de costos y eficiencia provienen de literatura academica, no de mediciones directas en los humedales artificiales inventariados. Estas recomendaciones tienen caracter orientativo y no constituyen politica publica vinculante.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const store = useHallazgosStore()
const hallazgos = computed(() => store.publicHallazgos)
const comparativoCostos = computed(() => store.comparativoCostos)

onMounted(async () => {
  try {
    const res = await $fetch<any>(`${config.public.apiBaseUrl}/observatory/${config.public.observatory}/hallazgos`, { timeout: 3000 })
    const items = res?.items || res?.data
    if (items?.length) store.setHallazgos(items)
  } catch { /* use store fallback */ }
})

const { revealRef: hallazgosRef } = useScrollReveal({ stagger: true })
const { revealRef: tablaRevealRef } = useScrollReveal()

const costSortCol = ref('')
const costSortDir = ref<'asc' | 'desc'>('desc')

function toggleCostSort(col: string) {
  if (costSortCol.value === col) { costSortDir.value = costSortDir.value === 'asc' ? 'desc' : 'asc' }
  else { costSortCol.value = col; costSortDir.value = 'desc' }
}

function costSortIcon(col: string) {
  if (costSortCol.value !== col) return '↕'
  return costSortDir.value === 'asc' ? '↑' : '↓'
}

const sortedCostos = computed(() => {
  const data = [...comparativoCostos.value]
  if (!costSortCol.value) return data
  const dir = costSortDir.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    if (costSortCol.value === 'metodo') return dir * a.metodo.localeCompare(b.metodo)
    if (costSortCol.value === 'costoM3') return dir * a.costoM3.localeCompare(b.costoM3)
    if (costSortCol.value === 'eficiencia') return dir * a.eficiencia.localeCompare(b.eficiencia)
    return 0
  })
})

function costBarWidth(c: any): string {
  const max = 15
  const avg = c.costoRango ? (c.costoRango[0] + c.costoRango[1]) / 2 : 0
  return `${Math.min((avg / max) * 100, 100)}%`
}

function plazoClass(plazo: 'corto' | 'mediano' | 'largo'): string {
  const map: Record<string, string> = {
    corto: 'badge-eco',
    mediano: 'badge-secondary',
    largo: 'badge-primary',
  }
  return map[plazo] || 'badge-primary'
}
</script>
