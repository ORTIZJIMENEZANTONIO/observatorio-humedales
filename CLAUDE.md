# Observatorio de Humedales Artificiales CDMX

## Product
Plataforma digital de monitoreo, inventario y analisis de humedales artificiales en la Ciudad de Mexico. Sistematiza informacion geoespacial, caracteristicas tecnicas (vegetacion, sustrato, volumen), servicios ecosistemicos y tipologias de 7 humedales identificados en 5 alcaldias.

Basado en el inventario Fase 1 elaborado por M. en C. Diego Dominguez Solis, CIIEMAD — Instituto Politecnico Nacional.

Contenido 100% en espanol (es-MX). Tono: institucional, tecnico pero accesible.

### Capitalización en español
Todos los títulos, encabezados, etiquetas de tabs y subtítulos siguen la convención del español: solo la primera palabra y nombres propios en mayúscula (sentence case). No usar Title Case en inglés.
- Correcto: "Indicadores y análisis"
- Incorrecto: "Indicadores y Análisis"
- Excepción: nombres propios (Ciudad de México, CDMX, CIIEMAD, IPN, Observatorio de Humedales Artificiales CDMX como marca) y acrónimos (ODS, SEDEMA)

## Stack
- **Framework:** Nuxt 3 + Vue 3 (Composition API, `<script setup lang="ts">`)
- **State:** Pinia (setup/composable style)
- **Styling:** Tailwind CSS 3 + custom design system (`assets/css/main.css`)
- **Maps:** Leaflet (`.client.vue` pattern + `<ClientOnly>`) — auto-imported as `MapPanel`
- **Charts:** Chart.js + vue-chartjs (`.client.vue` pattern)
- **SSR:** Disabled (`ssr: false`) — SPA mode to avoid Vue 3.5 Suspense/Teleport hydration issues
- **Utilities:** VueUse, @nuxtjs/color-mode
- **TypeScript:** strict

## Commands
```bash
npm run dev        # Dev server (port 3000)
npm run build      # Production build
npm run generate   # Static generation
npm run preview    # Preview production build
```

## Key Directories
```
observatorio-humedales/
  assets/css/main.css       # Global styles, animations, Leaflet overrides
  components/
    common/                 # AppHeader, AppFooter, SectionTitle, ODSCard, PaginationControls
    charts/                 # DoughnutChart.client.vue, BarChart.client.vue
    map/                    # MapPanel.client.vue, CoverageMap.client.vue
  composables/
    useFormatters.ts        # es-MX locale formatters (humedal types, estados, servicios)
    useMapConfig.ts         # Leaflet config, marker styles
    useScrollReveal.ts      # IntersectionObserver scroll-reveal animations
  data/
    mock-humedales.ts       # 7 Humedal records (exported as `humedales`)
    kpis.ts                 # KPI data for dashboard
    alcaldias-cdmx.ts       # 16 alcaldias with population (INEGI 2020), vulnerability indices, need index
    ods-alignment.ts        # 4 ODS goals (6, 11, 13, 15) with targets, indicators, related wetlands
    hallazgos.ts            # 4 findings + recommendations + cost comparison (policy brief)
  layouts/default.vue       # AppHeader + slot + AppFooter
  pages/
    index.vue               # Home (hero, KPIs, que-es, como-funciona, tipologias, servicios, ODS teaser, map teaser, disclaimer)
    mapa/                   # Full-screen Leaflet map with all 7 humedales
    inventario/             # Humedal inventory with search/filters/detail drawer
    indicadores/            # Charts dashboard (4 tabs: Distribucion, Servicios, Comparativo, Evidencia Cientifica)
    brecha/                 # Coverage gap: 16 alcaldias, need index, coverage map, priority ranking
    hallazgos/              # Policy brief: 4 findings + recommendations, cost comparison, call to action
    metodologia/            # Criterios, tipologias, respaldo cientifico (IPN/CIIEMAD, UNAM, UAM, UACh), datos oficiales, normativa, fuentes
    sobre/                  # About page + objectives + ODS alignment (4 goals + matrix) + normative section
  public/
    images/                 # Institutional logos (CIIEMAD, IPN)
    images/humedales/       # 7 Unsplash photos for inventory cards (free license)
  deploy/
    ecosystem.config.cjs    # PM2 config (port 3005)
    nginx.conf              # Nginx server block for humedales.cercu.com.mx
    DEPLOY.md               # Deployment guide
  stores/
    humedales.ts            # Pinia store (composable style, reactive filters)
  types/
    index.ts                # Core types (Humedal, TipoHumedal, ServicioEcosistemico, etc.)
```

