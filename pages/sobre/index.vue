<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Sobre el observatorio</h1>
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

    <!-- Alineación ODS -->
    <section id="ods" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Alineación con los ODS" subtitle="Los humedales artificiales contribuyen a cuatro Objetivos de Desarrollo Sostenible de la Agenda 2030 de las Naciones Unidas." :centered="true" tag="Agenda 2030" />
        <div ref="odsRef" class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-2">
          <div v-for="ods in odsGoals" :key="ods.id" class="reveal">
            <CommonODSCard :goal="ods" />
          </div>
        </div>

        <!-- Matriz humedal × ODS -->
        <div class="mt-10 panel">
          <h3 class="mb-4 text-base font-semibold text-ink">Contribución por humedal</h3>
          <div class="overflow-x-auto">
            <table class="table-base min-w-[600px]">
              <thead>
                <tr>
                  <th class="cursor-pointer select-none" @click="toggleOdsSort('nombre')">Humedal <span class="text-[10px] opacity-60">{{ odsSortIcon('nombre') }}</span></th>
                  <th v-for="ods in odsGoals" :key="ods.id" class="text-center">
                    <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold" :style="{ backgroundColor: ods.color }">{{ ods.numero }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="h in sortedHumedalesOds" :key="h.id">
                  <td class="font-medium whitespace-nowrap">{{ h.nombre }}</td>
                  <td v-for="ods in odsGoals" :key="ods.id" class="text-center">
                    <span v-if="ods.humedalesRelacionados.includes(h.id)" class="text-eco">&#10003;</span>
                    <span v-else class="text-gray-300">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
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
import { odsGoals } from '~/data/ods-alignment'
import { humedales } from '~/data/mock-humedales'

const { revealRef: introRef } = useScrollReveal()
const { revealRef: objSection } = useScrollReveal({ stagger: true })
const { revealRef: odsRef } = useScrollReveal({ stagger: true })

const odsSortCol = ref('')
const odsSortDir = ref<'asc' | 'desc'>('asc')

function toggleOdsSort(col: string) {
  if (odsSortCol.value === col) { odsSortDir.value = odsSortDir.value === 'asc' ? 'desc' : 'asc' }
  else { odsSortCol.value = col; odsSortDir.value = 'asc' }
}

function odsSortIcon(col: string) {
  if (odsSortCol.value !== col) return '↕'
  return odsSortDir.value === 'asc' ? '↑' : '↓'
}

const sortedHumedalesOds = computed(() => {
  const data = [...humedales]
  if (!odsSortCol.value) return data
  const dir = odsSortDir.value === 'asc' ? 1 : -1
  if (odsSortCol.value === 'nombre') return data.sort((a, b) => dir * a.nombre.localeCompare(b.nombre))
  return data
})

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
