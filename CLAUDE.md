# Observatorio de Humedales Artificiales CDMX

## Product
Plataforma digital de monitoreo, inventario y analisis de humedales artificiales en la Ciudad de Mexico. Sistematiza informacion geoespacial, caracteristicas tecnicas (vegetacion, sustrato, tipo de flujo, volumen), servicios ecosistemicos y tipologias de 8 humedales artificiales identificados en 5 alcaldias.

Basado en el inventario Fase 1 elaborado por M. en C. Diego Dominguez Solis — Instituto Politecnico Nacional, y en evidencia academica publicada (Luna-Pabello & Aburto-Castañeda, 2014; GAIA — Facultad de Quimica, UNAM).

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
- **Icons:** nuxt-icon (Iconify/Lucide on-demand) — `<Icon name="lucide:icon-name" size="20" />`
- **Editor:** GrapesJS 0.22 + grapesjs-preset-webpage (`.client.vue` pattern) — visual article editor for Notihumedal admin
- **Utilities:** VueUse, @nuxtjs/color-mode
- **TypeScript:** strict

## Commands
```bash
npm run dev        # Dev server (port 3000)
npm run build      # Production build
npm run generate   # Static generation
npm run preview    # Preview production build
npm test           # Run all tests (vitest)
npm run test:watch # Watch mode
npm run test:coverage # With coverage report
```

## Key Directories
```
observatorio-humedales/
  assets/
    css/main.css            # Global styles, form system, animations, Leaflet overrides
    humedalito.png          # Mascota del observatorio (hero banner)
  components/
    common/                 # AppHeader, AppFooter, SectionTitle, ODSCard, PaginationControls, AnalisisSubNav
    charts/                 # DoughnutChart.client.vue, BarChart.client.vue
    map/                    # MapPanel.client.vue, CoverageMap.client.vue
  composables/
    useFormatters.ts        # es-MX locale formatters (humedal types, flujo, vegetacion, estados, servicios)
    useMapConfig.ts         # Leaflet config, marker styles
    useScrollReveal.ts      # IntersectionObserver scroll-reveal animations
    useCmsContent.ts        # CMS content loader (API → fallback to cms-defaults.ts)
    useBackendStatus.ts     # Global backend availability check (cached, one request)
  data/
    mock-humedales.ts       # 8 Humedal records (exported as `humedales`)
    kpis.ts                 # KPI data for dashboard
    alcaldias-cdmx.ts       # 16 alcaldias with population (INEGI 2020), vulnerability indices, need index
    ods-alignment.ts        # 4 ODS goals (6, 11, 13, 15) with targets, indicators, related wetlands
    hallazgos.ts            # 4 findings + recommendations + cost comparison (policy brief)
    notihumedal.ts          # Blog articles (static data, ArticuloNotihumedal[])
    cms-defaults.ts         # Default CMS content for editable page sections (home, sobre, analisis)
  layouts/default.vue       # AppHeader + slot + AppFooter
  middleware/
    redirects.global.ts     # Redirects: /indicadores→/analisis/indicadores, /brecha, /hallazgos, /metodologia
  pages/
    index.vue               # Home (hero+Humedalito, KPIs, features, tipologias, servicios, ODS teaser, map teaser)
    mapa/                   # Full-screen Leaflet map (own nav item, accessible)
    inventario/             # Inventory: search/filters + list/map toggle + detail drawer
    analisis/
      index.vue             # Hub gateway (3 cards → indicadores, brecha, hallazgos)
      indicadores.vue       # Charts dashboard (4 tabs) + AnalisisSubNav
      brecha.vue            # Coverage gap: 16 alcaldias, need index, map, ranking + AnalisisSubNav
      hallazgos.vue         # Policy brief: findings, cost comparison, CTA + AnalisisSubNav
    notihumedal/
      index.vue             # Blog listing with search
      [slug].vue            # Article detail + related articles
    registra/               # Multi-step wizard (datos tecnicos, documento, confirmacion)
    sobre/                  # About + ODS + metodologia (#metodologia) + fuentes (#fuentes) + normativa
  public/
    images/                 # Institutional logos (IPN)
    images/humedales/       # 8 Unsplash photos for inventory cards (free license)
  stores/
    humedales.ts            # Pinia store (composable style, reactive filters)
    auth.ts                 # Auth store (login, logout, roles, permissions, isSuperadmin, hasPermission)
  types/
    index.ts                # Core types (Humedal, TipoFlujo, AdminRole, AdminPermission, AdminUser, ProspectoNoticia, etc.)
  tests/
    setup.ts                # Vitest setup (Nuxt auto-import mocks, localStorage mock)
    unit/                   # useFormatters, auth store, mock data integrity
    stress/                 # Large dataset filtering/sorting performance
  vitest.config.ts          # Vitest config with Nuxt aliases
```