## Data Architecture

### Flow
```
Inventario PDF/Excel (Dominguez Solis, CIIEMAD-IPN)
         ↓
   [mock-humedales.ts]     /data/
         ↓
   [Pinia Store]           /stores/humedales.ts
         ↓
   [Components/Pages]      (search, filter, visualize)
```

### Environment Variables
- `NUXT_PUBLIC_DATA_MODE`: `mock` (default) — controls data source; currently only mock data
- `NUXT_PUBLIC_API_BASE_URL`: cercu-backend API URL (default: `http://localhost:3000/api/v1`) — for admin system

### Data Source
The inventory comes from "Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1" by M. en C. Diego Dominguez Solis (CIIEMAD-IPN). Data was extracted from PDF and Excel files containing 7 systematized wetland records.

### References

#### Academic Research
- Dominguez Solis, D. (2024). Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1. **CIIEMAD-IPN.**
- Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficacion del lago del Bosque de San Juan de Aragon. *TIP Rev. Esp. Ciencias Quimico-Biologicas*, 17(1). **UNAM-GAIA, Fac. Quimica.**
- Luna Pabello, V.M. / GAIA (2020-2024). Desarrollo tecnologico SHATTO y sistemas de humedales artificiales en UNAM. 30+ años investigacion, 2 patentes, ~10 instalaciones.
- Martinez-Cruz, P. et al. (2006). Empleo de humedales artificiales para el tratamiento de aguas de un canal experimental de Xochimilco. *Hidrobiologica*, 16(3), 211-219. **UAM-Iztapalapa.**
- FQ-UNAM y UAM-Xochimilco. (2007). Planta piloto HAFC en CIBAC, Cuemanco — unica en su tipo a nivel mundial.
- Romero-Aguilar, M. et al. (2009). Tratamiento de aguas residuales por un sistema piloto de humedales artificiales. *Rev. Int. Contam. Ambie.*, 25(3). **UAEMor / UAEMex.**
- Nava-Rojas, J. et al. (2023). Remocion de contaminantes en humedales artificiales de flujo subsuperficial: una revision. *Ingenieria*, 28(1). **TecNM Boca del Rio.**
- UACh, Depto. de Agroecologia. Evaluacion de humedal del Barrio Santiaguito, Texcoco. Eficiencias: 100% coliformes, 98.47% solidos sedimentables.

#### Key Efficiency Data
| Parameter | Efficiency | Source |
|-----------|-----------|--------|
| DQO | 95.7% | Romero-Aguilar et al. (2009), estiaje |
| DQO | 80% | GAIA-UNAM, Aragon (2014) |
| N amoniacal | 89.7% | Romero-Aguilar et al. (2009), lluvias |
| N amoniacal | 86.4% | Martinez-Cruz et al. (2006), S. americanus |
| Coliformes fecales | >90% | GAIA-UNAM, Aragon |
| Coliformes | 100% | UACh, Texcoco |
| Solidos sedimentables | 98.5% | UACh, Texcoco |

