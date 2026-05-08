<script setup lang="ts">
// Manual del observatorio — embebido en /admin (dashboard).
// Pensado para personas sin formacion tecnica: lenguaje accesible que cualquier
// integrante del equipo entienda, pero tecnicamente honesto. Cada seccion abre/cierra
// para que el panel no abrume y el manual sea consultable como referencia.
const sections = [
  { key: 'que-es', label: '¿Qué es este observatorio?', icon: 'lucide:droplets' },
  { key: 'flujo', label: 'Flujo de los datos', icon: 'lucide:git-branch' },
  { key: 'sat', label: 'Percepción remota e índices', icon: 'lucide:satellite' },
  { key: 'detector', label: 'Detector geoespacial OSM', icon: 'lucide:radar' },
  { key: 'tipos', label: 'Tipologías de humedal artificial', icon: 'lucide:layers' },
  { key: 'estad', label: 'Estadística aplicada (Brecha)', icon: 'lucide:chart-area' },
  { key: 'tracking', label: 'Tracking de uso', icon: 'lucide:activity' },
  { key: 'glosario', label: 'Glosario de siglas', icon: 'lucide:book-open' },
  { key: 'limites', label: 'Limitaciones honestas', icon: 'lucide:triangle-alert' },
] as const

type SectionKey = typeof sections[number]['key']
const open = ref<SectionKey | null>('que-es')
const toggle = (k: SectionKey) => { open.value = open.value === k ? null : k }
</script>

