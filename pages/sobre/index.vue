<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Sobre el Observatorio</h1>
        <p class="mt-2 text-base text-white/80">Plataforma de monitoreo y análisis de humedales artificiales en la Ciudad de México</p>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="container-narrow">
        <div ref="introRef" class="space-y-6">
          <div class="reveal">
            <CommonSectionTitle title="¿Qué es el observatorio?" tag="Acerca de" />
            <p class="text-base leading-relaxed text-slate-custom">
              El Observatorio de Humedales Artificiales CDMX es una plataforma digital que sistematiza, visualiza y analiza información sobre los humedales artificiales implementados en la Ciudad de México.
            </p>
            <p class="mt-4 text-base leading-relaxed text-slate-custom">
              Estos sistemas de infraestructura verde permiten el tratamiento de aguas residuales y pluviales, al tiempo que generan beneficios ambientales, sociales y económicos significativos para la ciudad.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section ref="objSection" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Objetivos" :centered="true" tag="Misión" />
        <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="obj in objetivos" :key="obj.title" class="card p-6 reveal">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <span class="text-lg">{{ obj.icon }}</span>
            </div>
            <h3 class="text-base font-semibold text-ink">{{ obj.title }}</h3>
            <p class="mt-2 text-sm text-slate-custom">{{ obj.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Contexto" tag="Antecedentes" />
        <div class="space-y-4 text-base leading-relaxed text-slate-custom">
          <p>La Ciudad de México ha impulsado la implementación de humedales artificiales como parte de estrategias de infraestructura verde y soluciones basadas en la naturaleza.</p>
          <p>Entre sus principales funciones destacan:</p>
          <ul class="ml-6 space-y-2 list-disc">
            <li>Depuración de contaminantes</li>
            <li>Regulación microclimática</li>
            <li>Conservación de biodiversidad</li>
            <li>Educación ambiental y recreación</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="bg-surface py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Autoría y créditos" tag="Equipo" />
        <div class="card p-6 space-y-3">
          <dl class="space-y-3 text-sm">
            <div><dt class="text-xs text-ink-muted">Inventario elaborado por</dt><dd class="font-semibold">M. en C. Diego Domínguez Solís</dd></div>
            <div><dt class="text-xs text-ink-muted">Institución</dt><dd class="font-semibold">CIIEMAD — Instituto Politécnico Nacional</dd></div>
            <div><dt class="text-xs text-ink-muted">Plataforma</dt><dd class="font-semibold">Herramienta de visualización y análisis geoespacial</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Marco normativo y referencial" tag="Normativa" />
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="norma in normativas" :key="norma.title" class="card-flat p-4">
            <h4 class="text-sm font-semibold text-ink">{{ norma.title }}</h4>
            <p class="mt-1 text-xs text-slate-custom">{{ norma.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { revealRef: introRef } = useScrollReveal()
const { revealRef: objSection } = useScrollReveal({ stagger: true })

const objetivos = [
  { title: 'Sistematizar', description: 'Organizar la información dispersa sobre humedales artificiales en la CDMX en un repositorio accesible.', icon: '📋' },
  { title: 'Visualizar', description: 'Mostrar la distribución geoespacial y características técnicas de cada humedal en mapas interactivos.', icon: '🗺️' },
  { title: 'Analizar', description: 'Evaluar los servicios ecosistémicos y su contribución a la sustentabilidad urbana de la ciudad.', icon: '📊' },
]

const normativas = [
  { title: 'Ley de Aguas de la CDMX', description: 'Marco regulatorio para el manejo integral del agua en la Ciudad de México.' },
  { title: 'Programa de Medio Ambiente CDMX', description: 'Estrategia de sustentabilidad que incluye infraestructura verde.' },
  { title: 'NOM-001-SEMARNAT-2021', description: 'Límites permisibles de contaminantes en descargas de aguas residuales.' },
  { title: 'ODS 6 — Agua limpia y saneamiento', description: 'Garantizar la disponibilidad y gestión sostenible del agua.' },
  { title: 'ODS 11 — Ciudades sostenibles', description: 'Lograr que ciudades sean inclusivas, seguras, resilientes y sostenibles.' },
  { title: 'ODS 15 — Vida de ecosistemas terrestres', description: 'Proteger, restaurar y promover el uso sostenible de los ecosistemas.' },
]
</script>