#### Official Sources
- SEDEMA (2024) — 34 humedales creados/recuperados en CDMX, 26.2 ha, >$1,000 M MXN inversion
- SEDEMA (2024) — Beneficios de humedales del Bosque de Aragon, 210 spp aves, visita Ministerio aleman
- SEDEMA (2023) — Humedales de la CDMX: generadores de agua y refugio de biodiversidad. 397 spp aves
- CONAGUA — Inventario Nacional de Humedales, Visualizador geoespacial
- CONABIO — Sistema de Monitoreo de Humedales (SIMOH-Mx). Humedales capturan 10x mas CO2 que selvas
- NOM-001-SEMARNAT-2021 — Limites de contaminantes en descargas de aguas residuales
- NOM-003-SEMARNAT-1997 — Agua tratada para reuso en servicios publicos
- Convencion Ramsar — Xochimilco y San Gregorio Atlapulco (2,657 ha, importancia internacional)
- Gobierno CDMX (2021-2023) — Comunicados: Playa de Aves, Cerro de la Estrella, ANP reabiertas
- Fundacion UNAM (2020) — Inauguracion humedal artificial Bosque de Aragon
- Maspormas (2021) — Humedales artificiales: innovacion para tratar aguas residuales

## Key Types

### Core Types
```typescript
type TipoHumedal =
  | 'conservacion'
  | 'tratamiento_aguas'
  | 'recreativo'
  | 'captacion_pluvial'
  | 'restauracion_hidrologica'

type EstadoHumedal = 'activo' | 'en_construccion' | 'en_expansion' | 'piloto'

type ServicioEcosistemico =
  | 'depuracion_agua'
  | 'habitat_fauna'
  | 'educacion_ambiental'
  | 'captura_carbono'
  | 'regulacion_termica'
  | 'control_inundaciones'
  | 'recarga_acuiferos'
  | 'banco_germoplasma'
  | 'recreacion'

interface Humedal {
  id: number
  nombre: string
  alcaldia: Alcaldia
  ubicacion: string
  tipoHumedal: TipoHumedal
  funcionPrincipal: string
  superficie?: number       // m²
  volumen?: number          // m³
  capacidadTratamiento?: string
  anioImplementacion: string
  vegetacion: string[]
  sustrato: string
  usoAgua: string
  serviciosEcosistemicos: ServicioEcosistemico[]
  serviciosDescripcion: string[]
  monitoreo: string
  estado: EstadoHumedal
  lat: number
  lng: number
  imagen?: string
}
```

### Policy & Analysis Types
```typescript
interface AlcaldiaCDMX {
  nombre: Alcaldia
  poblacion: number              // INEGI 2020
  superficie: number             // km²
  densidadPoblacional: number
  zonasInundacion: number        // 1-5
  islasCalor: number             // 1-5
  disponibilidadAgua: number     // 1-5
  tieneHumedal: boolean
  humedalesIds: number[]
  indiceNecesidad?: number       // computed weighted score
}

interface ODSGoal {
  id: ODS                        // 'ods_6' | 'ods_11' | 'ods_13' | 'ods_15'
  numero: number
  nombre: string
  color: string                  // official UN SDG color
  contribucionGeneral: string
  metasEspecificas: string[]
  humedalesRelacionados: number[]
  indicadores: string[]
}

interface Hallazgo {
  id: number
  titulo: string
  descripcion: string
  evidencia: string[]
  impacto: 'alto' | 'medio' | 'critico'
  recomendacion: Recomendacion   // paired recommendation
}
```

## Inventario de Humedales (7 registros)

| # | Nombre | Alcaldia | Tipo | Superficie | Ano |
|---|--------|----------|------|-----------|-----|
| 1 | Humedal Anfibium | Miguel Hidalgo | Conservacion | 1,200 m² | 2023 |
| 2 | Parque Ecologico Cuitlahuac | Iztapalapa | Tratamiento | 8,795 m² | 2021-2023 |
| 3 | Bosque San Juan de Aragon | Gustavo A. Madero | Tratamiento | — | 2020 (amp. 2025) |
| 4 | Playa de Aves | Gustavo A. Madero | Recreativo | 1,100 m² | 2021 |
| 5 | Cerro de la Estrella | Iztapalapa | Captacion pluvial | — | 2022 |
| 6 | Vivero San Luis Tlaxialtemalco | Xochimilco | Conservacion | 48,900 m² (4.89 ha) | 2023 |
| 7 | Bajo Puente Cuemanco | Xochimilco | Restauracion | — | 2023 |