<template>
  <section class="card overflow-hidden">
    <header class="flex items-start gap-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-eco/5 p-5">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon name="lucide:book-open-check" size="20" />
      </div>
      <div class="flex-1">
        <h2 class="text-base font-semibold text-ink">Manual del observatorio</h2>
        <p class="mt-1 text-xs text-ink-muted">
          Cómo funciona la plataforma, de dónde vienen los datos, qué hace cada análisis y
          por qué lo decidimos así. Pensado para que cualquier persona del equipo entienda lo que
          ve en los paneles, sin necesidad de leer código.
        </p>
      </div>
    </header>

    <ul class="divide-y divide-gray-100">
      <li v-for="s in sections" :key="s.key">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50"
          :class="open === s.key ? 'bg-primary/5' : ''"
          @click="toggle(s.key)"
        >
          <span class="flex items-center gap-3">
            <Icon :name="s.icon" size="16" class="text-primary" />
            <span class="text-sm font-medium text-ink">{{ s.label }}</span>
          </span>
          <Icon
            name="lucide:chevron-down"
            size="16"
            class="text-ink-muted transition-transform"
            :class="open === s.key ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="open === s.key" class="space-y-3 px-5 pb-5 text-sm leading-relaxed text-ink">

          <!-- ─────────────────────────── ¿QUÉ ES? ─────────────────────────── -->
          <template v-if="s.key === 'que-es'">
            <p>
              El <strong>Observatorio de Humedales Artificiales CDMX</strong> es una plataforma
              que sistematiza el inventario, la caracterización técnica y los servicios
              ecosistémicos de los humedales artificiales construidos en la Ciudad de México.
              Combina varias fuentes de información que normalmente viven separadas:
            </p>
            <ul class="ml-5 list-disc space-y-1 text-ink-muted">
              <li>
                <strong class="text-ink">Inventario académico Fase 1</strong> — base elaborada
                por M. en C. Diego Domínguez Solís (CIIEMAD-IPN), 13 humedales documentados
                en 7 alcaldías.
              </li>
              <li>
                <strong class="text-ink">Bibliografía indexada</strong> — Luna-Pabello &amp;
                Aburto-Castañeda (UNAM), Ramírez-Carrillo et al. (UAM/UNAM), Barceló et al. (UAM
                Azc), Domínguez-Solís et al. (CIIEMAD-IPN, 2025/2026).
              </li>
              <li>
                <strong class="text-ink">Fuentes institucionales</strong> mexicanas — CONAGUA
                (Inventario Nacional de Humedales), CONABIO (SIMOH-Mx), Gobierno CDMX, SEDEMA.
              </li>
              <li>
                <strong class="text-ink">Reportes ciudadanos</strong> — el formulario
                <code>/registra</code> permite que cualquier persona reporte un humedal
                probable; cada reporte pasa por la cola en <code>/admin/prospectos</code> antes
                de publicarse.
              </li>
            </ul>
            <p>
              La meta no es competir con CONAGUA o CONABIO; es <em>integrar</em> sus datos
              abiertos con observación local y dejar todo en un lugar accesible para academia,
              gobierno y comunidad.
            </p>
          </template>

          <!-- ─────────────────────────── FLUJO ─────────────────────────── -->
          <template v-else-if="s.key === 'flujo'">
            <p>
              El recorrido típico de un dato — desde que entra al inventario hasta que aparece
              en el panel público:
            </p>
            <ol class="ml-5 list-decimal space-y-1.5 text-ink-muted">
              <li>
                <strong class="text-ink">Origen</strong>: una publicación científica, un
                comunicado oficial, un PDF del inventario, o un reporte ciudadano vía
                <code>/registra</code>.
              </li>
              <li>
                <strong class="text-ink">Captura</strong>: el equipo registra el humedal en
                <code>/admin/humedales</code> con sus campos técnicos (tipo de flujo,
                vegetación, sustrato, capacidad). Cada registro lleva su <strong>fuente</strong>
                citada explícitamente.
              </li>
              <li>
                <strong class="text-ink">Almacenamiento</strong>: cercu-backend lo guarda en
                MySQL (<code>obs_humedales</code>) con marcas <code>visible</code> y
                <code>archivado</code> para curar qué se publica.
              </li>
              <li>
                <strong class="text-ink">Validación</strong>: si vino de la cola de prospectos,
                un revisor verifica datos, asigna atribución a un contribuyente y aprueba o
                rechaza con notas.
              </li>
              <li>
                <strong class="text-ink">Publicación</strong>: una vez <code>visible=true</code>,
                aparece en <code>/inventario</code>, <code>/mapa</code> y se cuenta en los KPIs
                de <code>/analisis</code>.
              </li>
              <li>
                <strong class="text-ink">Visualización</strong>: tarjetas, mapas Leaflet, gráficas
                Chart.js. Quien decide qué hacer con la información sigue siendo humano.
              </li>
            </ol>
          </template>

          <!-- ─────────────────────────── PERCEPCIÓN REMOTA ─────────────────────────── -->
          <template v-else-if="s.key === 'sat'">
            <p>
              Para complementar el inventario en campo usamos imágenes satelitales que miden
              vegetación, cuerpos de agua y temperatura superficial alrededor de cada humedal.
              Tres índices son clave:
            </p>

            <div class="rounded-xl border border-eco/15 bg-eco/5 p-4">
              <p class="font-semibold text-ink">🌱 NDVI — Vegetación</p>
              <p class="mt-1 text-xs text-ink-muted">
                <strong>Pregunta:</strong> ¿Hay vegetación viva alrededor del humedal y qué tan
                densa está?
              </p>
              <p class="mt-1 text-xs">
                <code>NDVI = (NIR − Red) / (NIR + Red)</code>. Bandas
                <code>B08</code> (NIR) y <code>B04</code> (rojo) de Sentinel-2.
                <strong>Rango</strong>: −1 a 1. Vegetación densa: &gt; 0.6. Suelo desnudo:
                cerca de 0. Agua: &lt; 0. <strong>Uso</strong>: detectar reverdecimiento por el
                humedal — un buen humedal artificial empuja el NDVI vecino hacia arriba con los
                años.
              </p>
            </div>

            <div class="rounded-xl border border-secondary/15 bg-secondary/5 p-4">
              <p class="font-semibold text-ink">💧 NDWI — Agua superficial</p>
              <p class="mt-1 text-xs text-ink-muted">
                <strong>Pregunta:</strong> ¿Hay espejo de agua en superficie y cómo cambia con
                las temporadas?
              </p>
              <p class="mt-1 text-xs">
                <code>NDWI = (Green − NIR) / (Green + NIR)</code>. Bandas <code>B03</code>
                (verde) y <code>B08</code> (NIR). <strong>Rango</strong>: −1 a 1. Agua
                superficial: &gt; 0.2. <strong>Uso</strong>: monitorear humedales FWS donde el
                agua sí es visible. En SFS el NDWI se queda bajo y eso está bien — el agua va
                por el sustrato.
              </p>
            </div>

            <div class="rounded-xl border border-accent/15 bg-accent/5 p-4">
              <p class="font-semibold text-ink">🌡️ LST — Temperatura superficial</p>
              <p class="mt-1 text-xs text-ink-muted">
                <strong>Pregunta:</strong> ¿El humedal mitiga la isla de calor urbana?
              </p>
              <p class="mt-1 text-xs">
                Land Surface Temperature de Landsat 8/9, banda térmica
                <code>ST_B10</code>. Conversión:
                <code>°C = DN × 0.00341802 + 149.0 − 273.15</code>.
                <strong>Rango típico CDMX</strong>: 25–42 °C. <strong>Uso</strong>: comparar el
                pixel del humedal vs. el promedio de la alcaldía. Diferencias de 2–4 °C son
                evidencia del servicio de regulación térmica.
              </p>
            </div>

            <p class="text-xs text-ink-muted">
              <strong>De dónde vienen las imágenes:</strong> Sentinel-2 (ESA Copernicus, gratis,
              5 días, 10 m) y Landsat 8/9 (NASA/USGS, gratis, 8 días, 30 m) — vía Google Earth
              Engine en cercu-backend. Si GEE falla cae a Sentinel Hub (30k req/mes gratis), y
              si todo falla, el composable consume series locales calibradas en
              <code>data/envi/alcaldias.ts</code>.
            </p>
          </template>

          <!-- ─────────────────────────── DETECTOR OSM ─────────────────────────── -->
          <template v-else-if="s.key === 'detector'">
            <p>
              El módulo <code>/admin/detector</code> (o tab dentro de
              <code>/admin/prospectos</code>) busca <strong>candidatos a humedal</strong> en
              OpenStreetMap. La lógica:
            </p>
            <ol class="ml-5 list-decimal space-y-1 text-ink-muted">
              <li>
                Usuario define un bbox (rectángulo geográfico) sobre la CDMX y parámetros.
              </li>
              <li>
                cercu-backend consulta <strong>Overpass API</strong> (gratuita) de OSM con
                tags relevantes: <code>natural=wetland</code>, <code>natural=water</code>,
                <code>landuse=basin</code>, <code>man_made=wastewater_plant</code>,
                <code>waterway=*</code>, <code>leisure=park</code>.
              </li>
              <li>
                <strong>Turf.js</strong> calcula área y centroide de cada feature.
              </li>
              <li>
                Se asigna un <strong>score</strong> según tipo y atributos:
                <code>natural=wetland</code> = 35, <code>wastewater_plant</code> = 30,
                <code>natural=water</code> = 25, <code>landuse=basin/reservoir</code> = 20,
                <code>waterway</code> = 15, <code>park/grass</code> = 10. Bonus: superficie
                amplia (+15), feature con nombre (+5).
              </li>
              <li>
                Los candidatos rankeados se devuelven al admin, que decide cuáles convertir en
                <strong>prospectos</strong> (<code>source: 'ia_detector'</code>).
              </li>
            </ol>
            <p class="text-xs text-ink-muted">
              <strong>Costo: $0.</strong> OSM y Overpass son dominio público con atribución;
              Turf.js corre en JS — sin servicios pagados.
            </p>
          </template>

          <!-- ─────────────────────────── TIPOLOGÍAS ─────────────────────────── -->
          <template v-else-if="s.key === 'tipos'">
            <p>
              Los humedales artificiales se clasifican por <strong>cómo fluye el agua</strong>:
            </p>
            <div class="space-y-2">
              <div class="rounded-lg border border-secondary/20 bg-secondary/5 p-3 text-xs">
                <strong class="text-ink">FWS — Free Water Surface</strong> (humedal de flujo
                superficial). El agua corre <em>visible</em> sobre el sustrato, como un humedal
                natural. Se usa para hábitat, conservación y tratamiento secundario.
                Ejemplos en el inventario: Anfibium, Playa de Aves, Vivero Tlaxialtemalco.
              </div>
              <div class="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                <strong class="text-ink">HSSF — Horizontal Subsurface Flow</strong>. El agua va
                <em>por dentro</em> del sustrato (grava) horizontalmente. Más eficiente que FWS
                para remover materia orgánica. Ejemplos: Cuitláhuac, CCH Oriente, ENCiT,
                CIIEMAD-IPN, SHATTO.
              </div>
              <div class="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs">
                <strong class="text-ink">VSSF — Vertical Subsurface Flow</strong>. El agua entra
                de arriba y baja por gravedad a través del sustrato. Excelente para nitrificar
                amonio. Ejemplo único en el inventario: CIBAC Cuemanco (UAM-X, 2007).
              </div>
              <div class="rounded-lg border border-eco/20 bg-eco/5 p-3 text-xs">
                <strong class="text-ink">Híbrido (FWS + SFS en serie)</strong>. Combina
                celdas para maximizar remoción. Ejemplos: Aragón STHA (HAFSS + HAFS), ENCiT
                UNAM, San Mateo Tlaltenango.
              </div>
            </div>
            <p class="text-xs text-ink-muted">
              La clasificación <strong>FWS / SFS / Híbrido</strong> es la convención de
              Vymazal (2010) y es la que usa Domínguez-Solís et al. (2025) en su revisión
              sistemática. En la base se guarda como <code>ha_fws</code>,
              <code>ha_sfs_horizontal</code>, <code>ha_sfs_vertical</code>, <code>ha_hibrido</code>.
            </p>
          </template>

          <!-- ─────────────────────────── ESTADÍSTICA ─────────────────────────── -->
          <template v-else-if="s.key === 'estad'">
            <p>
              En <code>/analisis/brecha</code> calculamos un <strong>Índice de Necesidad</strong>
              por alcaldía para priorizar dónde construir más humedales. La fórmula:
            </p>
            <div class="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-mono">
              IN = (inundación × 0.30) + (calor × 0.25) + (escasez_agua × 0.30) + (densidad_norm × 0.15)
            </div>
            <ul class="ml-5 list-disc space-y-1 text-xs text-ink-muted">
              <li>
                <strong class="text-ink">inundación</strong> (1–5): zonas con riesgo de
                anegamiento documentado por SEDEMA / CDMX.
              </li>
              <li>
                <strong class="text-ink">calor</strong> (1–5): islas de calor por LST y
                cobertura impermeable. La <code>escala 5</code> = la más afectada.
              </li>
              <li>
                <strong class="text-ink">escasez de agua</strong> (1–5): tandeo, presión baja,
                pipas. Datos SACMEX / Atlas de Riesgo.
              </li>
              <li>
                <strong class="text-ink">densidad poblacional normalizada</strong>: hab/km² /
                máximo CDMX. Por qué pesa menos: la densidad sola no implica necesidad de
                humedal — Iztapalapa es densa <em>y</em> escasa de agua, eso lo cubren los otros
                factores.
              </li>
            </ul>
            <p class="text-xs text-ink-muted">
              <strong>Limitaciones:</strong> los pesos son una <em>heurística informada</em>,
              no resultado de un AHP formal. Las escalas 1–5 son ordinales, no continuas. El
              ranking es orientativo: prioriza <em>discusión política</em>, no es una decisión
              automática.
            </p>
          </template>

          <!-- ─────────────────────────── TRACKING ─────────────────────────── -->
          <template v-else-if="s.key === 'tracking'">
            <p>
              Para entender qué se usa de la plataforma, registramos eventos básicos
              (página, click en humedal, descarga, búsqueda) en <code>useTracking()</code>. Lo
              guardamos en <code>obs_interaction_events</code> en cercu-backend — sin
              cookies de seguimiento, sin venta de datos, sin huellas de navegador.
            </p>
            <ul class="ml-5 list-disc space-y-1 text-xs text-ink-muted">
              <li>Identificamos sesiones por un id anónimo en localStorage.</li>
              <li>
                Si la persona está autenticada como admin, asociamos al
                <code>adminId</code> para auditoría interna.
              </li>
              <li>
                Los datos agregados se ven en <code>/admin/analytics</code> — cuántas visitas,
                qué humedales se ven más, qué descargas piden.
              </li>
            </ul>
          </template>

          <!-- ─────────────────────────── GLOSARIO ─────────────────────────── -->
          <template v-else-if="s.key === 'glosario'">
            <p>Acrónimos que aparecen en los paneles:</p>
            <dl class="grid gap-2 text-xs sm:grid-cols-2">
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">HA</dt>
                <dd class="text-ink-muted">Humedal Artificial (constructed wetland).</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">FWS / SFS / VSSF / HSSF</dt>
                <dd class="text-ink-muted">Free Water Surface / Subsurface Flow / Vertical / Horizontal.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">DBO₅</dt>
                <dd class="text-ink-muted">Demanda Bioquímica de Oxígeno (5 días). Materia orgánica biodegradable.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">DQO</dt>
                <dd class="text-ink-muted">Demanda Química de Oxígeno. Materia orgánica total.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">SST</dt>
                <dd class="text-ink-muted">Sólidos Suspendidos Totales.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">NOM-001 / NOM-003</dt>
                <dd class="text-ink-muted">Normas SEMARNAT: límites de descarga / agua para reúso.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">ODS</dt>
                <dd class="text-ink-muted">Objetivos de Desarrollo Sostenible (ONU). Aquí: 6, 11, 13, 15.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">SECTEI</dt>
                <dd class="text-ink-muted">Sría. de Educación, Ciencia, Tecnología e Innovación CDMX.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">CIIEMAD</dt>
                <dd class="text-ink-muted">Centro Interdisciplinario de Investigaciones y Estudios sobre Medio Ambiente y Desarrollo (IPN).</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">GAIA</dt>
                <dd class="text-ink-muted">Grupo de Investigación en Ingeniería Ambiental Aplicada (Fac. Química, UNAM).</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">IIngen</dt>
                <dd class="text-ink-muted">Instituto de Ingeniería, UNAM.</dd>
              </div>
              <div class="rounded-lg border border-gray-100 bg-white p-3">
                <dt class="font-semibold text-ink">ENCiT</dt>
                <dd class="text-ink-muted">Escuela Nacional de Ciencias de la Tierra (UNAM, CU).</dd>
              </div>
            </dl>
          </template>

          <!-- ─────────────────────────── LIMITACIONES ─────────────────────────── -->
          <template v-else-if="s.key === 'limites'">
            <p>
              Lo que el observatorio <em>no</em> es y lo que <em>no</em> hace bien — para que
              nadie se confunda:
            </p>
            <ul class="space-y-2 text-xs">
              <li class="rounded-lg border border-alert/20 bg-alert/5 p-3">
                <strong class="text-ink">No reemplaza monitoreo en campo.</strong> Las eficiencias
                de remoción que ves vienen de papers académicos. Sin muestreo periódico
                (NOM-001 calidad-agua) no podemos decir cómo opera <em>hoy</em> un humedal
                específico. Ese vacío es uno de los hallazgos del policy brief.
              </li>
              <li class="rounded-lg border border-alert/20 bg-alert/5 p-3">
                <strong class="text-ink">Cobertura sesgada.</strong> 7 alcaldías tienen humedal,
                9 no. Lo que ves está limitado a lo que se ha publicado. Probablemente hay
                pilotos universitarios o privados sin documentación pública.
              </li>
              <li class="rounded-lg border border-alert/20 bg-alert/5 p-3">
                <strong class="text-ink">Coordenadas aproximadas.</strong> Algunos sitios no
                tienen ubicación exacta publicada (privacidad, seguridad). En esos casos usamos
                el centroide del recinto institucional con nota.
              </li>
              <li class="rounded-lg border border-alert/20 bg-alert/5 p-3">
                <strong class="text-ink">Datos satelitales con caché.</strong> Las series NDVI/
                NDWI/LST son mensuales, no diarias. Un evento puntual (ej. una tormenta) puede
                perderse entre dos observaciones de Sentinel-2.
              </li>
              <li class="rounded-lg border border-alert/20 bg-alert/5 p-3">
                <strong class="text-ink">El registro #14 (Foro Cultural Magdalena Contreras)
                está en pendiente de verificación.</strong> Es <code>visible: false</code> hasta
                confirmar con IIngen UNAM. No aparece en KPIs públicos ni en
                <code>/inventario</code> — sólo en <code>/admin</code>.
              </li>
            </ul>
          </template>

        </div>
      </li>
    </ul>
  </section>
</template>
