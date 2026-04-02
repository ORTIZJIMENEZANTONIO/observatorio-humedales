# Observatorio de Humedales Artificiales CDMX

## Product
Plataforma digital de monitoreo, inventario y analisis de humedales artificiales en la Ciudad de Mexico. Sistematiza informacion geoespacial, caracteristicas tecnicas (vegetacion, sustrato, volumen), servicios ecosistemicos y tipologias de 7 humedales identificados en 5 alcaldias.

Basado en el inventario Fase 1 elaborado por M. en C. Diego Dominguez Solis, CIIEMAD — Instituto Politecnico Nacional.

Contenido 100% en espanol (es-MX). Tono: institucional, tecnico pero accesible.

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
    common/                 # AppHeader, AppFooter, SectionTitle
    charts/                 # DoughnutChart.client.vue, BarChart.client.vue
    map/                    # MapPanel.client.vue
  composables/
    useFormatters.ts        # es-MX locale formatters (humedal types, estados, servicios)
    useMapConfig.ts         # Leaflet config, marker styles
    useScrollReveal.ts      # IntersectionObserver scroll-reveal animations
  data/
    mock-humedales.ts       # 7 Humedal records (exported as `humedales`)
    kpis.ts                 # KPI data for dashboard
  layouts/default.vue       # AppHeader + slot + AppFooter
  pages/
    index.vue               # Home (hero, KPIs, que-es, como-funciona, tipologias, servicios, map teaser, disclaimer)
    mapa/                   # Full-screen Leaflet map with all 7 humedales
    inventario/             # Humedal inventory with search/filters/detail drawer
    indicadores/            # Charts dashboard (4 tabs: Distribucion, Servicios, Comparativo, Evidencia Cientifica)
    metodologia/            # Criterios, tipologias, respaldo cientifico (IPN/CIIEMAD, UNAM, UAM, UACh), datos oficiales, normativa, fuentes
    sobre/                  # About page + objectives + normative section
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
Tables support click-to-sort on column headers:
- `sortCol` ref + `sortDir` ref (`'asc' | 'desc'`)
- `toggleSort(col)` — toggles direction if same column
- `sortIcon(col)` — returns `↕`, `↑`, or `↓`

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

## Deployment
- **Domain:** humedales.cercu.com.mx
- **Server:** VPS 72.62.200.124 (Alpine Linux)
- **Path:** `/var/www/cercu-frontend/humedales/`
- **Port:** 3005 (PM2 process `humedales`)
- **Reverse proxy:** Nginx → 127.0.0.1:3005
- **SSL:** certbot
- **Deploy:** rsync + `npm install && npm run build && pm2 restart humedales`
- Also integrated in cercu-frontend `deploy/deploy.sh` and `deploy/ecosystem.config.cjs`