### Tipologias identificadas
1. **Tratamiento de aguas residuales:** Aragon, Cuitlahuac
2. **Conservacion y biodiversidad:** Anfibium, Vivero San Luis
3. **Regulacion hidrologica urbana:** Cuemanco, Cerro de la Estrella

### Limitaciones del inventario
- Falta de datos de monitoreo cuantitativo
- Escasa estandarizacion en diseno
- Informacion tecnica incompleta en fuentes publicas

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0D6B7E` | Main institutional teal |
| `primary-light` | `#1088A0` | Hover states |
| `primary-dark` | `#094E5C` | Active/pressed |
| `primary-50` | `#E6F4F7` | Light backgrounds |
| `secondary` | `#4FC3F7` | Water/light blue accent |
| `eco` | `#43A047` | Vegetation/positive |
| `accent` | `#F2A81D` | Highlights/warnings |
| `alert` | `#D9363E` | Errors/negatives |
| `surface` | `#F7F8F4` | Page background |
| `ink` | `#1F2937` | Primary text |
| `slate-custom` | `#5E6B78` | Secondary text |

### Typography
- **Font:** Inter (300-800)
- **Headings:** font-semibold, tracking-tight
- **All content in Spanish** (es-MX locale for formatting)

### Component Classes
- `.card` / `.card-interactive` / `.card-flat` / `.panel`
- `.btn-primary` / `.btn-secondary` / `.btn-eco` / `.btn-outline` / `.btn-ghost`
- `.badge-primary` / `.badge-eco` / `.badge-secondary` / `.badge-accent` / `.badge-alert`
- `.kpi-card` / `.input` / `.select` / `.table-base`
- `.container-wide` / `.container-narrow` / `.section-padding`

### Shadows
- `shadow-card`: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- `shadow-card-hover`: `0 4px 12px rgba(0,0,0,0.08)`
- `shadow-panel`: `0 2px 8px rgba(0,0,0,0.06)`

## Animation System
Smooth, physics-based motion language (same as sibling observatorio-techos-verdes project).

### Easing Functions
- **Smooth:** `cubic-bezier(0.22, 1, 0.36, 1)` — default for most transitions
- **Bouncy:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — scale/pop entrances
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` — element removal

### Page Transitions
Configured in `nuxt.config.ts` as `pageTransition: { name: 'page', mode: 'out-in' }`.

### Scroll Reveal (`useScrollReveal`)
CSS classes + IntersectionObserver composable:
- `.reveal` — slide up 32px + fade
- `.reveal-left` — slide horizontal 32px + fade
- `.reveal-scale` — scale(0.9) + fade
- `.stagger-children` — container that staggers `.reveal` children (60ms delay each)
- `.is-visible` — applied by observer, triggers transition

Usage:
```vue
<script setup>
const { revealRef } = useScrollReveal({ stagger: true })
</script>
<template>
  <div ref="revealRef" class="stagger-children">
    <div class="reveal">Item 1</div>
    <div class="reveal">Item 2</div>
  </div>
</template>
```

### CSS Animation Utilities
| Class | Animation |
|-------|-----------|
| `.animate-fade-in` | Opacity 0→1 |
| `.animate-slide-up` | Translate Y 24px→0 + fade |
| `.animate-slide-down` | Translate Y -16px→0 + fade |
| `.animate-scale-in` | Scale 0.9→1 + fade |
| `.animate-pulse-glow` | Box-shadow pulse (infinite) |
| `.animate-spin-smooth` | Smooth rotation (infinite) |
| `.delay-100` ... `.delay-700` | Animation delay utilities |

### Reduced Motion
All animations and transitions are disabled with `@media (prefers-reduced-motion: reduce)`.

## Key Patterns

### Client-Only Components
Leaflet maps and Chart.js charts must render client-side only:
- Use `.client.vue` suffix on the component file
- Wrap with `<ClientOnly>` and provide a `#fallback` slot
- Auto-import name strips `.client` suffix: `MapPanel.client.vue` → `<MapPanel />`