## Data Architecture

### Flow
```
Inventario PDF/Excel (Dominguez Solis, IPN) + Articulo SciELO (Luna-Pabello, UNAM)
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
The inventory comes from "Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1" by M. en C. Diego Dominguez Solis (IPN). Data was extracted from PDF and Excel files. The Bosque de Aragon entries (STHA 2012 + Segundo Humedal 2020) are cross-referenced with Luna-Pabello & Aburto-Castañeda (2014), TIP Rev., Facultad de Quimica, UNAM. Total: 8 wetland records.

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

type TipoFlujo =
  | 'superficial'
  | 'subsuperficial_horizontal'
  | 'subsuperficial_vertical'
  | 'combinado'

type TipoVegetacion = 'flotante' | 'emergente' | 'sumergida'

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
  | 'reduccion_lst'

interface Humedal {
  id: number
  nombre: string
  alcaldia: Alcaldia
  ubicacion: string
  tipoHumedal: TipoHumedal
  tipoFlujo?: TipoFlujo
  tipoVegetacion?: TipoVegetacion[]
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
  fuente?: string           // data source reference
  fuenteImagen?: string     // image credit
}
```

### Notihumedal & Scraping Types
```typescript
interface ArticuloNotihumedal {
  id: number; slug: string; titulo: string; fecha: string
  resumen: string; contenido: string; imagen?: string
  autor: string; tags: string[]
}

type EstadoProspectoNoticia = 'pendiente' | 'aprobado' | 'rechazado'

interface ProspectoNoticia {
  id: number; titulo: string; resumen: string; url: string
  fuente: string; fecha: string; fechaScraping: string
  estado: EstadoProspectoNoticia; notasRechazo?: string
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

## Inventario de Humedales Artificiales (8 registros)

| # | Nombre | Alcaldia | Tipo | Flujo | Superficie | Ano |
|---|--------|----------|------|-------|-----------|-----|
| 1 | Anfibium | Miguel Hidalgo | Conservacion | Superficial | 1,200 m² | 2023 |
| 2 | Parque Ecologico Cuitlahuac | Iztapalapa | Tratamiento | Subsup. horiz. | 8,795 m² | 2021-2023 |
| 3 | Aragon — STHA (HAFSS+HAFS) | Gustavo A. Madero | Tratamiento | Combinado | 8,085 m² | 2012 |
| 8 | Segundo Aragon (HAFSS) | Gustavo A. Madero | Tratamiento | Subsup. horiz. | 3,108 m² | 2020 |
| 4 | Playa de Aves | Gustavo A. Madero | Recreativo | Superficial | 1,100 m² | 2021 |
| 5 | Cerro de la Estrella | Iztapalapa | Captacion pluvial | Superficial | — | 2022 |
| 6 | Vivero San Luis Tlaxialtemalco | Xochimilco | Conservacion | Superficial | 48,900 m² | 2023 |
| 7 | Bajo Puente Cuemanco | Xochimilco | Restauracion | Subsup. horiz. | — | 2023 |

### Tipologias identificadas
1. **Tratamiento de aguas residuales:** Aragon STHA (2012), Segundo Aragon (2020), Cuitlahuac
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
- **Cards:** `.card` (border + subtle shadow) / `.card-interactive` (hover lift + primary tint) / `.card-flat` (border only) / `.card-glass` (backdrop-blur, semi-transparent) / `.panel` (padded card)
- **Buttons:** `.btn-primary` / `.btn-secondary` / `.btn-eco` / `.btn-outline` / `.btn-ghost` — `rounded-xl`, `font-semibold`, hover shadow. Sizes: `.btn-sm` / `.btn-lg`
- **Badges:** `.badge-primary` / `.badge-eco` / `.badge-secondary` / `.badge-accent` / `.badge-alert` — `rounded-full` (pill shape), `font-semibold`
- **KPIs:** `.kpi-card` — card variant for metric display
- **Forms:** `.form-group` / `.form-label` / `.form-hint` / `.form-error` / `.form-row` / `.form-row-3` / `.input` / `.select` / `.checkbox` / `.checkbox-label` / `.radio` / `.input-icon-wrapper` / `.input-icon` / `.input-error` / `.input-success`
- **Tables:** `.table-base` / `.table-container`
- **Layout:** `.container-wide` / `.container-narrow` / `.section-padding`

### Design Philosophy (2026)
- **Border-first cards** — subtle `border-gray-100/80` with minimal shadow (`0 1px 2px`), not heavy drop shadows
- **Rounded-2xl everywhere** — cards, buttons, badges, inputs all use generous rounding
- **Color on interaction** — borders tint to `primary/15` on card hover; icons scale up
- **Focus-visible** — buttons use `focus-visible:ring-2` (only shows on keyboard nav, not clicks)
- **Pill badges** — `rounded-full` for all badges
- **Mesh gradient hero** — animated floating orbs with blur, not flat gradient
- **Progressive disclosure** — CTAs reveal on hover (`opacity-0 → group-hover:opacity-100`)

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

## Navigation Architecture

### Primary Nav (6 items + CTA)
```
Inicio | Mapa | Inventario | Análisis | Notihumedal | Sobre | [Registra tu humedal →]
```

- **Mapa** (`/mapa`) — Full-screen Leaflet map (own page, accessible from nav)
- **Inventario** (`/inventario`) — Cards + detail drawer + list/map view toggle (`?vista=mapa`)
- **Análisis** (`/analisis`) — Hub gateway → child pages with `AnalisisSubNav`:
  - `/analisis/indicadores` — Charts (4 internal tabs)
  - `/analisis/brecha` — Coverage gap analysis
  - `/analisis/hallazgos` — Policy brief
- **Notihumedal** (`/notihumedal`) — Blog listing + `/notihumedal/[slug]` detail (static data from `data/notihumedal.ts`)
- **Sobre** (`/sobre`) — About + ODS + Metodología (`#metodologia`) + Fuentes (`#fuentes`) + Normativa
- **Registra** (`/registra`) — Multi-step wizard (3 pasos: datos técnicos, documento, confirmación)

