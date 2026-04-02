<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Metodología</h1>
        <p class="mt-2 text-base text-white/80">Criterios de sistematización del inventario de humedales artificiales</p>
      </div>
    </section>

    <!-- Criterios -->
    <section ref="criteriosRef" class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Criterios de sistematización" subtitle="La información fue organizada bajo los siguientes criterios técnicos y ambientales." tag="Metodología" />
        <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="c in criterios" :key="c.title" class="card p-5 reveal">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <span class="text-lg">{{ c.icon }}</span>
            </div>
            <h3 class="text-base font-semibold text-ink">{{ c.title }}</h3>
            <p class="mt-2 text-sm text-slate-custom">{{ c.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tipologías -->
    <section ref="tiposRef" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Tipologías identificadas" subtitle="Se identifican tres categorías principales de humedales artificiales en la CDMX." tag="Clasificación" />
        <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="tipo in tipologias" :key="tipo.title" class="card p-6 reveal">
            <span :class="['badge mb-3', tipo.badgeClass]">{{ tipo.badge }}</span>
            <h3 class="text-base font-semibold text-ink">{{ tipo.title }}</h3>
            <p class="mt-2 text-sm text-slate-custom">{{ tipo.description }}</p>
            <div class="mt-4 rounded-lg bg-surface p-3">
              <p class="text-xs text-ink-muted"><strong>Humedales:</strong> {{ tipo.examples }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios predominantes -->
    <section class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Servicios ecosistémicos predominantes" tag="Beneficios" />
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div v-for="srv in serviciosPredominantes" :key="srv.title" class="card-flat p-4 text-center">
            <span class="text-2xl">{{ srv.icon }}</span>
            <h4 class="mt-2 text-sm font-semibold text-ink">{{ srv.title }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- Limitaciones -->
    <section class="bg-surface py-16">
      <div class="container-narrow">
        <div class="rounded-card border border-accent/30 bg-accent/5 p-6">
          <h3 class="mb-4 text-lg font-semibold text-accent-dark">Limitaciones del inventario</h3>
          <ul class="space-y-3 text-sm text-ink">
            <li class="flex items-start gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-accent-dark">1</span>
              <span><strong>Falta de datos de monitoreo cuantitativo:</strong> La mayoría de los humedales no cuenta con datos públicos de eficiencia en remoción de contaminantes.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-accent-dark">2</span>
              <span><strong>Escasa estandarización en diseño:</strong> Los criterios de diseño varían significativamente entre proyectos, dificultando la comparación.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-accent-dark">3</span>
              <span><strong>Información técnica incompleta:</strong> Las fuentes públicas no siempre reportan superficie, volumen o capacidad de tratamiento.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Respaldo científico -->
    <section class="bg-white py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Respaldo científico" subtitle="La tecnología de humedales artificiales en México cuenta con más de 30 años de investigación académica." tag="Evidencia" />
        <div class="grid gap-6 md:grid-cols-2">
          <div class="card p-5">
            <span class="badge badge-eco mb-3">IPN</span>
            <h4 class="text-sm font-semibold text-ink">CIIEMAD — IPN</h4>
            <p class="mt-2 text-sm text-slate-custom">Líneas de investigación activas en calidad del agua y regeneración de cuerpos de agua artificiales. El presente inventario fue elaborado por el CIIEMAD como parte de la sistematización de infraestructura verde en la CDMX. Tesis de posgrado sobre diseño de humedales para tratamiento.</p>
            <p class="mt-2 text-xs text-ink-muted">Proyecto: Regeneración del Lago del Bosque de San Juan de Aragón.</p>
          </div>
          <div class="card p-5">
            <span class="badge badge-primary mb-3">UNAM</span>
            <h4 class="text-sm font-semibold text-ink">GAIA — Facultad de Química</h4>
            <p class="mt-2 text-sm text-slate-custom">El Grupo Académico Interdisciplinario Ambiental (GAIA), liderado por el Dr. Víctor Manuel Luna Pabello, ha desarrollado tecnología propia de humedales artificiales durante más de 30 años. Diseñó los sistemas del Bosque de Aragón (~1 ha, 250 m³/d) y el sistema SHATTO. Cuenta con 2 patentes y ~10 instalaciones en la UNAM.</p>
            <p class="mt-2 text-xs text-ink-muted">Eficiencia documentada: 80% remoción general, >90% coliformes fecales.</p>
          </div>
          <div class="card p-5">
            <span class="badge badge-secondary mb-3">UAM</span>
            <h4 class="text-sm font-semibold text-ink">UAM-Iztapalapa / UAM-Xochimilco</h4>
            <p class="mt-2 text-sm text-slate-custom">Investigación en el Canal de Cuemanco con especies nativas (<em>Scirpus americanus</em>, <em>Lemna gibba</em>) demostrando remoción de 58-86% en DQO y N amoniacal (220 días). La UAM-X alberga la planta piloto HAFC en el CIBAC, única en su tipo a nivel mundial (2007).</p>
            <p class="mt-2 text-xs text-ink-muted">Fuente: Martínez-Cruz et al. (2006), Hidrobiológica.</p>
          </div>
          <div class="card p-5">
            <span class="badge badge-accent mb-3">UACh</span>
            <h4 class="text-sm font-semibold text-ink">Universidad Autónoma Chapingo</h4>
            <p class="mt-2 text-sm text-slate-custom">Evaluación del humedal del Barrio Santiaguito en Texcoco con resultados sobresalientes: 100% remoción de coliformes, 98.47% sólidos sedimentables, 57.7% DQO/DBO₅. Cumplimiento de NOM-001-SEMARNAT-2021 y NOM-003-SEMARNAT-1997.</p>
            <p class="mt-2 text-xs text-ink-muted">Departamento de Agroecología, UACh.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Datos oficiales -->
    <section class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Datos oficiales" subtitle="Información de fuentes gubernamentales sobre humedales en la Ciudad de México." tag="Gobierno" />
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-primary">34 humedales</p>
            <p class="text-sm text-slate-custom">Creados o recuperados en la CDMX</p>
            <p class="mt-1 text-[10px] text-ink-muted">SEDEMA, 2024</p>
          </div>
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-primary">26.2 hectáreas</p>
            <p class="text-sm text-slate-custom">Superficie total de humedales artificiales</p>
            <p class="mt-1 text-[10px] text-ink-muted">SEDEMA, 2024</p>
          </div>
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-primary">>$1,000 M MXN</p>
            <p class="text-sm text-slate-custom">Inversión en infraestructura de humedales</p>
            <p class="mt-1 text-[10px] text-ink-muted">Gobierno de la CDMX</p>
          </div>
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-eco">397 especies de aves</p>
            <p class="text-sm text-slate-custom">Registradas en humedales CDMX (incremento de 355)</p>
            <p class="mt-1 text-[10px] text-ink-muted">SEDEMA / CONABIO</p>
          </div>
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-eco">10x más CO₂</p>
            <p class="text-sm text-slate-custom">Captura de carbono vs selvas tropicales</p>
            <p class="mt-1 text-[10px] text-ink-muted">CONABIO</p>
          </div>
          <div class="card-flat p-4">
            <p class="text-xl font-bold text-secondary">656 km</p>
            <p class="text-sm text-slate-custom">Red de canales en Xochimilco</p>
            <p class="mt-1 text-[10px] text-ink-muted">SEDEMA (antes 450 km)</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Normatividad -->
    <section class="bg-white py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Marco normativo" tag="Normativa" />
        <div class="grid gap-4 md:grid-cols-2">
          <div class="card-flat p-4">
            <h4 class="text-sm font-semibold text-ink">NOM-001-SEMARNAT-2021</h4>
            <p class="mt-1 text-xs text-slate-custom">Límites permisibles de contaminantes en descargas de aguas residuales en cuerpos receptores.</p>
          </div>
          <div class="card-flat p-4">
            <h4 class="text-sm font-semibold text-ink">NOM-003-SEMARNAT-1997</h4>
            <p class="mt-1 text-xs text-slate-custom">Límites de contaminantes para aguas residuales tratadas que se reúsen en servicios al público.</p>
          </div>
          <div class="card-flat p-4">
            <h4 class="text-sm font-semibold text-ink">Convención Ramsar</h4>
            <p class="mt-1 text-xs text-slate-custom">Xochimilco y San Gregorio Atlapulco: humedal de importancia internacional (2,657 ha).</p>
          </div>
          <div class="card-flat p-4">
            <h4 class="text-sm font-semibold text-ink">CONAGUA — Inventario Nacional</h4>
            <p class="mt-1 text-xs text-slate-custom">Visualizador de humedales de la República Mexicana con clasificación y geolocalización.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fuentes -->
    <section class="bg-surface py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Fuentes y referencias" tag="Bibliografía" />
        <div class="space-y-4 text-sm text-slate-custom">
          <div>
            <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Investigación académica</h4>
            <div class="space-y-2">
              <p>Domínguez Solís, D. (2024). Inventario de humedales artificiales en la Ciudad de México, Fase 1. CIIEMAD-IPN.</p>
              <p>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1), 32-55.</p>
              <p>Martínez-Cruz, P. et al. (2006). Empleo de humedales artificiales para el tratamiento de aguas de un canal experimental de Xochimilco, México. <em>Hidrobiológica</em>, 16(3), 211-219.</p>
              <p>Romero-Aguilar, M. et al. (2009). Tratamiento de aguas residuales por un sistema piloto de humedales artificiales: evaluación de la remoción de la carga orgánica. <em>Rev. Int. Contam. Ambie.</em>, 25(3), 157-167.</p>
              <p>Nava-Rojas, J. et al. (2023). Remoción de contaminantes en humedales artificiales de flujo subsuperficial: una revisión. <em>Ingeniería</em>, 28(1). TecNM.</p>
              <p>UACh, Depto. de Agroecología. Tratamiento de aguas residuales domésticas en humedal del Barrio Santiaguito, Texcoco de Mora, México.</p>
            </div>
          </div>
          <div>
            <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Fuentes oficiales</h4>
            <div class="space-y-2">
              <p>SEDEMA. (2024). Continúa Sedema con acciones para la recuperación y creación de humedales.</p>
              <p>SEDEMA. (2024). Muestra SEDEMA al Ministerio de Medio Ambiente alemán los beneficios de los humedales artificiales del Bosque de San Juan de Aragón.</p>
              <p>SEDEMA. (2023). Humedales de la Ciudad de México: generadores de agua y refugio de la biodiversidad.</p>
              <p>CONAGUA. Inventario Nacional de Humedales — Visualizador geoespacial.</p>
              <p>CONABIO. Sistema de Monitoreo de Humedales en México (SIMOH-Mx).</p>
              <p>Gobierno de la Ciudad de México. (2021). Playa de aves en Bosque de Aragón.</p>
              <p>Gobierno de la Ciudad de México. (2022). Cerro de la Estrella.</p>
              <p>Gobierno de la Ciudad de México. (2023). Áreas Naturales Protegidas reabiertas a la ciudadanía.</p>
              <p>Máspormás. (2021). Humedales artificiales: innovación para tratar aguas residuales.</p>
              <p>Fundación UNAM. (2020). UNAM inaugura humedal artificial en el Bosque de San Juan de Aragón.</p>
              <p>UNAM Global. (2024). Humedal artificial en la UNAM: innovación en tratamiento de aguas residuales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { revealRef: criteriosRef } = useScrollReveal({ stagger: true })
const { revealRef: tiposRef } = useScrollReveal({ stagger: true })

const criterios = [
  { title: 'Ubicación y año', description: 'Coordenadas geográficas y año de implementación de cada humedal.', icon: '📍' },
  { title: 'Tipo de humedal', description: 'Clasificación funcional: conservación, tratamiento, recreativo, captación o restauración.', icon: '🏷️' },
  { title: 'Características técnicas', description: 'Vegetación utilizada, tipo de sustrato, volumen o superficie documentada.', icon: '🔬' },
  { title: 'Uso del agua tratada', description: 'Destino del agua procesada: riego, recirculación, infiltración o mantenimiento.', icon: '💧' },
  { title: 'Servicios ecosistémicos', description: 'Beneficios ambientales documentados: depuración, hábitat, captura de carbono, etc.', icon: '🌿' },
  { title: 'Resultados o monitoreo', description: 'Datos cuantitativos o cualitativos disponibles sobre el desempeño del humedal.', icon: '📊' },
]

const tipologias = [
  {
    title: 'Tratamiento de aguas residuales',
    description: 'Humedales diseñados para depurar aguas residuales y pluviales mediante procesos biológicos. Utilizan vegetación emergente y sustratos filtrantes.',
    examples: 'Bosque de San Juan de Aragón, Parque Ecológico Cuitláhuac',
    badge: 'Tratamiento',
    badgeClass: 'badge-secondary',
  },
  {
    title: 'Conservación y biodiversidad',
    description: 'Sistemas enfocados en la preservación de ecosistemas acuáticos, producción de plantas nativas y refugio de fauna como ajolotes y aves.',
    examples: 'Anfibium (Chapultepec), Vivero San Luis Tlaxialtemalco',
    badge: 'Conservación',
    badgeClass: 'badge-eco',
  },
  {
    title: 'Regulación hidrológica urbana',
    description: 'Infraestructura verde para el control de escorrentías pluviales, captación de agua y recarga de acuíferos en zonas urbanas.',
    examples: 'Bajo Puente Cuemanco, Cerro de la Estrella',
    badge: 'Regulación',
    badgeClass: 'badge-primary',
  },
]

const serviciosPredominantes = [
  { title: 'Regulación hídrica', icon: '💧' },
  { title: 'Captura de carbono', icon: '🌿' },
  { title: 'Hábitat para fauna', icon: '🦆' },
  { title: 'Educación ambiental', icon: '📚' },
]
</script>