### No Teleport
Do NOT use `<Teleport to="body">` — it causes infinite `flushJobs` loops with Vue 3.5 Suspense + `pageTransition`.
Fixed-position elements with high z-index work without Teleport. Use inline `<Transition>` + `position: fixed` instead.

### Mock Data Property Names
Properties use **camelCase** in TypeScript (not snake_case):
- `tipoHumedal` (not `tipo_humedal`)
- `serviciosEcosistemicos` (not `servicios_ecosistemicos`)
- `anioImplementacion` (not `anio_implementacion`)

### Format Functions
Always add null guards: `if (!value) return 'Sin tipo'`
Use fallback: `map[value] || value.charAt(0).toUpperCase() + value.slice(1)`

### Stores (Pinia composable style)
```typescript
export const useHumedalesStore = defineStore('humedales', () => {
  const humedales = ref<Humedal[]>(mockData)
  const searchQuery = ref('')
  const filterAlcaldia = ref('')
  const filterTipo = ref('')
  const filtered = computed(() => { /* ... */ })
  return { humedales, searchQuery, filterAlcaldia, filterTipo, filtered }
})
```

### Pagination (15 items per page)
All data tables and card grids use client-side pagination with 15 results per page via `CommonPaginationControls.vue`. The component receives `v-model:current-page`, `totalPages`, `totalItems`, and `perPage` props. Controls auto-hide when `totalPages <= 1`.

**Pattern:**
```typescript
const currentPage = ref(1)
const perPage = 15
const totalPages = computed(() => Math.ceil(filtered.value.length / perPage) || 1)
const paginated = computed(() => filtered.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage))
watch([/* filter refs */], () => { currentPage.value = 1 }) // reset on filter change
```

**Applied to:**
- `AdminDataTable.vue` — built-in pagination (used by admin/humedales, admin/hallazgos)
- `pages/inventario/index.vue` — humedal card grid (7 items, controls hidden when < 15)
- `pages/brecha/index.vue` — alcaldía ranking table (16 rows, shows 2 pages)

### Lazy Loading for Images
Card grids with images use native `loading="lazy"` on `<img>` tags. Applied in `pages/inventario/index.vue` humedal cards.

### Map Popups
Each humedal popup shows: nombre, alcaldia, anio, tipo, superficie, funcion, top 3 servicios ecosistemicos. Built via `buildPopup()` in `MapPanel.client.vue`.

### Tabbed Pages (Indicadores pattern)
Uses sticky tab navigation with `v-show` (not `v-if`) to avoid chart re-renders:
```vue
<div class="sticky top-16 z-30 border-b bg-white/95 backdrop-blur-sm">
  <nav class="flex gap-1 overflow-x-auto py-2">
    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" ...>
```

### Sortable Tables
**All** data tables with `v-for` rows support click-to-sort on column headers (except static reference tables).

**`AdminDataTable.vue`** — sorting built-in: click any `<th>` to sort by that column. Sort icon (`↑`/`↓`) only appears on the active column inside a fixed-width `w-3` span to avoid column width changes. Chain: `filtered` → `sorted` → `paginated`. Compares numbers numerically, strings with `localeCompare`, nulls pushed to end.

**Per-page tables:**
- `toggleSort(col, table?)` — toggles direction if same column, otherwise sets descending
- For pages with multiple tables, use `SortState` per table via `reactive` object and pass table name as second arg
- Hover feedback: scoped CSS `th.cursor-pointer:hover { background-color: rgba(0,0,0,0.03) }`

**Card grids** use a `<select>` dropdown for ordering (no `<th>` available):
- `inventario/index.vue` — nombre, alcaldía, año, superficie

