<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary to-primary-light min-h-[70vh] flex items-center">
      <!-- Mesh gradient orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="hero-orb hero-orb-1" />
        <div class="hero-orb hero-orb-2" />
        <div class="hero-orb hero-orb-3" />
      </div>
      <div class="container-wide relative py-14 md:py-16">
        <div class="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between lg:gap-16">
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-light backdrop-blur-sm ring-1 ring-white/10">
              <span class="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-glow" />
              Plataforma abierta
            </span>
            <h1 class="mt-6 text-4xl font-extrabold leading-[1.1] text-white md:text-5xl lg:text-6xl">
              Observatorio de<br>
              <span class="text-gradient-hero">Humedales Artificiales</span><br>
              CDMX
            </h1>
            <p class="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              Monitoreo, inventario y análisis de humedales artificiales en la Ciudad de México. Infraestructura verde y soluciones basadas en la naturaleza.
            </p>
            <div class="mt-10 flex flex-wrap gap-3">
              <NuxtLink to="/inventario" class="btn-lg bg-white text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 inline-flex items-center gap-2 px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5">
                <Icon name="lucide:compass" size="20" />
                Explorar inventario
              </NuxtLink>
              <NuxtLink to="/registra" class="btn btn-lg border border-white/25 text-white hover:bg-white/10 backdrop-blur-sm">
                Registra tu humedal
              </NuxtLink>
            </div>
          </div>
          <!-- Humedalito -->
          <div class="shrink-0 animate-float">
            <img
              src="~/assets/humedalito.png"
              alt="Humedalito — mascota del Observatorio de Humedales Artificiales CDMX"
              class="h-44 w-44 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:h-56 md:w-56 lg:h-64 lg:w-64"
            />
            <p class="mt-3 text-center text-xs font-semibold text-white/60 tracking-wide">Humedalito</p>
          </div>
        </div>
      </div>
    </section>

    <!-- KPIs — Bento-inspired -->
    <section ref="kpiSection" class="relative -mt-10 z-10 pb-8">
      <div class="container-wide">
        <div class="stagger-children grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div v-for="kpi in kpis" :key="kpi.label" class="reveal rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100/60 p-4 shadow-lg shadow-black/[0.03]">
            <div :class="['flex h-9 w-9 items-center justify-center rounded-xl', kpiIconBg(kpi.color)]">
              <Icon :name="kpiIcons[kpi.color] || 'lucide:droplets'" size="18" :class="kpiIconColor(kpi.color)" />
            </div>
            <p class="mt-3 text-2xl font-extrabold text-ink tracking-tight">{{ kpi.valor }}</p>
            <p class="text-xs font-medium text-slate-custom leading-snug">{{ kpi.label }}</p>
            <p v-if="kpi.unidad" class="text-[10px] text-ink-muted mt-0.5">{{ kpi.unidad }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Qué es -->
    <section ref="aboutSection" class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle title="¿Qué es el observatorio?" subtitle="Una plataforma integral para el monitoreo, análisis y visualización de humedales artificiales en la Ciudad de México." :centered="true" tag="Acerca de" />
        <div class="stagger-children grid grid-cols-1 gap-5 md:grid-cols-3">
          <NuxtLink v-for="feature in features" :key="feature.title" :to="feature.to" class="card-interactive p-6 reveal group">
            <div :class="['mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110', feature.bg]">
              <Icon :name="feature.icon" size="24" :class="feature.iconColor" />
            </div>
            <h3 class="text-base font-bold text-ink">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">{{ feature.description }}</p>
            <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
              Explorar
              <Icon name="lucide:arrow-right" size="14" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section ref="stepsSection" class="bg-white py-20">
      <div class="container-wide">
        <CommonSectionTitle title="Cómo funciona" subtitle="Un flujo de trabajo que integra datos geoespaciales, caracterización técnica y análisis de servicios ecosistémicos." :centered="true" tag="Proceso" />
        <div class="relative">
          <div class="absolute left-1/2 top-12 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-primary/20 via-primary/40 to-eco/20 lg:block" />
          <div class="stagger-children grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="(step, index) in steps" :key="step.title" class="relative text-center reveal">
              <div class="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-lg font-bold text-white shadow-lg shadow-primary/20">
                {{ index + 1 }}
              </div>
              <h4 class="text-base font-bold text-ink">{{ step.title }}</h4>
              <p class="mt-2 text-sm text-slate-custom leading-relaxed">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tipologías -->
    <section ref="typesSection" class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle title="Tipologías de humedales artificiales" subtitle="Tres categorías principales identificadas en el inventario de la Ciudad de México." :centered="true" tag="Clasificación" />
        <div class="stagger-children grid grid-cols-1 gap-5 md:grid-cols-3">
          <div v-for="tipo in tipologias" :key="tipo.title" class="card p-6 reveal">
            <span :class="['badge mb-3', tipo.badgeClass]">{{ tipo.badge }}</span>
            <h3 class="text-base font-bold text-ink">{{ tipo.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">{{ tipo.description }}</p>
            <p class="mt-4 text-xs text-ink-muted"><span class="font-semibold">Ejemplos:</span> {{ tipo.examples }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios ecosistémicos -->
    <section ref="servicesSection" class="bg-white py-20">
      <div class="container-wide">
        <CommonSectionTitle title="Servicios ecosistémicos" subtitle="Principales beneficios ambientales que proveen los humedales artificiales de la CDMX." :centered="true" tag="Beneficios" />
        <div class="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="srv in servicios" :key="srv.title" class="card-flat p-4 text-center reveal group hover:border-primary/20 transition-colors">
            <div class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 transition-transform duration-300 group-hover:scale-110">
              <Icon :name="srv.icon" size="22" class="text-primary" />
            </div>
            <h4 class="text-xs font-bold text-ink leading-snug">{{ srv.title }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- ODS Teaser -->
    <section class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle title="Alineación con la Agenda 2030" subtitle="Los humedales artificiales contribuyen directamente a cuatro Objetivos de Desarrollo Sostenible." :centered="true" tag="ODS" />
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <NuxtLink v-for="ods in odsTeaser" :key="ods.numero" to="/sobre#ods" class="card-interactive p-5 text-center group">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white text-lg font-bold shadow-lg transition-transform duration-300 group-hover:scale-110" :style="{ backgroundColor: ods.color, boxShadow: `0 8px 24px ${ods.color}30` }">
              {{ ods.numero }}
            </div>
            <p class="mt-4 text-sm font-bold text-ink">{{ ods.nombre }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Map Teaser -->
    <section class="bg-white py-20">
      <div class="container-wide">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <CommonSectionTitle title="Explora la ubicación de los humedales artificiales" subtitle="Visualiza los 8 humedales artificiales inventariados en un mapa interactivo con datos técnicos detallados." tag="Mapa" />
            <NuxtLink to="/mapa" class="btn-primary">
              <Icon name="lucide:map" size="16" />
              Ver mapa completo
            </NuxtLink>
          </div>
          <div class="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 via-secondary/10 to-eco/10 border border-primary/10">
            <Icon name="lucide:map" size="64" class="text-primary/20" />
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="bg-surface py-10">
      <div class="container-narrow">
        <div class="rounded-2xl border border-accent/20 bg-accent/5 p-5 text-center">
          <p class="text-sm text-ink-muted">
            <strong class="text-accent-dark">Fuente de datos:</strong> Inventario de humedales artificiales en la Ciudad de México, Fase 1.
            Elaboración: M. en C. Diego Domínguez Solís — Instituto Politécnico Nacional.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { kpis } from '~/data/kpis'

const { kpiIconBg, kpiIconColor } = useFormatters()

const kpiIcons: Record<string, string> = {
  primary: 'lucide:droplets',
  eco: 'lucide:leaf',
  secondary: 'lucide:map-pin',
  accent: 'lucide:layers',
}

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

const { items: features } = useCmsContent('home', 'features')
const { items: steps } = useCmsContent('home', 'steps')
const { items: tipologias } = useCmsContent('home', 'tipologias')
const { items: servicios } = useCmsContent('home', 'servicios')
</script>

<style scoped>
.text-gradient-hero {
  background: linear-gradient(135deg, #4FC3F7 0%, #43A047 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hero mesh gradient orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
.hero-orb-1 {
  width: 500px; height: 500px;
  background: #4FC3F7;
  top: -150px; right: -100px;
  animation: orbDrift1 20s ease-in-out infinite;
}
.hero-orb-2 {
  width: 400px; height: 400px;
  background: #43A047;
  bottom: -100px; left: -80px;
  animation: orbDrift2 25s ease-in-out infinite;
}
.hero-orb-3 {
  width: 300px; height: 300px;
  background: #F2A81D;
  top: 50%; left: 40%;
  opacity: 0.08;
  animation: orbDrift3 18s ease-in-out infinite;
}

@keyframes orbDrift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-40px, 30px); }
}
@keyframes orbDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}
@keyframes orbDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 15px) scale(1.1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float, .hero-orb { animation: none; }
}
</style>