### Redirects (`middleware/redirects.global.ts`)
Old routes redirect to new locations:
- `/indicadores` → `/analisis/indicadores`
- `/brecha` → `/analisis/brecha`
- `/hallazgos` → `/analisis/hallazgos`
- `/metodologia` → `/sobre#metodologia`

### Mobile-First Header
- **Mobile (< lg):** Logo + hamburger button only. Institutional logos hidden (shown inside drawer).
- **Tablet (md):** Logo + institutional logos + hamburger.
- **Desktop (lg):** Logo + nav links + institutional logos + CTA button.
- Mobile drawer has icons per nav item (`lucide:home`, `lucide:map`, etc.) + logos at bottom + CTA.

### Icons (nuxt-icon / Iconify)
Use `<Icon name="lucide:icon-name" size="20" />` instead of inline SVGs.
Icons are loaded on-demand from Iconify CDN. Lucide is the primary icon set.

## Form Design System

### CSS Classes (`assets/css/main.css`)
All form utilities are in `@layer components`, pure CSS with Tailwind `@apply`. No external form plugin.

| Class | Purpose |
|-------|---------|
| `.form-group` | Wrapper: `flex flex-col gap-1.5` |
| `.form-label` | Label: `text-sm font-medium text-ink` |
| `.form-hint` | Help text: `text-xs text-ink-muted` |
| `.form-error` | Error text: `text-xs text-alert` |
| `.form-row` / `.form-row-3` | Grid 2/3 cols responsive |
| `.input` | Enhanced: shadow-sm, hover border, focus glow + shadow |
| `textarea.input` | Auto resize-y, min-height, relaxed leading |
| `.select` | Custom chevron (changes to primary on focus) |
| `.checkbox` / `.checkbox-label` | Custom styled, hover state on label |
| `.radio` | Custom styled radio button |
| `.input-icon-wrapper` + `.input-icon` | Input with left icon (icon color changes on focus) |
| `.input-error` / `.input-success` | Validation border/ring states |

