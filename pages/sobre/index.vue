<template>
  <div>
    <CommonHeroSection compact>
      <h1 class="text-3xl font-extrabold text-white md:text-4xl">Sobre el observatorio</h1>
      <p class="mt-2 text-base text-white/80">Plataforma de monitoreo y análisis de humedales artificiales en la Ciudad de México</p>
    </CommonHeroSection>

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
          <div v-for="obj in objetivos" :key="obj.title" class="card p-6 reveal hover:-translate-y-0.5 transition-all duration-300">
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
          <p>La Ciudad de México ha impulsado la implementación de humedales artificiales como parte de estrategias de infraestructura verde y soluciones basadas en la naturaleza. El Inventario Fase 1 (Domínguez Solís, 2025, CIIEMAD-IPN) documenta 8 humedales artificiales en 5 alcaldías.</p>
          <p>Entre sus principales funciones, documentadas en el inventario (Domínguez Solís, 2025) y la literatura académica, destacan:</p>
          <ul class="ml-6 space-y-2 list-disc">
            <li>Reducción de contaminantes — hasta 80% de remoción general en el STHA Aragón (Luna-Pabello & Aburto-Castañeda, 2014)</li>
            <li>Regulación microclimática — reducción de temperatura superficial en zonas urbanas</li>
            <li>Conservación de biodiversidad</li>
            <li>Educación ambiental y recreación</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Alineación ODS -->
    <section id="ods" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Alineación con los ODS" subtitle="Los humedales artificiales contribuyen directamente a cuatro Objetivos de Desarrollo Sostenible de la Agenda 2030 de las Naciones Unidas." :centered="true" tag="Agenda 2030" />
        <div ref="odsRef" class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-2">
          <div v-for="ods in odsGoals" :key="ods.id" class="reveal hover:-translate-y-0.5 transition-all duration-300">
            <CommonODSCard :goal="ods" />
          </div>
        </div>

        <!-- Matriz humedal × ODS -->
        <div class="mt-10 panel">
          <h3 class="mb-4 text-base font-semibold text-ink">Contribución por humedal artificial</h3>
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
            <div><dt class="text-xs text-ink-muted">Institución</dt><dd class="font-semibold">Instituto Politécnico Nacional</dd></div>
            <div><dt class="text-xs text-ink-muted">Plataforma</dt><dd class="font-semibold">Herramienta de visualización y análisis geoespacial</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Metodología (absorbe /metodologia) -->
    <section id="metodologia" class="bg-surface py-16">
      <div class="container-wide">
        <CommonSectionTitle title="Metodología" subtitle="Criterios de sistematización del inventario de humedales artificiales." tag="Metodología" />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="c in criterios" :key="c.title" class="card p-5 hover:-translate-y-0.5 transition-all duration-300">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <span class="text-lg">{{ c.icon }}</span>
            </div>
            <h3 class="text-base font-semibold text-ink">{{ c.title }}</h3>
            <p class="mt-2 text-sm text-slate-custom">{{ c.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fuentes -->
    <section id="fuentes" class="bg-white py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Fuentes y referencias" tag="Bibliografía" />
        <div class="space-y-6 text-sm text-slate-custom">
          <div>
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Investigación académica</h4>
            <div class="space-y-3">
              <p>Domínguez Solís, D. (2025). <em>Inventario de humedales artificiales en la Ciudad de México, Fase 1</em>. Tesis de maestría. <strong>CIIEMAD-IPN.</strong></p>
              <p>Domínguez Solís, D. (2025). <em>Humedal artificial: una solución basada en la naturaleza para el tratamiento de aguas residuales a nivel hogar en la Colonia La Laguna Ticomán, Ciudad de México, México</em>. Tesis de maestría. <strong>CIIEMAD-IPN.</strong></p>
              <p>Domínguez-Solís, D., Martínez-Rodríguez, M. C., Ramírez-Escamilla, H. G., Campos-Villegas, L. E., &amp; Domínguez-Solís, R. (2025). Constructed Wetlands as a Decentralized Treatment Option for Domestic Wastewater: A Systematic Review (2015–2024). <em>Water</em>, 17(10), 1451. <a href="https://doi.org/10.3390/w17101451" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">DOI</a></p>
              <p>Domínguez-Solís, D., Martínez-Rodríguez, M. C., Campos-Villegas, L. E., Ramírez-Escamilla, H. G., &amp; Bello-Yañez, X. V. (2026). Sustainable Management of Organic Waste as Substrates in Constructed Wetlands: A Systematic Review. <em>Sustainability</em>, 18(1), 318. <a href="https://doi.org/10.3390/su18010318" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">DOI</a></p>
              <p>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1), 32-55. Facultad de Química, UNAM. <a href="https://www.scielo.org.mx/scielo.php?script=sci_arttext&amp;pid=S1405-888X2014000100003" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Artículo completo en SciELO</a></p>
            </div>
          </div>
          <div>
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Fuentes oficiales</h4>
            <div class="space-y-3">
              <p>Fundación UNAM (2020). UNAM inaugura humedal artificial en el Bosque de San Juan de Aragón. <a href="https://www.fundacionunam.org.mx/donde-paso/unam-inaugura-humedal-artificial-en-el-bosque-de-san-juan-de-aragon/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Enlace</a></p>
              <p>Facultad de Química, UNAM (2024). Inauguran en la Facultad de Química un sistema de humedal artificial para tratamiento de aguas residuales de mingitorios. <a href="https://quimica.unam.mx/inauguracion-shatto-humedal-fq-2024/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Enlace</a></p>
              <p>Gaceta UNAM (2025). En la ENCiT consolidan humedal con ecotecnología. <a href="https://www.gaceta.unam.mx/en-la-encit-consolidan-humedal-con-ecotecnologia/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Enlace</a></p>
              <p>Semanario de la UAM (2019). La UAM instala primeros humedales artificiales en San Mateo Tlaltenango. Año 1, Núm. 12, 11 de noviembre de 2019. <a href="https://www.uam.mx/semanario/repositorio/2019/pdf/noviembre/Semanario-UAM-Anio-1-No-12-11Nov2019.pdf" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">PDF</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="container-narrow">
        <CommonSectionTitle title="Marco normativo y referencial" tag="Normativa" />
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="norma in normativas" :key="norma.title" class="card-flat p-4 hover:-translate-y-0.5 transition-all duration-300">
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

const { items: objetivos } = useCmsContent('sobre', 'objetivos')
const { items: criterios } = useCmsContent('sobre', 'criterios')
const { items: normativas } = useCmsContent('sobre', 'normativas')
</script>