**Pages with sortable `<th>` tables:**
- `brecha/index.vue` — ranking por alcaldía (7 sortable columns incl. Estado)
- `indicadores/index.vue` — comparativa (6 cols), servicios matrix (by nombre), eficiencias (4 cols)
- `hallazgos/index.vue` — comparativo de costos (3 sortable + 2 list columns)
- `sobre/index.vue` — ODS matrix (by nombre)
- `admin/*` — all pages via `AdminDataTable` (humedales, hallazgos)
- `admin/prospectos/index.vue` — detector results (custom columns)

### Mobile-First Design
All layouts follow mobile-first Tailwind convention (`grid-cols-1` base → `md:`/`lg:` breakpoints):
- **Tables:** wrapped in `overflow-x-auto` with `min-w-[Xpx]`
- **Grids:** always start from `grid-cols-1`, scaling up at breakpoints
- **Names:** `whitespace-nowrap` on `<td>` to prevent mid-word breaks

### Detail Drawer (Inventario)
Slide-out right drawer for wetland details:
- Overlay (fade transition) + drawer panel (slide-right transition) — no Teleport, uses fixed positioning
- Shows complete information: tipo, funcion, superficie, volumen, capacidad, sustrato, uso del agua, vegetacion, servicios ecosistemicos, monitoreo, coordenadas

### Inventory Card Images
Each humedal has an optional `imagen` field pointing to `/images/humedales/*.jpg` (Unsplash, free license).
Cards show the image with `object-cover`; fallback to gradient + SVG icon if no image.

## Indicadores Page (4 tabs)

### Tab 1: Distribucion
- Doughnut chart: humedales por alcaldia
- Doughnut chart: humedales por tipologia
- Horizontal bar chart: superficie por humedal (only those with data)

### Tab 2: Servicios Ecosistemicos
- Bar chart: frecuencia de cada servicio entre los 7 humedales
- Matriz checkmark table: humedal × servicio

### Tab 3: Analisis Comparativo
- Timeline visual de implementacion (2020-2023)
- Tabla comparativa completa (sortable)
- Panel de limitaciones (3 items)
- Panel de fuentes y referencias

### Tab 4: Evidencia Cientifica
- **E.1** Tabla de eficiencias de remocion documentadas (DQO, N, P, coliformes) de IPN, UNAM, UAM, UACh
- **E.2** Investigacion IPN-CIIEMAD — lineas activas, tesis, inventario Fase 1
- **E.3** Caso de estudio: Aragon (GAIA-UNAM) — 1 ha, 250 m³/d, 80% remocion, componentes del sistema
- **E.4** Investigacion en Xochimilco (UAM-X / UNAM) — S. americanus, L. gibba, planta HAFC-CIBAC
- **E.5** Sistema piloto UAEMor/UAEMex — 95.7% DQO, Phragmites + Typha
- **E.6** Datos oficiales CDMX — 34 humedales, 26.2 ha, 397 spp aves, 10x CO2 vs selvas
- **E.7** Referencias academicas y oficiales completas

## Brecha de Cobertura Page (`/brecha`)
- 4 KPIs: 16 alcaldias, 5 con humedales, 11 sin, indice promedio
- CoverageMap: Leaflet map with 16 alcaldias color-coded (teal=con, red=sin, radius=need index)
- Ranking table: sortable by indice de necesidad, population, vulnerability metrics
- Top 5 priority alcaldias without wetlands (cards with metrics)
- Need index formula: `(inundacion * 0.3) + (calor * 0.25) + (agua * 0.3) + (densidadNorm * 0.15)`
- Data source: INEGI 2020 census (population), estimated 1-5 scales (vulnerability)

## Hallazgos Page (`/hallazgos`) — Policy Brief
- Executive summary panel
- 4 finding-recommendation pairs (grid md:grid-cols-2):
  1. Ausencia de monitoreo estandarizado (critico) → protocolo estandarizado
  2. Concentracion territorial (alto) → priorizacion por indice de necesidad
  3. Datos de eficiencia limitados (alto) → monitoreo in-situ con universidades
  4. Ventaja economica no cuantificada (alto) → analisis costo-beneficio formal