### Usage Pattern
```vue
<div class="form-group">
  <label class="form-label">Nombre <span class="text-alert">*</span></label>
  <div class="input-icon-wrapper">
    <Icon name="lucide:droplets" size="18" class="input-icon" />
    <input v-model="form.nombre" type="text" class="input" placeholder="..." />
  </div>
  <p class="form-hint">Texto de ayuda</p>
</div>
```

## Key Patterns

### Client-Only Components
Leaflet maps and Chart.js charts must render client-side only:
- Use `.client.vue` suffix on the component file
- Wrap with `<ClientOnly>` and provide a `#fallback` slot
- Auto-import name strips `.client` suffix: `MapPanel.client.vue` → `<MapPanel />`

### No Teleport
Do NOT use `<Teleport to="body">` — it causes infinite `flushJobs` loops with Vue 3.5 Suspense + `pageTransition`.
Fixed-position elements with high z-index work without Teleport. Use inline `<Transition>` + `position: fixed` instead.

### Admin pageTransition: false
All admin pages MUST set `pageTransition: false` in `definePageMeta` to avoid the Vue 3.5 Suspense infinite `flushJobs` loop. The admin layout has its own sidebar navigation and does not need page transition animations.

### Backend Status Check (`useBackendStatus`)
Admin pages that call endpoints not yet implemented in the backend use `useBackendStatus()` to avoid noisy 404 errors in console.

**How it works:**
1. Calls `GET /observatory/{obs}/hallazgos` (public, no auth, always exists)
2. If response has HTTP status (even 401/404) → backend IS running (`available = true`)
3. If network error (no status code) → backend is offline (`available = false`)
4. Result is **cached globally** — only one check per session, all pages share the result
5. Call `reset()` to force re-check (e.g., after login)

**Usage in admin pages:**
```typescript
const { available: backendAvailable, check: checkBackend } = useBackendStatus()
const isOnline = await checkBackend()
if (!isOnline) { /* use fallback data */ return }
```

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
- `pages/inventario/index.vue` — humedal card grid (8 items, controls hidden when < 15)
- `pages/analisis/brecha.vue` — alcaldía ranking table (16 rows, shows 2 pages)

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
- `analisis/brecha.vue` — ranking por alcaldía (7 sortable columns incl. Estado)
- `analisis/indicadores.vue` — comparativa (6 cols), servicios matrix (by nombre), eficiencias (4 cols)
- `analisis/hallazgos.vue` — comparativo de costos (3 sortable + 2 list columns)
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

## Indicadores Page (`/analisis/indicadores`, 4 tabs)

### Tab 1: Distribucion
- Doughnut chart: humedales por alcaldia
- Doughnut chart: humedales por tipologia
- Horizontal bar chart: superficie por humedal (only those with data)

### Tab 2: Servicios Ecosistemicos
- Bar chart: frecuencia de cada servicio entre los 8 humedales
- Matriz checkmark table: humedal × servicio

### Tab 3: Analisis Comparativo
- Timeline visual de implementacion (2020-2023)
- Tabla comparativa completa (sortable)
- Panel de limitaciones (3 items)
- Panel de fuentes y referencias

