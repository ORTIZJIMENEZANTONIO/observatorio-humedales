<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary to-primary-light">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-secondary" />
        <div class="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-eco" />
      </div>
      <div class="container-wide relative py-20 md:py-26">
        <div class="max-w-3xl">
          <span class="mb-4 inline-flex items-center gap-2 rounded-badge bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-light backdrop-blur-sm">
            <span class="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-glow" />
            Plataforma abierta
          </span>
          <h1 class="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Observatorio de<br>
            <span class="text-gradient-hero">Humedales Artificiales</span><br>
            CDMX
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            Monitoreo, inventario y análisis de humedales artificiales en la Ciudad de México. Infraestructura verde, servicios ecosistémicos y soluciones basadas en la naturaleza.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <NuxtLink to="/mapa" class="btn-primary btn-lg !bg-secondary hover:!bg-secondary-light">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Explorar mapa
            </NuxtLink>
            <NuxtLink to="/metodologia" class="btn btn-lg border border-white/30 text-white hover:bg-white/10">
              Conocer metodología
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- KPIs -->
    <section ref="kpiSection" class="bg-white py-16">
      <div class="container-wide">
        <div class="stagger-children grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card reveal">
            <div class="flex items-center gap-2">
              <div :class="['flex h-8 w-8 items-center justify-center rounded-lg', kpiIconBg(kpi.color)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="kpiIconColor(kpi.color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
            </div>
            <p class="mt-2 text-2xl font-bold text-ink">{{ kpi.valor }}</p>
            <p class="text-xs text-slate-custom">{{ kpi.label }}</p>
            <p v-if="kpi.unidad" class="text-[10px] text-ink-muted">{{ kpi.unidad }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Qué es -->
    <section ref="aboutSection" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Qué es el observatorio" subtitle="Una plataforma integral para el monitoreo, análisis y visualización de humedales artificiales en la Ciudad de México." :centered="true" tag="Acerca de" />
        <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="card-interactive p-6 reveal">
            <div :class="['mb-4 flex h-12 w-12 items-center justify-center rounded-xl', feature.bg]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="feature.iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path v-for="(d, i) in feature.paths" :key="i" :d="d" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-ink">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">{{ feature.description }}</p>
            <NuxtLink :to="feature.to" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light">
              Explorar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section ref="stepsSection" class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Cómo funciona" subtitle="Un flujo de trabajo que integra datos geoespaciales, caracterización técnica y análisis de servicios ecosistémicos." :centered="true" tag="Proceso" />
        <div class="relative">
          <div class="absolute left-1/2 top-12 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-primary via-secondary to-eco lg:block" />
          <div class="stagger-children grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="(step, index) in steps" :key="step.title" class="relative text-center reveal">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">
                {{ index + 1 }}
              </div>
              <h4 class="text-base font-semibold text-ink">{{ step.title }}</h4>
              <p class="mt-2 text-sm text-slate-custom">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tipologías -->
    <section ref="typesSection" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Tipologías de humedales" subtitle="Tres categorías principales identificadas en el inventario de la Ciudad de México." :centered="true" tag="Clasificación" />
        <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="tipo in tipologias" :key="tipo.title" class="card p-6 reveal">
            <span :class="['badge mb-3', tipo.badgeClass]">{{ tipo.badge }}</span>
            <h3 class="text-lg font-semibold text-ink">{{ tipo.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">{{ tipo.description }}</p>
            <p class="mt-3 text-xs text-ink-muted"><strong>Ejemplos:</strong> {{ tipo.examples }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios ecosistémicos -->
    <section ref="servicesSection" class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Servicios ecosistémicos" subtitle="Principales beneficios ambientales que proveen los humedales artificiales de la CDMX." :centered="true" tag="Beneficios" />
        <div class="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="srv in servicios" :key="srv.title" class="card-flat p-5 reveal">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <span class="text-xl">{{ srv.icon }}</span>
            </div>
            <h4 class="text-sm font-semibold text-ink">{{ srv.title }}</h4>
            <p class="mt-1 text-xs text-slate-custom">{{ srv.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ODS Teaser -->
    <section class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Alineación con la Agenda 2030" subtitle="Los humedales artificiales contribuyen directamente a cuatro Objetivos de Desarrollo Sostenible." :centered="true" tag="ODS" />
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <NuxtLink v-for="ods in odsTeaser" :key="ods.numero" to="/sobre#ods" class="card-interactive p-4 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold" :style="{ backgroundColor: ods.color }">
              {{ ods.numero }}
            </div>
            <p class="mt-3 text-sm font-semibold text-ink">{{ ods.nombre }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Map Teaser -->
    <section class="bg-white py-16">
      <div class="container-wide">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <CommonSectionTitle title="Explora la ubicación de los humedales" subtitle="Visualiza los 7 humedales artificiales inventariados en un mapa interactivo con datos técnicos detallados." tag="Mapa" />
            <NuxtLink to="/mapa" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              </svg>
              Ver mapa completo
            </NuxtLink>
          </div>
          <div class="flex h-64 items-center justify-center rounded-card bg-gradient-to-br from-primary-100 to-secondary/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="bg-white py-10">
      <div class="container-narrow">
        <div class="rounded-card border border-accent/30 bg-accent/5 p-6 text-center">
          <p class="text-sm text-ink-muted">
            <strong class="text-accent-dark">Fuente de datos:</strong> Inventario de humedales artificiales en la Ciudad de México, Fase 1.
            Elaboración: M. en C. Diego Domínguez Solís, CIIEMAD — Instituto Politécnico Nacional.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { kpis } from '~/data/kpis'

const { kpiIconBg, kpiIconColor } = useFormatters()

const odsTeaser = [
  { numero: 6, nombre: 'Agua limpia', color: '#26BDE2' },
  { numero: 11, nombre: 'Ciudades sostenibles', color: '#FD9D24' },
  { numero: 13, nombre: 'Acción por el clima', color: '#3F7E44' },
  { numero: 15, nombre: 'Vida de ecosistemas', color: '#56C02B' },
]

const { revealRef: kpiSection } = useScrollReveal({ stagger: true })
const { revealRef: aboutSection } = useScrollReveal({ stagger: true })
const { revealRef: stepsSection } = useScrollReveal({ stagger: true })
const { revealRef: typesSection } = useScrollReveal({ stagger: true })
const { revealRef: servicesSection } = useScrollReveal({ stagger: true })

const features = [
  {
    title: 'Inventario geoespacial',
    description: 'Localización y caracterización de humedales artificiales en la Ciudad de México, con datos de ubicación, superficie y vegetación.',
    to: '/inventario',
    bg: 'bg-primary-50',
    iconColor: 'text-primary',
    paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
  },
  {
    title: 'Servicios ecosistémicos',
    description: 'Análisis de los beneficios ambientales: depuración de agua, hábitat para fauna, captura de carbono y regulación térmica.',
    to: '/indicadores',
    bg: 'bg-eco/10',
    iconColor: 'text-eco',
    paths: ['M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'],
  },
  {
    title: 'Metodología científica',
    description: 'Sistematización basada en criterios técnicos: tipo de humedal, vegetación, sustrato y uso del agua tratada.',
    to: '/metodologia',
    bg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    paths: ['M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18'],
  },
]

const steps = [
  { title: 'Identificación', description: 'Localización de humedales artificiales existentes en la CDMX mediante fuentes oficiales y académicas.' },
  { title: 'Caracterización', description: 'Documentación de tipo, vegetación, sustrato, superficie y capacidad de tratamiento.' },
  { title: 'Análisis', description: 'Evaluación de servicios ecosistémicos y comparación entre tipologías de humedales.' },
  { title: 'Visualización', description: 'Presentación interactiva en mapas y gráficas para tomadores de decisiones.' },
]

const tipologias = [
  {
    title: 'Tratamiento de aguas',
    description: 'Sistemas diseñados para depurar aguas residuales y pluviales mediante procesos biológicos naturales.',
    examples: 'Bosque de Aragón, Parque Ecológico Cuitláhuac',
    badge: 'Tratamiento',
    badgeClass: 'badge-secondary',
  },
  {
    title: 'Conservación y biodiversidad',
    description: 'Humedales enfocados en la preservación de ecosistemas acuáticos y el refugio de fauna nativa.',
    examples: 'Anfibium (Chapultepec), Vivero San Luis Tlaxialtemalco',
    badge: 'Conservación',
    badgeClass: 'badge-eco',
  },
  {
    title: 'Regulación hidrológica',
    description: 'Infraestructura verde para el control de escorrentías, captación pluvial y recarga de acuíferos.',
    examples: 'Bajo Puente Cuemanco, Cerro de la Estrella',
    badge: 'Regulación',
    badgeClass: 'badge-primary',
  },
]

const servicios = [
  { title: 'Depuración de agua', description: 'Eliminación de contaminantes, nitrógeno y patógenos mediante procesos naturales.', icon: '💧' },
  { title: 'Hábitat para fauna', description: 'Refugio para aves acuáticas, ajolotes y diversas especies nativas.', icon: '🦆' },
  { title: 'Captura de carbono', description: 'Secuestro de CO₂ mediante vegetación acuática y procesos del suelo.', icon: '🌿' },
  { title: 'Regulación térmica', description: 'Reducción del efecto isla de calor mediante evapotranspiración.', icon: '🌡️' },
  { title: 'Control de inundaciones', description: 'Retención y filtración de agua pluvial para prevenir anegamientos.', icon: '🌊' },
  { title: 'Educación ambiental', description: 'Espacios de aprendizaje sobre ecosistemas acuáticos y sustentabilidad.', icon: '📚' },
]
</script>

<style scoped>
.text-gradient-hero {
  background: linear-gradient(135deg, #4FC3F7, #43A047);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