- Cost comparison table: humedal ($0.50-2/m3) vs convencional ($5-15/m3) vs cloracion ($0.20-0.80/m3)
- Call to action with links to /brecha, /indicadores, /metodologia

## ODS Alignment (in `/sobre` and home teaser)
- 4 UN SDGs: ODS 6 (agua), ODS 11 (ciudades), ODS 13 (clima), ODS 15 (ecosistemas)
- ODSCard component with official UN colors and target badges
- Matrix table: humedal x ODS (checkmarks)
- Home teaser: 4 mini-cards linking to /sobre#ods

## Metodologia Page Sections
- Criterios de sistematizacion (6 criterios)
- Tipologias identificadas (3 categorias)
- Servicios ecosistemicos predominantes
- Limitaciones del inventario (3 items)
- Respaldo cientifico (IPN/CIIEMAD, UNAM/GAIA, UAM, UACh — cards con datos cuantitativos)
- Datos oficiales (SEDEMA 34 humedales, 26.2 ha, 397 spp aves, 10x CO2, 656 km canales)
- Marco normativo (NOM-001, NOM-003, Ramsar, CONAGUA)
- Fuentes y referencias (academicas + oficiales)

## Servicios Ecosistemicos Predominantes
1. Regulacion hidrica (depuracion, filtracion, recarga)
2. Captura de carbono (vegetacion acuatica)
3. Habitat para fauna (aves migratorias, ajolotes, fauna nativa)
4. Educacion ambiental (espacios de aprendizaje)