### Tab 4: Evidencia Cientifica
- **E.1** Tabla de eficiencias de remocion documentadas (DQO, N, P, coliformes) de IPN, UNAM, UAM, UACh
- **E.2** Investigacion IPN — lineas activas, tesis, inventario Fase 1
- **E.3** Caso de estudio: STHA Aragon (Facultad de Quimica, UNAM) — 1 ha, 250 m³/d, 80% remocion, 2 humedales (2012+2020)
- **E.4** Investigacion en Xochimilco (UAM-X / UNAM) — S. americanus, L. gibba, planta HAFC-CIBAC
- **E.5** Sistema piloto UAEMor/UAEMex — 95.7% DQO, Phragmites + Typha
- **E.6** Datos oficiales CDMX — 34 humedales, 26.2 ha, 397 spp aves, 10x CO2 vs selvas
- **E.7** Referencias academicas y oficiales completas

## Brecha de Cobertura Page (`/analisis/brecha`)
- 4 KPIs: 16 alcaldias, 5 con humedales, 11 sin, indice promedio
- CoverageMap: Leaflet map with 16 alcaldias color-coded (teal=con, red=sin, radius=need index)
- Ranking table: sortable by indice de necesidad, population, vulnerability metrics
- Top 5 priority alcaldias without wetlands (cards with metrics)
- Need index formula: `(inundacion * 0.3) + (calor * 0.25) + (agua * 0.3) + (densidadNorm * 0.15)`
- Data source: INEGI 2020 census (population), estimated 1-5 scales (vulnerability)

## Hallazgos Page (`/analisis/hallazgos`) — Policy Brief
- Executive summary panel
- 4 finding-recommendation pairs (grid md:grid-cols-2):
  1. Ausencia de monitoreo estandarizado (critico) → protocolo estandarizado
  2. Concentracion territorial (alto) → priorizacion por indice de necesidad
  3. Datos de eficiencia limitados (alto) → monitoreo in-situ con universidades
  4. Ventaja economica no cuantificada (alto) → analisis costo-beneficio formal
- Cost comparison table: humedal ($0.50-2/m3) vs convencional ($5-15/m3) vs cloracion ($0.20-0.80/m3) + fuentes de estimacion
- Call to action with links to /analisis/brecha, /analisis/indicadores, /sobre#metodologia

## ODS Alignment (in `/sobre` and home teaser)
- 4 UN SDGs: ODS 6 (agua), ODS 11 (ciudades), ODS 13 (clima), ODS 15 (ecosistemas)
- ODSCard component with official UN colors and target badges
- Matrix table: humedal x ODS (checkmarks)
- Home teaser: 4 mini-cards linking to /sobre#ods

## Metodologia (in `/sobre#metodologia`)
Content merged into Sobre page as anchor sections. Old `/metodologia` route redirects via middleware.
- Criterios de sistematizacion (6 criterios)
- Tipologias identificadas (3 categorias)
- Fuentes y referencias (`#fuentes`)
- Respaldo cientifico (IPN, UNAM/GAIA, UAM, UACh) — in `analisis/indicadores` Tab 4
- Marco normativo — in Sobre page

## Servicios Ecosistemicos Predominantes
1. Regulacion hidrica (depuracion, filtracion, recarga)
2. Captura de carbono (vegetacion acuatica)
3. Habitat para fauna (aves migratorias, ajolotes, fauna nativa)
4. Educacion ambiental (espacios de aprendizaje)

