<template>
  <div>
    <!-- Header banner -->
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Hallazgos y recomendaciones</h1>
        <p class="mt-2 text-base text-white/80">Sintesis del inventario Fase 1 y propuestas para la politica publica</p>
      </div>
    </section>

    <CommonAnalisisSubNav />

    <!-- Executive summary -->
    <section class="bg-white py-16">
      <div class="container-narrow">
        <div class="panel border-l-4 border-primary">
          <h2 class="mb-3 text-lg font-semibold text-ink">Resumen ejecutivo</h2>
          <p class="text-sm leading-relaxed text-slate-custom">
            El inventario Fase 1 de humedales artificiales en la Ciudad de Mexico revela avances significativos en la implementacion de infraestructura verde, pero tambien brechas criticas en monitoreo, cobertura territorial y documentacion de eficiencia. Los 8 humedales artificiales inventariados se concentran en solo 5 de 16 alcaldias y carecen, en su mayoria, de datos cuantitativos de desempeno. Sin embargo, la evidencia academica y la ventaja economica estimada (hasta 10 veces menor costo por metro cubico frente a tratamientos convencionales) respaldan la expansion de esta tecnologia como componente estrategico de la politica hidrica urbana.
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
            <div class="card p-6">
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
            <div class="card border-t-4 border-eco p-6">
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

        <div ref="tablaRevealRef" class="panel reveal">
          <div class="overflow-x-auto">
            <table class="table-base">
              <thead>
                <tr>
                  <th class="cursor-pointer select-none" @click="toggleCostSort('metodo')">Método <span class="text-[10px] opacity-60">{{ costSortIcon('metodo') }}</span></th>
                  <th class="cursor-pointer select-none" @click="toggleCostSort('costoM3')">Costo/m³ <span class="text-[10px] opacity-60">{{ costSortIcon('costoM3') }}</span></th>
                  <th class="cursor-pointer select-none" @click="toggleCostSort('eficiencia')">Eficiencia <span class="text-[10px] opacity-60">{{ costSortIcon('eficiencia') }}</span></th>
                  <th>Ventajas</th>
                  <th class="min-w-[220px]">Desventajas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in sortedCostos" :key="c.metodo" :class="{ 'bg-primary-50': c.metodo === 'Humedal artificial' }">
                  <td class="font-semibold whitespace-nowrap">
                    {{ c.metodo }}
                  </td>
                  <td class="whitespace-nowrap">{{ c.costoM3 }}</td>
                  <td class="whitespace-nowrap">{{ c.eficiencia }}</td>
                  <td class="whitespace-normal min-w-[220px]">
                    <ul class="space-y-1">
                      <li v-for="(v, i) in c.ventajas" :key="i" class="flex items-start gap-1.5 text-xs text-slate-custom">
                        <span class="mt-0.5 text-eco">+</span>
                        <span>{{ v }}</span>
                      </li>
                    </ul>
                  </td>
                  <td class="whitespace-normal min-w-[220px]">
                    <ul class="space-y-1">
                      <li v-for="(d, i) in c.desventajas" :key="i" class="flex items-start gap-1.5 text-xs text-slate-custom">
                        <span class="mt-0.5 text-alert">-</span>
                        <span>{{ d }}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 rounded-lg bg-surface p-4">
            <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Estimación de costos — fuentes</h4>
            <ul class="space-y-1 text-xs text-slate-custom">
              <li>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1). Facultad de Química, UNAM.</li>
              <li>Nava-Rojas, J. et al. (2023). Remoción de contaminantes en humedales artificiales de flujo subsuperficial: una revisión. <em>Ingeniería</em>, 28(1). TecNM Boca del Río.</li>
              <li>Romero-Aguilar, M. et al. (2009). Tratamiento de aguas residuales por un sistema piloto de humedales artificiales. <em>Rev. Int. Contam. Ambie.</em>, 25(3).</li>
              <li>CONAGUA. Datos de costos de operación de plantas de tratamiento convencional en México.</li>
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
            Los hallazgos y recomendaciones presentados en esta pagina se basan exclusivamente en la informacion recopilada durante la Fase 1 del inventario de humedales artificiales (Domínguez Solís, 2024) y en evidencia académica publicada. Las estimaciones de costos y eficiencia provienen de literatura academica y fuentes gubernamentales, no de mediciones directas en los humedales artificiales inventariados. Estas recomendaciones tienen caracter orientativo y no constituyen politica publica vinculante.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { hallazgos, comparativoCostos } from '~/data/hallazgos'

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
  const data = [...comparativoCostos]
  if (!costSortCol.value) return data
  const dir = costSortDir.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    if (costSortCol.value === 'metodo') return dir * a.metodo.localeCompare(b.metodo)
    if (costSortCol.value === 'costoM3') return dir * a.costoM3.localeCompare(b.costoM3)
    if (costSortCol.value === 'eficiencia') return dir * a.eficiencia.localeCompare(b.eficiencia)
    return 0
  })
})

function plazoClass(plazo: 'corto' | 'mediano' | 'largo'): string {
  const map: Record<string, string> = {
    corto: 'badge-eco',
    mediano: 'badge-secondary',
    largo: 'badge-primary',
  }
  return map[plazo] || 'badge-primary'
}
</script>