## Sibling Project
This project shares the same design system and stack as `observatorio-techos-verdes` (green roofs observatory). Key differences:
- **Color palette:** Teal (#0D6B7E) instead of green (#0E5E3A)
- **Data domain:** 7 artificial wetlands instead of 57 green roofs + 60 candidates
- **Analysis:** Ecosystem services focus instead of AHP multi-criteria + structural pre-feasibility
- **No AI integration:** Data comes from PDF inventory, not vision analysis
- **Simpler architecture:** No services/normalizers/repositories layer — direct mock data to store

## Deployment (LIVE)
- **URL:** https://humedales.cercu.com.mx
- **Server:** VPS 72.62.200.124 (Alpine Linux, srv1420267)
- **Path:** `/var/www/cercu-frontend/humedales/`
- **Port:** 3005 (PM2 process `humedales`)
- **Reverse proxy:** Nginx (`/etc/nginx/http.d/cercu.conf`) → 127.0.0.1:3005
- **SSL:** Let's Encrypt via certbot (activo)
- **License:** Apache 2.0
- **Repo:** https://github.com/ORTIZJIMENEZANTONIO/observatorio-humedales.git
- **Deploy:** rsync + `npm install && npm run build && pm2 restart humedales`
- Also integrated in cercu-frontend `deploy/deploy.sh` and `deploy/ecosystem.config.cjs`
- **PM2 start con ecosystem:** `pm2 start deploy/ecosystem.config.cjs` (asegura PORT=3005)
- **Nginx config en servidor:** `/etc/nginx/http.d/cercu.conf` (Alpine usa `http.d/`, no `sites-available/`)

## Admin System

### Architecture
- **Backend:** cercu-backend (shared Express/TypeORM API at `NUXT_PUBLIC_API_BASE_URL`)
- **Auth:** Email + password login via `/api/v1/observatory/auth/login` → JWT (15min access token)
- **Entity:** `ObservatoryAdmin` (separate from CERCU users) — password bcrypt-hashed (12 rounds)
- **Approval queue:** Prospects detected by external detector → pending review → admin approves/rejects

### Pipeline
```
Detector → Prospectos → Inventario    |    Hallazgos (contenido editorial, fuera del pipeline)
```
Los prospectos detectados se aprueban y pasan al inventario público. Hallazgos es una sección de contenido editorial independiente del pipeline de detección.

### Admin Files
```
stores/auth.ts              # Pinia auth store (login, logout, token in localStorage)
composables/useApi.ts       # $fetch wrapper with Bearer token + 401 handling
middleware/admin.ts          # Nuxt route middleware (redirects to /admin/login if unauthenticated)
layouts/admin.vue            # Admin layout, sidebar en orden de pipeline, responsive
components/admin/
  AdminDataTable.vue         # Tabla con búsqueda, paginación, acciones, responsive
pages/admin/
  login.vue                  # Email + password login form
  index.vue                  # Dashboard con pipeline visual, stats, quick links
  prospectos/index.vue       # Tabs: Cola de aprobación + Detector geoespacial
  humedales/index.vue        # Inventario: humedales registrados (7 del mapa público)
  hallazgos/index.vue        # Hallazgos y recomendaciones (contenido editorial)
  detector/index.vue         # Redirect → /admin/prospectos
```

### Admin Routes (orden de pipeline)
- `/admin/login` — login (layout default)
- `/admin` — dashboard con pipeline visual
- `/admin/prospectos` — tabs: Cola de aprobación + Detector (entrada del pipeline)
- `/admin/humedales` — inventario de humedales registrados (fin del pipeline)
- `/admin/hallazgos` — hallazgos y recomendaciones (contenido editorial)

### Admin UI/UX Patterns
- **Pipeline banner:** Indicador horizontal de pasos en cada página del pipeline, resalta el paso actual
- **Mobile-first responsive:** Sidebar oculto en mobile (toggle hamburger, cierre automático al navegar), tablas con scroll horizontal edge-to-edge (`-mx-4 px-4 sm:mx-0`), grids desde `grid-cols-1`, touch targets 44px, acciones siempre visibles en mobile
- **Collapsible methodology:** Panel cerrado por defecto explicando scoring/detección
- **Paginated tables:** Filtros avanzados + columnas ordenables + selector de filas por página
- **Score breakdown:** Barras de progreso expandibles por fila mostrando componentes del score
- **Column tooltips:** `title` nativo con subrayado punteado en headers
- **TransitionGroup:** Animaciones fade + slide en listas
- **Modal transitions:** `fade` + `scale-in` + `backdrop-blur`
- **Active route indicator:** Sidebar con matching exacto de ruta
- **Welcome greeting:** Saludo personalizado con nombre del admin
- **Empty states:** Iconos contextuales + texto descriptivo + CTAs

### Prospect Approval Flow
```
External detector → POST /api/v1/observatory/humedales/prospectos
         ↓
[ProspectSubmission] status: 'pendiente'
         ↓
Admin reviews at /admin/prospectos
         ↓
Approve → POST .../aprobar   |   Reject → POST .../rechazar (+ notas)
```

### Geospatial Detector (tab dentro de `/admin/prospectos`)
Built-in detector that identifies potential wetland sites using OpenStreetMap data + Turf.js spatial analysis. Runs entirely in JS (no Python).

**Pipeline:**
```
Admin defines bounding box + params → POST /api/v1/observatory/humedales/detector/run
         ↓
[cercu-backend] Overpass API → OSM water bodies, wetlands, waterways, wastewater plants, parks
         ↓
[Turf.js] area, centroid per feature
         ↓
Classification + scoring by type and attributes
         ↓
Ranked candidates returned to frontend
         ↓
Admin selects → POST .../detector/submit → ProspectSubmission (source: ia_detector)
```

**Detected feature types:**
| Tipo | OSM tags | Score base |
|------|----------|------------|
| Humedal existente | natural=wetland | 35 |
| Infraestructura hidrica | wastewater_plant | 30 |
| Cuerpo de agua | natural=water | 25 |
| Vaso regulador | landuse=basin/reservoir | 20 |
| Via acuatica | waterway=* | 15 |
| Area verde | leisure=park, landuse=grass | 10 |

Additional scoring: superficie amplia (+15), feature nombrado (+5).

**Cost: $0** — uses free OSM/Overpass API + Turf.js (no satellite imagery fees)