## Sibling Project
This project shares the same design system and stack as `observatorio-techos-verdes` (green roofs observatory). Key differences:
- **Color palette:** Teal (#0D6B7E) instead of green (#0E5E3A)
- **Data domain:** 8 artificial wetlands instead of 57 green roofs + 60 candidates
- **Analysis:** Ecosystem services focus instead of AHP multi-criteria + structural pre-feasibility
- **No AI integration:** Data comes from PDF inventory, not vision analysis
- **Simpler architecture:** No services/normalizers/repositories layer — direct mock data to store

## Testing

### Stack
- **Vitest** — unit, integration, stress tests
- **@vue/test-utils** — Vue component testing
- **happy-dom** — lightweight DOM environment

### Test Files (85 tests total)
| File | Type | Count | Coverage |
|------|------|-------|----------|
| `tests/unit/useFormatters.test.ts` | Unit | 25 | All 17 formatters |
| `tests/unit/auth.store.test.ts` | Unit | 14 | Auth state, roles, permissions, backward compat |
| `tests/unit/mock-data.test.ts` | Data integrity | 30 | 8 humedales, KPIs, ODS, hallazgos, notihumedal, CMS defaults |
| `tests/stress/data-volume.test.ts` | Stress | 16 | 1000-5000 items: filter/sort/paginate (<50ms) |

### Backend Tests (cercu-backend, 25 tests)
| File | Type | Count | Coverage |
|------|------|-------|----------|
| `tests/unit/validation.test.ts` | Unit/Black-box | 25 | Joi schemas: humedal, hallazgo, prospecto |

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

## Remote Sensing / Percepción remota

### Índices espectrales
| Índice | Fórmula (Sentinel-2) | Rango | Uso para humedales |
|--------|---------------------|-------|-----|
| NDVI | (B08-B04)/(B08+B04) | -1 a 1 | Vegetación en y alrededor del humedal |
| EVI | 2.5×(B08-B04)/(B08+6×B04-7.5×B02+1) | -1 a 1 | Verdor mejorado (menos saturación en vegetación densa) |
| SAVI | ((B08-B04)/(B08+B04+0.5))×1.5 | -1 a 1 | Cobertura ajustada por suelo en zonas urbanas |
| NDWI | (B03-B08)/(B03+B08) | -1 a 1 | **Clave:** detección de cuerpos de agua y monitoreo de niveles |
| LST | Landsat ST_B10 → °C | 25-42°C | Efecto del humedal en reducción de isla de calor |

### Fuentes satelitales

**Sentinel-2 (ESA/Copernicus) — vegetación e hídrica**
- 2 satélites (2A+2B), resolución 10m, revisita 5 días
- Producto L2A (ya corregido atmosféricamente), tiles CDMX: 14QNG, 14QPG, 14QNH
- Bandas: B02 azul (EVI), B03 verde (NDWI), B04 rojo (NDVI/EVI/SAVI), B08 NIR (todos), SCL (nubes)
- Acceso: gratuito vía GEE (`COPERNICUS/S2_SR_HARMONIZED`) o Copernicus Data Space

**Landsat 8/9 (NASA/USGS) — temperatura superficial**
- 2 satélites (L8+L9), resolución 30m (100m térmico), revisita 8 días combinado
- Producto L2SP Collection 2, path/row CDMX: 026/047
- Banda ST_B10: LST en Kelvin, conversión `°C = DN × 0.00341802 + 149.0 - 273.15`
- Acceso: gratuito vía GEE (`LANDSAT/LC08/C02/T1_L2`) o USGS EarthExplorer

**MODIS (NASA) — validación cruzada**
- Resolución 250m-1km, revisita diaria. No se usa como fuente directa (resolución insuficiente para humedales urbanos), pero sirve para verificar tendencias de NDVI/LST

### Consulta en vivo
```
Cliente → useRemoteSensing() → cercu-backend POST /observatory/humedales/remote-sensing/indices
                                  → Google Earth Engine (gratis, prioridad)
                                  → Sentinel Hub (gratis 30k req/mes, fallback)
                              → datos locales calibrados (fallback offline: data/envi/alcaldias.ts)
```
El procesamiento de GEE/Sentinel Hub ocurre en **cercu-backend**, no en Nitro. El composable solo consume la API y tiene fallback local.

### Archivos
- `types/remote-sensing.ts` — `IndicesEspectrales`, `RSAlcaldiaData`, `RSHumedalData`, `SerieTemporal`, `CalidadDatos`
- `data/envi/alcaldias.ts` — 16 alcaldías con serie temporal mensual 2019-2025 (placeholder calibrado, NDWI elevado en alcaldías con humedales)
- `composables/useRemoteSensing.ts` — `fetchIndices({ lat, lng, alcaldia? })` → `indices`, `serie`, `fuente`, `fuenteLabel`, `calidad`, `confianzaColor`

### Serie temporal
~78 observaciones mensuales (2019-2025) con variación estacional: NDVI↑ y NDWI↑ en lluvias (jun-oct), LST↑ en secas (mar-may). NDWI es más sensible a la estacionalidad que NDVI para humedales.

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
  ArticleEditor.client.vue   # GrapesJS visual editor for Notihumedal articles
pages/admin/
  login.vue                  # Email + password login form
  index.vue                  # Dashboard con pipeline visual, stats, quick links
  prospectos/index.vue       # Tabs: Cola de aprobación + Detector geoespacial
  humedales/index.vue        # Inventario: humedales registrados (8 del mapa público)
  hallazgos/index.vue        # Hallazgos y recomendaciones (contenido editorial)
  notihumedal/index.vue      # CRUD artículos + cola de prospectos scrapeados (2 tabs)
  detector/index.vue         # Redirect → /admin/prospectos
```

### Admin Routes (orden de pipeline)
- `/admin/login` — login (layout default)
- `/admin` — dashboard con pipeline visual
- `/admin/prospectos` — tabs: Cola de aprobación + Detector (entrada del pipeline)
- `/admin/humedales` — inventario de humedales registrados (fin del pipeline)
- `/admin/hallazgos` — hallazgos y recomendaciones (contenido editorial)
- `/admin/notihumedal` — CRUD artículos + cola de prospectos scrapeados (2 tabs)

### Notihumedal Admin (CRUD + Scraping Pipeline)

**Tab 1: Artículos publicados**
- `AdminDataTable` con CRUD completo (crear, editar, eliminar)
- Editor visual GrapesJS (`ArticleEditor.client.vue`) para el contenido
- Fallback a `data/notihumedal.ts` sin backend

**Tab 2: Prospectos scrapeados**
- Cola de aprobación: pendiente → aprobado/rechazado
- Filtro por estado, botón "Ejecutar scraper" manual
- Al aprobar: pre-llena formulario de artículo para editar antes de publicar
- Al rechazar: modal con notas (artículo no vuelve a aparecer — deduplicación por urlHash)

**API endpoints esperados (cercu-backend):**
```
GET/POST/PATCH/DELETE  /observatory/{obs}/admin/notihumedal[/{id}]
GET    /observatory/{obs}/admin/notihumedal/prospectos?status={status}
POST   /observatory/{obs}/admin/notihumedal/prospectos/{id}/aprobar
POST   /observatory/{obs}/admin/notihumedal/prospectos/{id}/rechazar
POST   /observatory/{obs}/admin/notihumedal/scraper/run
```

**Cron scraper (backend):** `50 23 * * *` — busca noticias en SciELO, Google Scholar, SEDEMA, CONABIO, Gobierno CDMX. Deduplicación por SHA-256 del URL.

### GrapesJS Article Editor (`ArticleEditor.client.vue`)

Visual editor para contenido de artículos Notihumedal. Configuración basada en Axend (`/Axend/axend-bo-front`).

- **Plugin:** `grapesjs-preset-webpage` (bloques: columnas, texto, imagen, video, mapa)
- **Bloques personalizados** (categoría "Articulo"): Título, Párrafo, Cita, Imagen con pie, Destacado, Separador, Fuente/Referencia
- **Device preview:** Desktop, Tablet (768px), Mobile (375px)
- **Style manager:** General, Espaciado, Bordes, Dimensiones
- **Theme:** Colores del design system (primary `#0D6B7E`)
- **Persistencia:** `getOutput()` → `{ html, css, editorData }`. El `editorData` se guarda en el backend para recarga completa del estado del editor.
- **Patrón `.client.vue`:** Solo renderiza en cliente, envuelto en `<ClientOnly>` con fallback
- **`storageManager: false`** — sin localStorage, el estado se persiste vía API

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
