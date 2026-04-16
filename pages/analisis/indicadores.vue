<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Indicadores y análisis</h1>
        <p class="mt-2 text-base text-white/80">Distribución, servicios ecosistémicos y análisis comparativo de humedales artificiales</p>
      </div>
    </section>

    <CommonAnalisisSubNav />

    <!-- Tabs -->
    <div class="sticky top-16 z-30 border-b bg-white/95 backdrop-blur-sm">
      <div class="container-wide">
        <nav class="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            :class="['rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.id ? 'bg-primary text-white' : 'text-ink-muted hover:bg-primary-50 hover:text-primary']">
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <section class="bg-surface py-10">
      <div class="container-wide">

        <!-- Tab 1: Distribución -->
        <div v-show="activeTab === 'distribucion'">
          <CommonSectionTitle title="Distribución" subtitle="Análisis de la distribución geográfica y tipológica de los humedales artificiales." tag="D" />

          <div class="grid gap-8 md:grid-cols-2">
            <div class="panel">
              <h3 class="mb-4 text-base font-semibold">Por alcaldía</h3>
              <div class="h-64">
                <ClientOnly>
                  <ChartsDoughnutChart :data="alcaldiaChartData" :options="doughnutOptions" />
                </ClientOnly>
              </div>
            </div>
            <div class="panel">
              <h3 class="mb-4 text-base font-semibold">Por tipología</h3>
              <div class="h-64">
                <ClientOnly>
                  <ChartsDoughnutChart :data="tipoChartData" :options="doughnutOptions" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="panel mt-8">
            <h3 class="mb-4 text-base font-semibold">Superficie por humedal (m²)</h3>
            <div class="h-64">
              <ClientOnly>
                <ChartsBarChart :data="superficieChartData" :options="barOptions" />
              </ClientOnly>
            </div>
          </div>
        </div>

        <!-- Tab 2: Servicios -->
        <div v-show="activeTab === 'servicios'">
          <CommonSectionTitle title="Servicios ecosistémicos" subtitle="Frecuencia y distribución de servicios ambientales entre los humedales artificiales inventariados." tag="S" />

          <div class="panel">
            <h3 class="mb-4 text-base font-semibold">Frecuencia de servicios</h3>
            <div class="h-80">
              <ClientOnly>
                <ChartsBarChart :data="serviciosChartData" :options="serviciosBarOptions" />
              </ClientOnly>
            </div>
          </div>

          <div class="panel mt-8">
            <h3 class="mb-4 text-base font-semibold">Matriz de servicios por humedal artificial</h3>
            <div class="overflow-x-auto">
              <table class="table-base min-w-[700px]">
                <thead>
                  <tr>
                    <th class="cursor-pointer select-none" @click="toggleSort('nombre', 'servicios')">Humedal <span class="text-[10px] opacity-60">{{ sortIcon('nombre', 'servicios') }}</span></th>
                    <th v-for="s in allServicios" :key="s.key" class="text-center text-[10px]">{{ s.short }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="h in sortedHumedalesServicios" :key="h.id">
                    <td class="font-medium whitespace-nowrap">{{ h.nombre.replace(/^Humedal (Artificial )?/, '') }}</td>
                    <td v-for="s in allServicios" :key="s.key" class="text-center">
                      <span v-if="h.serviciosEcosistemicos.includes(s.key as any)" class="text-eco font-bold">✓</span>
                      <span v-else class="text-gray-300">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 3: Comparativo -->
        <div v-show="activeTab === 'comparativo'">
          <CommonSectionTitle title="Análisis comparativo" subtitle="Comparación técnica y temporal de los humedales artificiales inventariados." tag="A" />

          <!-- Timeline -->
          <div class="panel mb-8">
            <h3 class="mb-6 text-base font-semibold">Línea de tiempo de implementación</h3>
            <div class="relative ml-4 border-l-2 border-primary-100 pl-8 space-y-6">
              <div v-for="h in sortedByYear" :key="h.id" class="relative">
                <div class="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {{ h.anioImplementacion.slice(0, 4) }}
                </div>
                <div class="ml-2">
                  <h4 class="text-sm font-semibold text-ink">{{ h.nombre }}</h4>
                  <p class="text-xs text-slate-custom">{{ h.alcaldia }} · {{ formatters.formatTipoHumedal(h.tipoHumedal) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison table -->
          <div class="panel mb-8">
            <h3 class="mb-4 text-base font-semibold">Tabla comparativa</h3>
            <div class="overflow-x-auto">
              <table class="table-base min-w-[800px]">
                <thead>
                  <tr>
                    <th class="cursor-pointer select-none" @click="toggleSort('nombre')">Humedal <span class="text-[10px] opacity-60">{{ sortIcon('nombre') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('alcaldia')">Alcaldía <span class="text-[10px] opacity-60">{{ sortIcon('alcaldia') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('anio')">Año <span class="text-[10px] opacity-60">{{ sortIcon('anio') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('tipo')">Tipo <span class="text-[10px] opacity-60">{{ sortIcon('tipo') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('superficie')">Superficie <span class="text-[10px] opacity-60">{{ sortIcon('superficie') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('servicios')">Servicios <span class="text-[10px] opacity-60">{{ sortIcon('servicios') }}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="h in sortedTable" :key="h.id">
                    <td class="font-medium">{{ h.nombre.replace(/^Humedal (Artificial )?/, '') }}</td>
                    <td>{{ h.alcaldia }}</td>
                    <td>{{ h.anioImplementacion }}</td>
                    <td><span :class="['badge', formatters.tipoHumedalBadgeClass(h.tipoHumedal)]">{{ formatters.formatTipoHumedal(h.tipoHumedal) }}</span></td>
                    <td class="tabular-nums">{{ h.superficie ? formatters.formatArea(h.superficie) : '—' }}</td>
                    <td class="tabular-nums">{{ h.serviciosEcosistemicos.length }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Limitations -->
          <div class="rounded-card border border-accent/30 bg-accent/5 p-6">
            <h3 class="mb-3 text-base font-semibold text-accent-dark">Limitaciones identificadas</h3>
            <ul class="space-y-2 text-sm text-ink">
              <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Falta de datos de monitoreo cuantitativo</li>
              <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Escasa estandarización en diseño</li>
              <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Información técnica incompleta en fuentes públicas</li>
            </ul>
          </div>

          <!-- Sources -->
          <div class="panel mt-8">
            <h3 class="mb-3 text-base font-semibold">Fuentes y referencias</h3>
            <ul class="space-y-1 text-xs text-slate-custom">
              <li><strong>Domínguez Solís, D. (2025). Inventario de humedales artificiales en la CDMX, Fase 1. Tesis de maestría, CIIEMAD-IPN.</strong></li>
              <li>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales... <em>TIP Rev.</em>, 17(1), 32-55. UNAM.</li>
              <li>Fundación UNAM. (2020). UNAM inaugura humedal artificial en Bosque de Aragón.</li>
              <li>Gobierno de la Ciudad de México. (2021). Playa de aves en Bosque de Aragón.</li>
              <li>Gobierno de la Ciudad de México. (2022). Cerro de la Estrella.</li>
            </ul>
          </div>
        </div>

        <!-- Tab 4: Evidencia Científica -->
        <div v-show="activeTab === 'evidencia'">
          <CommonSectionTitle title="Evidencia científica" subtitle="Datos de eficiencia y hallazgos de investigación académica en UNAM, UAM, UACh e IPN aplicables a los humedales artificiales de la CDMX." tag="E" />

          <!-- E.1 Eficiencias de remoción -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.1 Eficiencias de remoción documentadas</h3>
            <p class="mb-4 text-xs text-slate-custom">Compilación de resultados cuantitativos de investigación en humedales artificiales en México. Estos datos permiten estimar el desempeño esperado de los humedales inventariados en la CDMX.</p>
            <div class="overflow-x-auto">
              <table class="table-base min-w-[750px]">
                <thead>
                  <tr>
                    <th class="cursor-pointer select-none" @click="toggleSort('parametro', 'eficiencias')">Parámetro <span class="text-[10px] opacity-60">{{ sortIcon('parametro', 'eficiencias') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('eficiencia', 'eficiencias')">Eficiencia <span class="text-[10px] opacity-60">{{ sortIcon('eficiencia', 'eficiencias') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('institucion', 'eficiencias')">Institución / Estudio <span class="text-[10px] opacity-60">{{ sortIcon('institucion', 'eficiencias') }}</span></th>
                    <th class="cursor-pointer select-none" @click="toggleSort('tipo', 'eficiencias')">Tipo de sistema <span class="text-[10px] opacity-60">{{ sortIcon('tipo', 'eficiencias') }}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in sortedEficiencias" :key="row.parametro + row.institucion">
                    <td class="font-medium">{{ row.parametro }}</td>
                    <td class="tabular-nums font-semibold" :class="eficienciaColor(row.valor)">{{ row.eficiencia }}</td>
                    <td class="text-xs whitespace-normal max-w-[200px]">{{ row.institucion }}</td>
                    <td class="text-xs">{{ row.tipo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- E.2 IPN -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.2 Investigación IPN</h3>
            <div class="space-y-3 text-sm text-slate-custom">
              <p>El IPN mantiene líneas de investigación activas en manejo de calidad del agua y recuperación de cuerpos de agua contaminados, incluyendo el proyecto "Sistema de regeneración de cuerpos de agua artificiales para el saneamiento del Lago del Bosque de San Juan de Aragón, CDMX".</p>
              <p>En el repositorio de tesis del IPN se documentan propuestas de diseño de humedales artificiales para tratamiento de aguas residuales en la CDMX, incluyendo diseños para riego de parques urbanos.</p>
              <p>El presente inventario fue elaborado por M. en C. Diego Domínguez Solís como parte de la sistematización de infraestructura verde en la ciudad.</p>
            </div>
          </div>

          <!-- E.3 Aragón case study -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.3 Caso de estudio: STHA Bosque de Aragón (Facultad de Química, UNAM)</h3>
            <p class="mb-4 text-xs text-slate-custom">Sistema de Tratamiento a base de Humedales Artificiales (STHA) diseñado por el Grupo Académico Interdisciplinario Ambiental (GAIA) de la Facultad de Química, UNAM. Investigador principal: Dr. Víctor Manuel Luna Pabello. Inaugurado en 2012, es el mayor humedal artificial de la CDMX. Un segundo humedal fue construido en 2020 (3,108 m², 140 m³/d). Fuente: Luna-Pabello &amp; Aburto-Castañeda (2014), <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1).</p>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div v-for="stat in aragonStats" :key="stat.label" class="card-flat p-4 text-center">
                <p class="text-2xl font-bold text-primary">{{ stat.value }}</p>
                <p class="text-xs text-slate-custom">{{ stat.label }}</p>
              </div>
            </div>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div class="rounded-lg bg-surface p-4">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Componentes del sistema</h4>
                <ul class="space-y-1 text-sm">
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Canales de conducción con filtro de roca caliza</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Tanque sedimentador (44 m²)</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Humedal de flujo subsuperficial (HAFSS): 2,351 m²</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Humedal de flujo superficial (HAFS): 5,734 m²</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Muro gavión filtrante</li>
                </ul>
              </div>
              <div class="rounded-lg bg-surface p-4">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Resultados de remoción</h4>
                <ul class="space-y-1 text-sm">
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-eco" />Contaminantes generales: <strong>80%</strong></li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-eco" />Nitrógeno: <strong>50%</strong> (HAFSS)</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-eco" />Fósforo: <strong>50%</strong> (HAFS)</li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-eco" />Coliformes fecales: <strong>&gt;90%</strong></li>
                  <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-eco" />Cumple NOM-001 y NOM-003 SEMARNAT</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- E.4 Xochimilco -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.4 Investigación en Xochimilco (UAM-X / UNAM)</h3>
            <p class="mb-4 text-xs text-slate-custom">Estudios realizados en el Canal de Cuemanco, zona chinampera de Xochimilco, usando especies nativas.</p>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="card-flat p-4">
                <h4 class="mb-2 text-sm font-semibold text-ink">Humedal con <em>Scirpus americanus</em></h4>
                <div class="space-y-1 text-sm">
                  <p>DQO: <strong class="text-eco">58.52%</strong></p>
                  <p>N amoniacal: <strong class="text-eco">86.35%</strong></p>
                  <p>Nitritos: <strong class="text-eco">89.47%</strong></p>
                  <p>Fósforo reactivo: <strong class="text-accent">38.44%</strong></p>
                </div>
              </div>
              <div class="card-flat p-4">
                <h4 class="mb-2 text-sm font-semibold text-ink">Humedal con <em>Lemna gibba</em></h4>
                <div class="space-y-1 text-sm">
                  <p>DQO: <strong class="text-accent">48.38%</strong></p>
                  <p>N amoniacal: <strong class="text-eco">80.33%</strong></p>
                  <p>Nitritos: <strong class="text-eco">90.23%</strong></p>
                  <p>Fósforo reactivo: <strong class="text-eco">50.20%</strong></p>
                </div>
              </div>
            </div>
            <p class="mt-3 text-xs text-ink-muted">Fuente: Martínez-Cruz, P. et al. (2006). <em>Hidrobiológica</em>, 16(3), 211-219. Período de tratamiento: 220 días.</p>
            <div class="mt-4 rounded-lg border border-secondary/30 bg-secondary/5 p-4">
              <h4 class="mb-2 text-sm font-semibold text-secondary-dark">Planta piloto HAFC (FQ-UNAM + UAM-X, 2007)</h4>
              <p class="text-sm text-slate-custom">Humedal Artificial de Flujo Combinado instalado en el Centro de Investigaciones Biológicas y Acuícolas de Cuemanco (CIBAC) de la UAM-Xochimilco. Planta única en su tipo a nivel mundial, resultado de la colaboración entre la Facultad de Química de la UNAM y la UAM-X.</p>
            </div>
          </div>

          <!-- E.5 Chapingo / otros -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.5 Eficiencias en sistema piloto (UAEMor / UAEMéx, 2009)</h3>
            <p class="mb-4 text-xs text-slate-custom">Sistema de flujo horizontal subsuperficial con <em>Phragmites australis</em> y <em>Typha dominguensis</em> en sustrato de tezontle y arena.</p>
            <div class="grid gap-4 md:grid-cols-3">
              <div class="card-flat p-4 text-center">
                <p class="text-2xl font-bold text-eco">95.7%</p>
                <p class="text-xs text-slate-custom">Remoción DQO (estiaje)</p>
              </div>
              <div class="card-flat p-4 text-center">
                <p class="text-2xl font-bold text-eco">89.7%</p>
                <p class="text-xs text-slate-custom">Remoción N amoniacal (lluvias)</p>
              </div>
              <div class="card-flat p-4 text-center">
                <p class="text-2xl font-bold text-accent">40.4%</p>
                <p class="text-xs text-slate-custom">Remoción fósforo total (lluvias)</p>
              </div>
            </div>
            <p class="mt-3 text-xs text-ink-muted">Fuente: Romero-Aguilar, M. et al. (2009). <em>Rev. Int. Contam. Ambie.</em>, 25(3). TRH óptimo: 5 días.</p>
          </div>

          <!-- E.6 Datos oficiales CDMX -->
          <div class="panel mb-8">
            <h3 class="mb-2 text-base font-semibold">E.6 Datos oficiales de humedales en la CDMX</h3>
            <p class="mb-4 text-xs text-slate-custom">Información de fuentes oficiales del Gobierno de la Ciudad de México (SEDEMA, CONAGUA).</p>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div v-for="dato in datosOficiales" :key="dato.label" class="card-flat p-4">
                <p class="text-xl font-bold text-primary">{{ dato.value }}</p>
                <p class="text-xs text-slate-custom">{{ dato.label }}</p>
                <p class="mt-1 text-[10px] text-ink-muted">{{ dato.fuente }}</p>
              </div>
            </div>
          </div>

          <!-- E.7 Referencias académicas -->
          <div class="panel">
            <h3 class="mb-3 text-base font-semibold">Referencias académicas y oficiales</h3>
            <div class="space-y-2 text-xs text-slate-custom">
              <p><strong class="text-ink">Fuente primaria</strong></p>
              <p class="ml-3"><strong>Domínguez Solís, D. (2025). <em>Inventario de humedales artificiales en la Ciudad de México, Fase 1</em>. Tesis de maestría. CIIEMAD-IPN.</strong></p>
              <p class="mt-2"><strong class="text-ink">UNAM</strong></p>
              <p class="ml-3">Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1), 32-55. <a href="https://www.scielo.org.mx/scielo.php?script=sci_arttext&amp;pid=S1405-888X2014000100003" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">SciELO</a></p>
              <p class="mt-2"><strong class="text-ink">Fuentes oficiales</strong></p>
              <p class="ml-3">Fundación UNAM. (2020). UNAM inaugura humedal artificial en el Bosque de San Juan de Aragón. <a href="https://www.fundacionunam.org.mx/donde-paso/unam-inaugura-humedal-artificial-en-el-bosque-de-san-juan-de-aragon/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Enlace</a></p>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { humedales } from '~/data/mock-humedales'

const formatters = useFormatters()

const chartPalette = ['#0D6B7E', '#43A047', '#F2A81D', '#4FC3F7', '#D9363E', '#8E44AD', '#1088A0', '#E67E22', '#2ECC71']

const activeTab = ref('distribucion')
const tabs = [
  { id: 'distribucion', label: 'Distribución' },
  { id: 'servicios', label: 'Servicios ecosistémicos' },
  { id: 'comparativo', label: 'Análisis comparativo' },
  { id: 'evidencia', label: 'Evidencia científica' },
]

const eficienciasData = [
  { parametro: 'DQO', eficiencia: '95.7%', valor: 95.7, institucion: 'UAEMor / UAEMéx (2009)', tipo: 'Flujo subsuperficial horizontal' },
  { parametro: 'DQO', eficiencia: '80%', valor: 80, institucion: 'GAIA-UNAM, Aragón (2014)', tipo: 'HAFSS + HAFS combinado' },
  { parametro: 'DQO', eficiencia: '58.5%', valor: 58.5, institucion: 'UAM-I, Xochimilco (2006)', tipo: 'Macrófitas enraizadas (S. americanus)' },
  { parametro: 'N amoniacal', eficiencia: '89.7%', valor: 89.7, institucion: 'UAEMor / UAEMéx (2009)', tipo: 'Phragmites + Typha, lluvias' },
  { parametro: 'N amoniacal', eficiencia: '86.4%', valor: 86.4, institucion: 'UAM-I, Xochimilco (2006)', tipo: 'S. americanus, 220 días' },
  { parametro: 'Nitrógeno', eficiencia: '50%', valor: 50, institucion: 'GAIA-UNAM, Aragón (2014)', tipo: 'HAFSS con grava ígnea' },
  { parametro: 'Fósforo', eficiencia: '50%', valor: 50, institucion: 'GAIA-UNAM, Aragón (2014)', tipo: 'HAFS con roca caliza' },
  { parametro: 'Fósforo reactivo', eficiencia: '50.2%', valor: 50.2, institucion: 'UAM-I, Xochimilco (2006)', tipo: 'L. gibba flotante' },
  { parametro: 'Coliformes fecales', eficiencia: '>90%', valor: 90, institucion: 'GAIA-UNAM, Aragón (2014)', tipo: 'Sistema combinado' },
  { parametro: 'Coliformes', eficiencia: '100%', valor: 100, institucion: 'UACh, Texcoco', tipo: 'Humedal Santiaguito' },
  { parametro: 'Sólidos sedimentables', eficiencia: '98.5%', valor: 98.5, institucion: 'UACh, Texcoco', tipo: 'Humedal Santiaguito' },
  { parametro: 'DQO/DBO₅', eficiencia: '57.7%', valor: 57.7, institucion: 'UACh, Texcoco', tipo: 'Humedal Santiaguito' },
  { parametro: 'Nitritos', eficiencia: '90.2%', valor: 90.2, institucion: 'UAM-I, Xochimilco (2006)', tipo: 'L. gibba flotante' },
]

function eficienciaColor(valor: number): string {
  if (valor >= 80) return 'text-eco-dark'
  if (valor >= 50) return 'text-accent-dark'
  return 'text-alert-dark'
}

const aragonStats = [
  { value: '~1 ha', label: 'Superficie total del sistema' },
  { value: '250 m³/d', label: 'Capacidad de tratamiento' },
  { value: '80%', label: 'Remoción general contaminantes' },
  { value: '25 años', label: 'Vida útil proyectada' },
]

const datosOficiales = [
  { value: '34', label: 'Humedales creados/recuperados en CDMX', fuente: 'SEDEMA, 2024' },
  { value: '26.2 ha', label: 'Superficie total de humedales artificiales', fuente: 'SEDEMA, 2024' },
  { value: '>$1,000 M', label: 'Inversión en MXN', fuente: 'Gobierno CDMX' },
  { value: '397', label: 'Especies de aves registradas', fuente: 'SEDEMA (incremento de 355)' },
  { value: '210', label: 'Especies de aves en Bosque de Aragón', fuente: 'SEDEMA, 49 migratorias' },
  { value: '300+', label: 'Especies de aves en humedales CDMX', fuente: 'CONABIO / SEDEMA' },
  { value: '10x', label: 'Más captura de CO₂ que selvas tropicales', fuente: 'CONABIO, humedales vs selvas' },
  { value: '15', label: 'Especies de plantas acuáticas (12 en peligro)', fuente: 'Vivero S.L. Tlaxialtemalco' },
  { value: '656 km', label: 'Red de canales en Xochimilco', fuente: 'SEDEMA (antes 450 km)' },
]

const allServicios = [
  { key: 'depuracion_agua', short: 'Depuración' },
  { key: 'habitat_fauna', short: 'Hábitat' },
  { key: 'educacion_ambiental', short: 'Educación' },
  { key: 'captura_carbono', short: 'CO₂' },
  { key: 'regulacion_termica', short: 'Térmica' },
  { key: 'control_inundaciones', short: 'Inundac.' },
  { key: 'recarga_acuiferos', short: 'Recarga' },
  { key: 'banco_germoplasma', short: 'Germop.' },
  { key: 'recreacion', short: 'Recreac.' },
  { key: 'reduccion_lst', short: 'LST' },
]

// Chart data
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } } }
const barOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const, plugins: { legend: { display: false } } }
const serviciosBarOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }

const alcaldiaChartData = computed(() => {
  const counts: Record<string, number> = {}
  humedales.forEach((h) => { counts[h.alcaldia] = (counts[h.alcaldia] || 0) + 1 })
  return {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: ['#0D6B7E', '#43A047', '#F2A81D', '#4FC3F7', '#D9363E', '#8E44AD', '#1088A0'] }],
  }
})

const tipoChartData = computed(() => {
  const counts: Record<string, number> = {}
  humedales.forEach((h) => { counts[formatters.formatTipoHumedal(h.tipoHumedal)] = (counts[formatters.formatTipoHumedal(h.tipoHumedal)] || 0) + 1 })
  return {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: ['#0D6B7E', '#4FC3F7', '#43A047', '#F2A81D', '#D9363E'] }],
  }
})

const superficieChartData = computed(() => {
  const withSurface = humedales.filter((h) => h.superficie).sort((a, b) => (b.superficie || 0) - (a.superficie || 0))
  return {
    labels: withSurface.map((h) => h.nombre.replace(/^Humedal (Artificial )?/, '')),
    datasets: [{ data: withSurface.map((h) => h.superficie), backgroundColor: withSurface.map((_, i) => chartPalette[i % chartPalette.length]), borderRadius: 4 }],
  }
})

const serviciosChartData = computed(() => {
  const counts: Record<string, number> = {}
  allServicios.forEach((s) => {
    counts[s.short] = humedales.filter((h) => h.serviciosEcosistemicos.includes(s.key as any)).length
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return {
    labels: sorted.map(([k]) => k),
    datasets: [{ data: sorted.map(([, v]) => v), backgroundColor: sorted.map((_, i) => chartPalette[i % chartPalette.length]), borderRadius: 4 }],
  }
})

// Sort (generic per-table)
type SortState = { col: string; dir: 'asc' | 'desc' }
const sortStates = reactive<Record<string, SortState>>({
  comparativo: { col: '', dir: 'desc' },
  servicios: { col: '', dir: 'asc' },
  eficiencias: { col: '', dir: 'desc' },
})

// Legacy aliases for comparativo table
const sortCol = computed({ get: () => sortStates.comparativo.col, set: (v) => { sortStates.comparativo.col = v } })
const sortDir = computed({ get: () => sortStates.comparativo.dir, set: (v) => { sortStates.comparativo.dir = v } })

function toggleSort(col: string, table = 'comparativo') {
  const s = sortStates[table]
  if (s.col === col) { s.dir = s.dir === 'asc' ? 'desc' : 'asc' }
  else { s.col = col; s.dir = 'desc' }
}

function sortIcon(col: string, table = 'comparativo') {
  const s = sortStates[table]
  if (s.col !== col) return '↕'
  return s.dir === 'asc' ? '↑' : '↓'
}

// Sorted servicios matrix
const sortedHumedalesServicios = computed(() => {
  const s = sortStates.servicios
  const data = [...humedales]
  if (!s.col) return data
  const dir = s.dir === 'asc' ? 1 : -1
  if (s.col === 'nombre') return data.sort((a, b) => dir * a.nombre.localeCompare(b.nombre))
  if (s.col === 'count') return data.sort((a, b) => dir * (a.serviciosEcosistemicos.length - b.serviciosEcosistemicos.length))
  return data
})

// Sorted eficiencias
const sortedEficiencias = computed(() => {
  const s = sortStates.eficiencias
  const data = [...eficienciasData]
  if (!s.col) return data
  const dir = s.dir === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    if (s.col === 'parametro') return dir * a.parametro.localeCompare(b.parametro)
    if (s.col === 'eficiencia') return dir * (a.valor - b.valor)
    if (s.col === 'institucion') return dir * a.institucion.localeCompare(b.institucion)
    if (s.col === 'tipo') return dir * a.tipo.localeCompare(b.tipo)
    return 0
  })
})

const sortedTable = computed(() => {
  const data = [...humedales]
  if (!sortCol.value) return data
  const dir = sortDir.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    if (sortCol.value === 'nombre') return dir * a.nombre.localeCompare(b.nombre)
    if (sortCol.value === 'alcaldia') return dir * a.alcaldia.localeCompare(b.alcaldia)
    if (sortCol.value === 'anio') return dir * a.anioImplementacion.localeCompare(b.anioImplementacion)
    if (sortCol.value === 'tipo') return dir * a.tipoHumedal.localeCompare(b.tipoHumedal)
    if (sortCol.value === 'superficie') return dir * ((a.superficie || 0) - (b.superficie || 0))
    if (sortCol.value === 'servicios') return dir * (a.serviciosEcosistemicos.length - b.serviciosEcosistemicos.length)
    return 0
  })
})

const sortedByYear = computed(() => [...humedales].sort((a, b) => a.anioImplementacion.localeCompare(b.anioImplementacion)))
</script>

<style scoped>
th.cursor-pointer:hover { background-color: rgba(0, 0, 0, 0.03); }
</style>
