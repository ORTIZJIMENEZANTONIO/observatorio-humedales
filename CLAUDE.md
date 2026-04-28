# Observatorio de Humedales Artificiales CDMX

## Product
Plataforma digital de monitoreo, inventario y analisis de humedales artificiales en la Ciudad de Mexico. Sistematiza informacion geoespacial, caracteristicas tecnicas (vegetacion, sustrato, tipo de flujo, volumen), servicios ecosistemicos y tipologias de 13 humedales artificiales identificados en 7 alcaldias.

Basado en el inventario Fase 1 elaborado por M. en C. Diego Dominguez Solis — Instituto Politecnico Nacional, y en evidencia academica publicada (Luna-Pabello & Aburto-Castañeda, 2014; Ramirez-Carrillo, Luna-Pabello & Arredondo-Figueroa, 2009; GAIA — Facultad de Quimica, UNAM).

Contenido 100% en espanol (es-MX). Tono: institucional, tecnico pero accesible.

### Jerarquia de fuentes (PRIORIDAD ALTA)
Al buscar e integrar informacion, seguir siempre esta jerarquia:
1. **PDFs proporcionados por el usuario** — prioridad absoluta
2. **Bases de datos academicas indexadas:** Scopus, Springer, Google Scholar, Web of Science/Clarivate, ScienceDirect (Biblioteca IPN), SciELO, Redalyc
3. **Fuentes institucionales:** CONAGUA, CONABIO, Gobierno CDMX, UNAM, IPN, UAM
4. **Prensa y comunicados** — solo como complemento, nunca como fuente primaria de datos tecnicos

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
    humedalito.svg          # Mascota del observatorio (hero banner)
  components/
    common/                 # AppHeader, AppFooter, SectionTitle, ODSCard, PaginationControls, AnalisisSubNav, HumedalitoBlink, HeroSection
    charts/                 # DoughnutChart.client.vue, BarChart.client.vue
    map/                    # MapPanel.client.vue, CoverageMap.client.vue
  composables/
    useFormatters.ts        # es-MX locale formatters (humedal types, flujo, vegetacion, estados, servicios)
    useMapConfig.ts         # Leaflet config, marker styles
    useScrollReveal.ts      # IntersectionObserver scroll-reveal animations
    useCmsContent.ts        # CMS content composable (reads from Pinia cms store)
    useBackendStatus.ts     # Global backend availability check (cached, one request)
  data/
    mock-humedales.ts       # 12 Humedal records (exported as `humedales`)
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
    index.vue               # Home (lava lamp hero+Humedalito SVG con blink/speech, KPIs interactivos, features, tipologias, servicios, ODS teaser, map teaser)
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
    images/humedales/       # 12 fotos reales de humedales (aragon-stha.jpg + aragon-espiral.jpg separados)
  stores/
    humedales.ts            # Pinia store (composable style, reactive filters, CRUD: add/update/delete)
    hallazgos.ts            # Pinia store for findings (shared /analisis/hallazgos↔/admin/hallazgos, CRUD)
    notihumedal.ts          # Pinia store for articles (shared admin↔public, CRUD: add/update/delete)
    prospectos.ts           # Pinia store for wetland prospects (formulario→admin pipeline, approve/reject)
    auth.ts                 # Auth store (login, logout, roles, permissions — granular per role)
    cms.ts                  # CMS store (page sections, fetch from API, shared between admin and public)
  types/
    index.ts                # Core types (Humedal, TipoHumedal, AdminRole, AdminPermission, AdminUser, ProspectoNoticia, etc.)
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
   [mock-humedales.ts]     /data/             (initial/fallback data)
         ↓
   [Pinia Store]           /stores/           (init from mock, then fetch from API)
         ↓
   [onMounted fetch]       public pages       (GET /observatory/{obs}/humedales etc.)
         ↓                                    (backend filters visible/archivado)
   [Components/Pages]      (search, filter, visualize)
```

### Public pages → backend data loading
All public pages that display inventory data fetch from cercu-backend on mount. If backend is unavailable, mock data is used as fallback.

| Page | Endpoint | Store method |
|------|----------|-------------|
| `/inventario` | `GET /observatory/{obs}/humedales` | `store.setHumedales(items)` |
| `/mapa` | `GET /observatory/{obs}/humedales` | `store.setHumedales(items)` |
| `/analisis/hallazgos` | `GET /observatory/{obs}/hallazgos` | `store.setHallazgos(items)` |
| `/notihumedal` | `GET /observatory/{obs}/notihumedal` | `store.setArticulos(items)` |
| `/notihumedal/[slug]` | `GET /observatory/{obs}/notihumedal` | `store.setArticulos(items)` |

Public endpoints already filter `visible=true, archivado=false` server-side. The `set*` methods also apply localStorage overrides for offline admin changes.

### Environment Variables
- `NUXT_PUBLIC_DATA_MODE`: `mock` (default) — controls data source; mock data used as fallback when backend unavailable
- `NUXT_PUBLIC_API_BASE_URL`: cercu-backend API URL (default: `http://localhost:3003/api/v1`)

### Data Source
The inventory comes from "Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1" by M. en C. Diego Dominguez Solis (IPN). Data was extracted from PDF and Excel files. The Bosque de Aragon entries (STHA 2012 + Segundo Humedal 2020) are cross-referenced with Luna-Pabello & Aburto-Castañeda (2014), TIP Rev., Facultad de Quimica, UNAM. The CIBAC Cuemanco entry is documented in Ramirez-Carrillo, Luna-Pabello & Arredondo-Figueroa (2009), Rev. Mex. Ing. Quim. Additional entries: SHATTO and ENCiT (UNAM CU, 2024/2022), CIIEMAD-IPN experimental (Dominguez Solis, 2025), San Mateo Tlaltenango (UAM Cuajimalpa, 2019), and the UAM-Azcapotzalco pilot (Barcelo et al., IMTA 2014). Total: 13 wetland records.

### References

#### Academic Research
- Dominguez Solis, D. (2024). Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1. **CIIEMAD-IPN.**
- Dominguez Solis, D. (2025). Humedal artificial: una solucion basada en la naturaleza para el tratamiento de aguas residuales a nivel hogar en la Colonia La Laguna Ticoman, CDMX. Tesis de maestria. **CIIEMAD-IPN.**
- Dominguez-Solis, D. et al. (2025). Constructed Wetlands as a Decentralized Treatment Option for Domestic Wastewater: A Systematic Review (2015-2024). *Water*, 17(10), 1451. [DOI](https://doi.org/10.3390/w17101451)
- Dominguez-Solis, D. et al. (2026). Sustainable Management of Organic Waste as Substrates in Constructed Wetlands: A Systematic Review. *Sustainability*, 18(1), 318. [DOI](https://doi.org/10.3390/su18010318)
- Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficacion del lago del Bosque de San Juan de Aragon. *TIP Rev. Esp. Ciencias Quimico-Biologicas*, 17(1). **UNAM-GAIA, Fac. Quimica.** [SciELO](https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-888X2014000100003)
- Ramirez-Carrillo, H.F., Luna-Pabello, V.M. y Arredondo-Figueroa, J.L. (2009). Evaluacion de un humedal artificial de flujo vertical intermitente, para obtener agua de buena calidad para la acuicultura. *Rev. Mex. Ing. Quim.*, 8(1), 93-99. **UNAM / UAM.** [PDF SciELO](https://www.scielo.org.mx/pdf/rmiq/v8n1/v8n1a9.pdf)
- Luna Pabello, V.M. / GAIA (2020-2024). Desarrollo tecnologico SHATTO y sistemas de humedales artificiales en UNAM. 30+ años investigacion, 2 patentes, ~10 instalaciones.
- Barcelo, I.D., Solis, H.E., Garcia, J., Salazar, M., Rivas, A., Giacoman, G. y Zetina, C. (2014). Comportamiento de un sistema humedal-laguna de maduracion-humedal de pulimento a nivel piloto para el tratamiento de aguas municipales en la UAM Unidad Azcapotzalco. En A. Rivas Hernandez y D. Paredes Cuervo (Eds.), *Sistemas de humedales para el manejo, tratamiento y mejoramiento de la calidad del agua* (pp. 62-67). Jiutepec, Morelos: **IMTA / UTP.** ISBN 978-958-722-319-09. [PDF IMTA](https://www.imta.gob.mx/biblioteca/libros_html/sistemas-de-humedales/files/assets/common/downloads/publication.pdf)
- Barcelo-Quintal, I.D. et al. (2019). Remocion de fosforo mediante un humedal subsuperficial de flujo horizontal. **UAM Azcapotzalco — Repositorio Zaloamati.** [Zaloamati](https://zaloamati.azc.uam.mx/items/08b3a79f-49bc-4216-8902-a43e28466ab6)
- Chavez Mejia, A.C. / Almeida Lenero, L. / Martin del Pozzo, A.L. (2022). Proyecto SECTEI "Recuperacion hidrica de los pedregales del Xitle y cuenca del Rio Magdalena en sitios de interes geo-patrimonial". **UNAM (IIngen, Fac. Ciencias, Inst. Geofisica) — SECTEI CDMX.** Construccion: GMI Grupo Multidisciplinario Integral, S.C. [SECTEI](https://sectei.cdmx.gob.mx/comunicacion/nota/proyectos-para-el-rescate-del-rio-magdalena) | [Gaceta UNAM 2023](https://www.gaceta.unam.mx/instala-la-unam-humedales-para-tratamiento-y-reutilizacion-del-agua/) | [DGCS-UNAM Boletin 1060/2022](https://www.dgcs.unam.mx/boletin/bdboletin/2022_1060.html)
- Martinez-Cruz, P. et al. (2006). Empleo de humedales artificiales para el tratamiento de aguas de un canal experimental de Xochimilco. *Hidrobiologica*, 16(3), 211-219. **UAM-Iztapalapa.** [SciELO](https://www.scielo.org.mx/scielo.php?pid=S0188-88972006000300001&script=sci_abstract)
- Romero-Aguilar, M. et al. (2009). Tratamiento de aguas residuales por un sistema piloto de humedales artificiales. *Rev. Int. Contam. Ambie.*, 25(3). **UAEMor / UAEMex.** [SciELO](https://www.scielo.org.mx/scielo.php?pid=S0188-49992009000300004&script=sci_abstract)
- Nava-Rojas, J. et al. (2023). Remocion de contaminantes en humedales artificiales de flujo subsuperficial: una revision. *Terra Latinoamericana*, 41, e1715. **TecNM Boca del Rio.** [SciELO](https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0187-57792023000100402)
- UACh, Depto. de Agroecologia. Evaluacion de humedal del Barrio Santiaguito, Texcoco. Eficiencias: 100% coliformes, 98.47% solidos sedimentables.

#### Key Efficiency Data
| Parameter | Efficiency | Source |
|-----------|-----------|--------|
| DQO | 92% | Ramirez-Carrillo et al. (2009), CIBAC Cuemanco, 12 meses |
| DQO | 95.7% | Romero-Aguilar et al. (2009), estiaje |
| DQO | 80% | Luna-Pabello & Aburto-Castañeda (2014), Aragon STHA |
| N-NH₄ | 85% | Ramirez-Carrillo et al. (2009), CIBAC Cuemanco |
| N amoniacal | 89.7% | Romero-Aguilar et al. (2009), lluvias |
| N amoniacal | 86.4% | Martinez-Cruz et al. (2006), S. americanus |
| PO₄³⁻ | 80% | Ramirez-Carrillo et al. (2009), CIBAC Cuemanco |
| Nitrogeno | 50% | Luna-Pabello & Aburto-Castañeda (2014), Aragon HAFSS |
| Fosforo | 50% | Luna-Pabello & Aburto-Castañeda (2014), Aragon HAFS |
| Coliformes fecales | >90% | Luna-Pabello & Aburto-Castañeda (2014), Aragon |
| Coliformes | 100% | UACh, Texcoco |
| Solidos sedimentables | 98.5% | UACh, Texcoco |
| DBO₅ | 92.07% | Dominguez Solis (2025), CIIEMAD-IPN experimental |
| SST | 81.31% | Dominguez Solis (2025), CIIEMAD-IPN experimental |
| Amonio | 96.67% | Dominguez Solis (2025), CIIEMAD-IPN experimental |
| Fosforo | 88.81% | Dominguez Solis (2025), CIIEMAD-IPN experimental |

#### Official & Institutional Sources
- CONAGUA — [Inventario Nacional de Humedales](https://sigagis.conagua.gob.mx/humedales/), [Programa INH](https://www.gob.mx/conagua/acciones-y-programas/inventario-nacional-de-humedales-inh)
- CONABIO — [Sistema de Monitoreo de Humedales (SIMOH-Mx)](https://www.biodiversidad.gob.mx/monitoreo/simoh-mx). Humedales capturan 10x mas CO2 que selvas
- Gobierno CDMX (2021) — [Playa de Aves en Bosque de Aragon](https://gobierno.cdmx.gob.mx/noticias/playa-de-aves-en-bosque-de-aragon/)
- Gobierno CDMX (2021) — [Parque Cuitlahuac](https://gobierno.cdmx.gob.mx/noticias/parque-cuitlahuac/)
- Fundacion UNAM (2020) — [Inauguracion humedal artificial Bosque de Aragon](https://www.fundacionunam.org.mx/donde-paso/unam-inaugura-humedal-artificial-en-el-bosque-de-san-juan-de-aragon/)
- DGCS-UNAM (2020) — [Desarrollan universitarios humedal artificial](https://www.dgcs.unam.mx/boletin/bdboletin/2020_150.html), Boletin 150
- NOM-001-SEMARNAT-2021 — Limites de contaminantes en descargas de aguas residuales
- NOM-003-SEMARNAT-1997 — Agua tratada para reuso en servicios publicos
- Convencion Ramsar — Xochimilco y San Gregorio Atlapulco (2,657 ha, importancia internacional)
- Gobierno CDMX (2021-2023) — Comunicados: Playa de Aves, Cerro de la Estrella, ANP reabiertas
- Fundacion UNAM (2020) — Inauguracion humedal artificial Bosque de Aragon
- Maspormas (2021) — Humedales artificiales: innovacion para tratar aguas residuales
- Facultad de Quimica, UNAM (2024) — [Inauguracion SHATTO](https://quimica.unam.mx/inauguracion-shatto-humedal-fq-2024/)
- DGCS-UNAM (2024) — [Con humedal artificial tratan orina](https://www.dgcs.unam.mx/boletin/bdboletin/2024_489.html), Boletin 489
- Gaceta UNAM (2025) — [En la ENCiT consolidan humedal con ecotecnologia](https://www.gaceta.unam.mx/en-la-encit-consolidan-humedal-con-ecotecnologia/)
- Semanario de la UAM (2019) — La UAM instala primeros humedales artificiales en San Mateo Tlaltenango. Ano 1, Num. 12

## Key Types

### Core Types
```typescript
// Clasificacion tecnica de humedales artificiales por sistema de flujo
// FWS = Free Water Surface (agua visible sobre el sustrato)
// SFS = Subsurface Flow (agua fluye a traves del sustrato)
type TipoHumedal =
  | 'ha_fws'                  // HA de flujo superficial (FWS) — agua visible
  | 'ha_sfs_horizontal'       // HA de flujo subsuperficial horizontal (HSSF)
  | 'ha_sfs_vertical'         // HA de flujo subsuperficial vertical (VSSF)
  | 'ha_hibrido'              // HA hibrido (FWS + SFS en serie)

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
  visible?: boolean         // default true — if false, hidden from public pages
  archivado?: boolean       // default false — if true, archived (not shown publicly)
}
```

### Notihumedal & Scraping Types
```typescript
interface ArticuloNotihumedal {
  id: number; slug: string; titulo: string; fecha: string
  resumen: string; contenido: string; imagen?: string
  fuenteImagen?: string; autor: string; tags: string[]
  url?: string; fuente?: string       // source URL and credit
  visible?: boolean; archivado?: boolean
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
  visible?: boolean; archivado?: boolean
}
```

## Inventario de Humedales Artificiales (14 registros — 13 publicos + 1 pendiente de verificacion)

| # | Nombre | Alcaldia | Tipo HA | Superficie | Ano | Fuente academica |
|---|--------|----------|---------|-----------|-----|------------------|
| 1 | Anfibium | Miguel Hidalgo | FWS | 1,200 m² | 2023 | Dominguez Solis (2024) |
| 2 | Parque Ecologico Cuitlahuac | Iztapalapa | HSSF | 8,795 m² | 2021-2023 | Dominguez Solis (2024) |
| 3 | Aragon — STHA (HAFSS+HAFS) | Gustavo A. Madero | Hibrido | 8,085 m² | 2012 | Luna-Pabello & Aburto-Castañeda (2014) |
| 8 | Segundo Aragon (HAFSS, doble espiral) | Gustavo A. Madero | HSSF | 3,108 m² | 2020 | DGCS-UNAM (2020) |
| 4 | Playa de Aves | Gustavo A. Madero | FWS | 1,100 m² | 2021 | Gobierno CDMX (2021) |
| 5 | Cerro de la Estrella | Iztapalapa | FWS | — | 2022 | Gobierno CDMX (2022) |
| 6 | Vivero San Luis Tlaxialtemalco | Xochimilco | FWS | 48,900 m² | 2023 | Dominguez Solis (2024) |
| 7 | CIBAC Cuemanco | Xochimilco | VSSF | 55 m² | 2007 | Ramirez-Carrillo et al. (2009) |
| 9 | SHATTO — Fac. Quimica UNAM | Coyoacan | HSSF | — | 2024 | Fac. Quimica UNAM (2024); GAIA |
| 10 | ENCiT — Ciencias de la Tierra UNAM | Coyoacan | Hibrido | 20 m² | 2022 | Gaceta UNAM (2025) |
| 11 | Experimental CIIEMAD-IPN | Gustavo A. Madero | HSSF | — | 2024 | Dominguez Solis (2025), tesis |
| 12 | San Mateo Tlaltenango — UAM Cuajimalpa | Cuajimalpa | Hibrido | — | 2019 | Semanario UAM (2019) |
| 13 | Piloto UAM-Azcapotzalco (humedal-laguna-pulimento) | Azcapotzalco | Hibrido | ~143 m² | 2010 | Barcelo et al. (2014), IMTA |
| 14* | Foro Cultural Magdalena Contreras (PROVISIONAL, `visible: false`) | Magdalena Contreras | HSSF (inferido) | s/d | 2022 | SECTEI 2022; Gaceta UNAM 2023; DGCS-UNAM Boletin 1060/2022 |

\* **Registro #14 esta marcado `visible: false` en mock y migracion** porque la atribucion exacta del sitio no se ha confirmado en comunicado oficial UNAM o SECTEI. Solo aparece en `/admin/humedales`, no en `/inventario` publico ni se cuenta en KPIs publicos. Para promoverlo a publico hay que verificar con Dra. Alma Chavez Mejia (IIngen UNAM) tipo, superficie, capacidad y vegetacion, luego cambiar `visible` a `true`.

### Tipologias por sistema de flujo
1. **HA flujo superficial (FWS):** Anfibium, Playa de Aves, Cerro de la Estrella, Vivero Tlaxialtemalco — agua visible
2. **HA flujo subsuperficial (SFS):** Cuitlahuac (HSSF), Segundo Aragon (HSSF), CIBAC Cuemanco (VSSF), SHATTO (HSSF), CIIEMAD-IPN (HSSF) — agua a traves del sustrato
3. **HA hibrido (FWS + SFS):** Aragon STHA, ENCiT UNAM, San Mateo Tlaltenango (UAM Cuajimalpa), Piloto UAM-Azcapotzalco (humedal-laguna-pulimento) — sistemas combinados en serie

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
- **Lava lamp hero** — Reusable `CommonHeroSection` component (4 orbs: 3 teal + 1 eco accent) with `mix-blend-mode: screen`, blur(26px), GPU-accelerated `translate3d`, staggered keyframes (10-16s). All 9 public pages use `<CommonHeroSection compact>`. Home page uses 6 orbs (extra orbs inline). Adapted from cercu-frontend pattern
- **Progressive disclosure** — CTAs reveal on hover (`opacity-0 → group-hover:opacity-100`)
- **Interactive feedback** — All clickable cards use `cursor-pointer`, `hover:-translate-y-0.5` or `hover:-translate-y-1.5`, `transition-all duration-300`, `hover:shadow-lg`
- **Lazy loading** — All `<img>` tags use `loading="lazy"` for performance
- **Map cursors** — Map containers use `cursor-pointer` to indicate interactivity

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
| `.animate-float` | Translate Y 0→-12px→0 (3s infinite) |
| `.delay-100` ... `.delay-700` | Animation delay utilities |

### Lava Lamp Hero (`CommonHeroSection.vue`)
Reusable component used by ALL public pages via `<CommonHeroSection compact>`.
- 4 orbs: 3 teal primary (`#0D6B7E`, `#1088A0`, `#094E5C`) + 1 eco accent (`#43A047`)
- GPU-accelerated via `translate3d` + `will-change: transform`
- `filter: blur(26px)`, `mix-blend-mode: screen`
- Keyframes `lavaA`-`lavaD` (10-16s staggered)
- Home page (`pages/index.vue`) adds 2 extra orbs inline (6 total)
- `compact` prop controls padding (`py-10` vs `py-12`)
- `<slot>` receives inner content; wrapper provides `container-wide` + `z-10`

**Pages using `<CommonHeroSection compact>`:**
inventario, analisis (index, brecha, hallazgos, indicadores), notihumedal (index, [slug]), sobre, registra

### Humedalito Mascot (pages/index.vue + CommonHumedalitoBlink.vue)
Adapted from Bolillo mascot pattern (guardianes-del-barrio-verde). Single SVG with CSS-driven states:
- **Idle:** Float (3s translateY ±10px) + breathing (3s scaleY 1→1.015)
- **Blink:** Every 2.6s, 150ms duration. Uses `CommonHumedalitoBlink` component: SVG overlay with two skin-colored ellipses (`#874120`) positioned over each eye (left cx=240 cy=405, right cx=375 cy=405). `ry` transitions from 0 (open) to 42 (closed) via CSS transition 70ms — covers pupil, iris, highlights and eyebrows
- **Speaking:** Gentle bounce (0.4s translateY -3px + scale 1.02) when speech bubble visible
- **Speech bubble:** "Hola, soy Humedalito" — diagonal top-right, appears on hover (desktop `mouseenter`/`mouseleave`) or tap (mobile `touchstart` toggle, auto-hide 2.5s)
- **Pet easter egg:** Tap 5x in 3s → wiggle (rotate ±3°) + floating hearts (💚💙) for 3s, debounced 100ms
- `cursor: pointer`, `touch-action: manipulation`, `user-select: none`
- `@pointerdown.prevent` for pet interaction

### KPI Cards Interactivity
- KPI cards are `<NuxtLink>` routing to relevant pages (inventario, indicadores, brecha)
- `cursor-pointer`, hover: `-translate-y-1.5`, `shadow-xl`, icon `scale-125 rotate-6`, value color → primary

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
- **Registra** (`/registra`) — Multi-step wizard (3 pasos: datos técnicos, documento, confirmación). Envia prospecto a prospectos store/API → aparece en /admin/prospectos

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

### Stores (Pinia composable style, with CRUD + localStorage persistence)
All data stores expose CRUD operations for admin pages. API-first with local fallback.
Stores init from mock data with localStorage overrides applied, then public pages fetch from backend on mount.

```typescript
// humedales.ts — shared between /inventario, /mapa (public) and /admin/humedales
//   humedales: all items (admin). filtered/publicHumedales: excludes archivado/hidden (public)
//   setHumedales(items): replaces store data with localStorage overrides applied
//   updateHumedal(id, { visible, archivado }): persists overrides to localStorage
//   totalCount, alcaldias, totalSuperficie: computed from publicHumedales (not raw)

// hallazgos.ts — publicHallazgos excludes archivado/hidden; admin uses hallazgos directly
//   setHallazgos(items): applies localStorage overrides

// notihumedal.ts — filtered excludes archivado/hidden; admin uses articulos directly
//   setArticulos(items): applies localStorage overrides

// prospectos.ts — shared between /registra (public form) and /admin/prospectos
```

**localStorage keys:** `obs-humedales-overrides`, `obs-hallazgos-overrides`, `obs-notihumedal-overrides`
Each stores `{ [id]: { visible?, archivado? } }`. Applied on store init and on `set*()` calls (when backend data arrives). Ensures admin visibility changes persist across page reloads even when backend PATCH fails (auth issues).

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
Each humedal has an optional `imagen` field pointing to `/images/humedales/*.jpg` (fotos reales de fuentes institucionales: Fundacion UNAM, SEDEMA, Gobierno CDMX, UAM).
Cards show the image with `object-cover`; fallback to gradient + SVG icon if no image. Credit shown via `fuenteImagen` field.

## Indicadores Page (`/analisis/indicadores`, 4 tabs)

### Tab 1: Distribucion
- Doughnut chart: humedales por alcaldia
- Doughnut chart: humedales por tipologia
- Horizontal bar chart: superficie por humedal (only those with data)

### Tab 2: Servicios Ecosistemicos
- Bar chart: frecuencia de cada servicio entre los 12 humedales
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
- 4 KPIs: 16 alcaldias, 7 con humedales, 9 sin, indice promedio
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
- Cost comparison cards (redesigned): humedal ($0.50-2/m3) vs convencional ($5-15/m3) vs cloracion ($0.20-0.80/m3) con barra visual de costo relativo, fuente por metodo, y links a SciELO
- Call to action with links to /analisis/brecha, /analisis/indicadores, /sobre#metodologia

## ODS Alignment (in `/sobre` and home teaser)
- 4 UN SDGs: ODS 6 (agua), ODS 11 (ciudades), ODS 13 (clima), ODS 15 (ecosistemas)
- ODSCard component with official UN colors and target badges
- Matrix table: humedal x ODS (checkmarks)
- Home teaser: 4 mini-cards linking to /sobre#ods

## Metodologia (in `/sobre#metodologia`)
Content merged into Sobre page as anchor sections. Old `/metodologia` route redirects via middleware.
- Criterios de sistematizacion (6 criterios, incluye "Tipo de humedal artificial" con clasificacion FWS/SFS)
- Tipologias por sistema de flujo (3 categorias: FWS, SFS, hibrido)
- Fuentes y referencias (`#fuentes`) — sin SEDEMA, con links a SciELO para cada articulo
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
- **Data domain:** 12 artificial wetlands instead of 57 green roofs + 60 candidates
- **Analysis:** Ecosystem services focus instead of AHP multi-criteria + structural pre-feasibility
- **No AI integration:** Data comes from PDF inventory, not vision analysis
- **Simpler architecture:** No services/normalizers/repositories layer — mock data fallback + backend API fetch on mount + localStorage overrides for admin changes

## Testing

### Stack
- **Vitest** — unit, integration, stress tests
- **@vue/test-utils** — Vue component testing
- **happy-dom** — lightweight DOM environment

### Test Files (87 tests total)
| File | Type | Count | Coverage |
|------|------|-------|----------|
| `tests/unit/useFormatters.test.ts` | Unit | 26 | All formatters (TipoHumedal ha_fws/sfs/hibrido, badges, KPI) |
| `tests/unit/auth.store.test.ts` | Unit | 15 | Auth state, roles (granular admin perms), backward compat |
| `tests/unit/mock-data.test.ts` | Data integrity | 30 | 12 humedales (ha_ prefix validation), KPIs, ODS, hallazgos, notihumedal, CMS defaults |
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

## Backend (cercu-backend)

### Ubicacion y estructura
- **Path:** `/Users/antonioortiz/Desktop/Antonio/cercu-backend`
- **ORM:** TypeORM 0.3 + MySQL 8
- **Synchronize:** `true` en development (auto-sync schema)
- **Entities:** `src/entities/observatory/` (Humedal, Hallazgo, Notihumedal, ObservatoryAdmin, CmsSection, ProspectSubmission, ProspectoNoticia, etc.)

### Migraciones
- **Directorio:** `src/migrations/`
- **Migración 1:** `1713297600000-HumedalesSchemaUpdate.ts`
  - Agrega `role` + `permissions` a `observatory_admins`
  - Agrega `fuente`, `fuenteImagen`, `tipoVegetacion` a `obs_humedales` + cambia `funcionPrincipal` a TEXT
  - Agrega `fuenteImagen` a `obs_notihumedal`
  - Migra valores `tipoHumedal` al formato `ha_*` (FWS/SFS)
  - Idempotente (verifica columnas antes de ALTER)
- **Migración 2:** `1714000000000-AddVisibleArchivadoFields.ts`
  - Agrega `visible` (BOOLEAN DEFAULT true) y `archivado` (BOOLEAN DEFAULT false) a `obs_humedales`, `obs_hallazgos`, `obs_notihumedal`
  - Agrega `url` (VARCHAR 500) y `fuente` (VARCHAR 500) a `obs_notihumedal`
  - Idempotente (verifica columnas antes de ALTER)
- **Migración 3:** `1717000000000-AddShattoEncitHumedales.ts`
  - Inserta SHATTO (Fac. Quimica UNAM, 2024) y ENCiT (Ciencias de la Tierra UNAM, 2022)
  - Idempotente (verifica por nombre con LIKE antes de INSERT)
- **Migración 4:** `1718000000000-AddCiiemadCuajimalpaHumedales.ts`
  - Inserta CIIEMAD-IPN experimental (2024) y San Mateo Tlaltenango / UAM Cuajimalpa (2019)
  - Idempotente (verifica por nombre con LIKE antes de INSERT)
- **Migración 5:** `1719000000000-FixAragonImagePaths.ts`
  - Corrige paths de imagenes: `aragon.jpg` → `aragon-stha.jpg`, `aragon-segundo.jpg` → `aragon-espiral.jpg`
  - Los paths en el seed original no coincidian con los nombres reales de archivo en `public/images/humedales/`
- **Migración 6:** `1720000000000-AddUAMAzcapotzalcoHumedal.ts`
  - Inserta humedal piloto UAM-Azcapotzalco (sistema híbrido humedal–laguna–pulimento, 2010)
  - Amplía columna `fuente` a `TEXT` (cita bibliográfica supera 500 caracteres)
  - Fuente: Barceló et al. (2014), capítulo en libro IMTA *Sistemas de humedales para el manejo, tratamiento y mejoramiento de la calidad del agua*
  - Idempotente (verifica por nombre con LIKE antes de INSERT)
- **Migración 7:** `1721000000000-AddForoMagdalenaContrerasHumedal.ts`
  - Inserta humedal demostrativo Foro Cultural Magdalena Contreras (proyecto SECTEI–UNAM–GMI, 2022)
  - Marcado `visible=false` (PENDIENTE DE VERIFICACIÓN con IIngen UNAM)
  - Fuente: SECTEI CDMX (2022); Gaceta UNAM (2023); DGCS-UNAM Boletín 1060/2022
  - Idempotente (verifica por nombre con LIKE antes de INSERT)
- **Ejecutar:** `npm run migration:run`

### Seeds
- **Admin seed** (`observatory-admin.seed.ts`): Crea/actualiza superadmin desde `.env`. Preserva role/permissions si ya existen. NO sobreescribe usuarios creados manualmente.
- **Content seed** (`observatory-content.seed.ts`): 12 humedales del inventario, 4 hallazgos, 3 articulos notihumedal, CMS sections, prospectos. Solo inserta si `count() === 0` por tabla.
- **Ejecutar:** `npm run seed`

### Entidades observatory (tablas obs_*)
| Entidad | Tabla | Campos nuevos |
|---------|-------|---------------|
| ObservatoryAdmin | observatory_admins | `role` (superadmin/admin/editor), `permissions` (JSON) |
| ObsHumedal | obs_humedales | `fuente`, `fuenteImagen`, `tipoVegetacion` (JSON), `tipoHumedal` ahora `ha_fws/ha_sfs_*/ha_hibrido`, `visible`, `archivado` |
| ObsNotihumedal | obs_notihumedal | `fuenteImagen`, `url`, `fuente`, `visible`, `archivado` |
| ObsHallazgo | obs_hallazgos | `visible`, `archivado` |

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
- **Approval queue:** Prospects from public form (/registra) + detector → pending review → admin approves → humedal added to store/inventory
- **Dynamic data:** All admin sections use Pinia stores shared with public pages. CRUD works with API first, fallback to local store.

### Roles & Permissions
| Rol | Comportamiento |
|-----|---------------|
| `superadmin` | Acceso total (unico con `manage_users`) |
| `admin` | Solo permisos asignados explicitamente (sin `manage_users`) |
| `editor` | Solo permisos asignados explicitamente (sin `manage_users`) |

Permisos asignables: `manage_cms`, `manage_humedales`, `manage_hallazgos`, `manage_notihumedal`, `manage_prospectos`, `manage_users` (solo superadmin).
Route-level enforcement in `middleware/admin.ts`. Sidebar filters nav items by `hasPermission()`. Role badge visible in sidebar.

### Pipeline
```
/registra (formulario publico) → POST /prospectos
Detector (OSM + Turf.js)       → POST /detector/submit
                                      ↓
                               /admin/prospectos (cola de aprobacion)
                                      ↓ Aprobar
                               /admin/humedales (inventario) ↔ /inventario (publico)
                                      
Hallazgos (contenido editorial, fuera del pipeline)
Notihumedal (CRUD articulos) ↔ /notihumedal (publico)
Contenido CMS ↔ paginas publicas (home, sobre, analisis)
```

### Admin Files
```
stores/auth.ts              # Pinia auth store (login, logout, granular permissions per role)
stores/cms.ts               # Pinia CMS store (page sections, API persistence, shared state)
stores/notihumedal.ts       # Pinia notihumedal store (shared admin↔public, CRUD)
stores/prospectos.ts        # Pinia prospectos store (formulario→admin pipeline)
composables/useApi.ts       # $fetch wrapper with Bearer token + 401 handling
composables/useCmsContent.ts # CMS composable (computed from cms store, fetches on mount)
middleware/admin.ts          # Nuxt route middleware (auth + route-level permission check)
layouts/admin.vue            # Admin layout, sidebar with role badge, permission-filtered nav
components/admin/
  AdminDataTable.vue         # Tabla con búsqueda, paginación, acciones, responsive
  ArticleEditor.client.vue   # GrapesJS visual editor (fullscreen, dynamic import, Axend-based)
  ColorClassPicker.vue       # Visual color picker for CMS content (bg, icon, badge, accent)
pages/admin/
  login.vue                  # Email + password login form
  index.vue                  # Dashboard: stats from stores (humedales, hallazgos, articulos, prospectos) + pipeline visual
  prospectos/index.vue       # Tabs: Cola de aprobación (prospectos store) + Detector geoespacial
  humedales/index.vue        # CRUD inventario (humedales store, mismos datos que /inventario)
  hallazgos/index.vue        # Lista hallazgos (hallazgos store, mismos datos que /analisis/hallazgos)
  hallazgos/[id].vue         # Página de edición/creación de hallazgo (full page, no modal)
  notihumedal/index.vue      # CRUD artículos (notihumedal store, mismos datos que /notihumedal)
  usuarios/index.vue         # Gestión de usuarios y permisos (solo superadmin)
  contenido/index.vue        # CMS page list (home, sobre, analisis)
  contenido/[pageSlug].vue   # CMS section editor (accordion, color pickers, auto-save to API)
  detector/index.vue         # Redirect → /admin/prospectos
```

### Admin Dashboard (`/admin`)
Stats computed from Pinia stores (not API-dependent):
- **Humedales:** `humedalesStore.humedales.length`
- **Hallazgos:** `hallazgosStore.hallazgos.length`
- **Artículos:** `notihumedalStore.articulos.length`
- **Prospectos pendientes:** `prospectosStore.pendientes.length`

Pipeline visual + quick links a Prospectos, Inventario, Hallazgos, Notihumedal.

### Admin Routes (orden de pipeline, filtradas por permisos)
- `/admin/login` — login (layout default)
- `/admin` — dashboard con stats de stores + pipeline visual (acceso: todos los autenticados)
- `/admin/prospectos` — cola de aprobación + detector (perm: `manage_prospectos`)
- `/admin/humedales` — CRUD inventario, mismos datos que /inventario (perm: `manage_humedales`)
- `/admin/hallazgos` — lista + `/admin/hallazgos/nuevo` o `/admin/hallazgos/:id` para editar (perm: `manage_hallazgos`)
- `/admin/notihumedal` — CRUD artículos, mismos datos que /notihumedal (perm: `manage_notihumedal`)
- `/admin/contenido` — CMS páginas públicas (perm: `manage_cms`)
- `/admin/usuarios` — gestión de usuarios y roles (perm: `manage_users`, solo superadmin)
- `/admin/contenido/{pageSlug}` — editor de secciones con auto-guardado a API

### Notihumedal Admin (CRUD + Scraping Pipeline)

**Tab 1: Artículos publicados**
- `AdminDataTable` con CRUD completo (crear, editar, eliminar)
- Editor visual fullscreen GrapesJS (`ArticleEditor.client.vue`) — al abrir nuevo/editar, toma todo el viewport
- Layout fullscreen: toolbar teal (cerrar, cancelar, previsualizar, guardar) + campos con labels en grid + editor GrapesJS
- Preview dialog con selector de dispositivo (Escritorio, Tablet 768px, Movil 375px)
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

Visual editor para contenido de artículos Notihumedal. Arquitectura basada en Axend CrmEmailEditor (`/Axend/axend-bo-front/components/crm-cmpnts/CrmEmailEditor.vue`).

- **Dynamic import:** GrapesJS y preset se cargan con `await import()` en `initEditor()`. CSS cargado desde CDN.
- **Plugin:** `grapesjs-preset-webpage` (bloques renombrados a español: "1 columna", "2 columnas", "Texto", "Enlace", "Imagen", "Video", "Mapa")
- **Bloques personalizados** (categoría "Contenido"): Titulo, Parrafo, Enlace/Boton, Cita, Imagen con pie, Destacado, Separador, Fuente/Referencia
- **Bloques de tablas** (categoría "Tablas"): Tabla 2 columnas, Tabla 3 columnas, Tabla detalle
- **Categorías del preset** renombradas: "Basic" → "Estructura"
- **RTE toolbar:** Selector de fuente (Inter, Arial, Georgia, Times, Verdana, Courier), selector de tamaño (10-48px), editor de enlaces con modal (URL, texto, estilo, color, preview, quitar enlace)
- **Code editor:** Botón `</>` abre panel inferior con tabs HTML/CSS, sync bidireccional (600ms debounce), soporte Tab
- **Cell type extension:** `DomComponents.addType('cell', { extendView: 'text' })` — doble-click edita celdas de tabla
- **Upload button:** Botón "+ Subir imagen" en asset manager, emite `upload-image` al padre, expone `addAssets()`
- **Tooltips 100% en español:** "Mostrar/ocultar bordes", "Vista previa sin paneles", "Pantalla completa", "Escritorio", "Tablet (768px)", "Movil (375px)", "Estilos del elemento seleccionado", "Capas (estructura del documento)", "Bloques para arrastrar al editor", "Configuracion del componente", "Editar codigo HTML y CSS directamente"
- **Device preview:** Escritorio, Tablet (768px), Movil (375px)
- **Style manager:** General, Espaciado, Bordes, Dimensiones
- **Theme:** Colores del design system (primary `#0D6B7E`), custom CSS con `:deep()` para `.gjs-*`
- **Persistencia:** `getOutput()` → `{ html, css, editorData }`, `getPreviewHtml()` genera HTML completo para iframe
- **Patrón `.client.vue`:** Solo renderiza en cliente, envuelto en `<ClientOnly>` con fallback
- **`storageManager: false`** — sin localStorage, el estado se persiste vía API

### CMS Content System (`/admin/contenido`)

Editor de secciones de páginas públicas (home, sobre, analisis). Los cambios se guardan en BD via API.

**Arquitectura:**
```
Admin edita → auto-PUT /admin/cms/{page}/{section} → BD (tabla obs_cms_sections)
                                                          ↓
Página pública → GET /cms/{page}/{section} → BD → useCmsContent() → renderiza
```

**Pinia CMS Store** (`stores/cms.ts`):
- `getSection(page, section)` — devuelve items del store o defaults como fallback
- `setSection(page, section, items)` — actualiza estado reactivo (propagación inmediata)
- `fetchSection(page, section)` — consulta API pública, sin cache (siempre consulta)
- `initPage(page)` — inicializa todas las secciones de una página desde defaults

**Composable** (`useCmsContent.ts`): Retorna `computed` desde el store + fetch en `onMounted`. Usado en `pages/index.vue`, `pages/sobre/index.vue`, `pages/analisis/index.vue`.

**Admin page** (`/admin/contenido/[pageSlug]`):
- Accordion con secciones editables por página
- Auto-guardado a API en cada edición (aplicar cambio, reordenar)
- Indicador "Guardando..." / "Guardado" por sección
- `ColorClassPicker` visual para campos de color (bg, iconColor, accentColor, badgeClass)
- Botones de edición deshabilitados sin backend

**Backend endpoints** (cercu-backend, ya implementados):
```
GET  /observatory/{obs}/cms/{pageSlug}/{sectionKey}           # público, sin auth
GET  /observatory/{obs}/admin/cms/{pageSlug}                  # admin, auth requerido
PUT  /observatory/{obs}/admin/cms/{pageSlug}/{sectionKey}     # admin, body: { items: [...] }
```

**BD:** Tabla `obs_cms_sections` con columnas: `id`, `pageSlug`, `sectionKey`, `items` (JSON), `updatedBy`, `updatedAt`.

### Visibility & Archive System
All three main content types (Humedal, Hallazgo, ArticuloNotihumedal) support `visible` (default true) and `archivado` (default false) fields:
- **Public pages** fetch from backend public endpoints (which filter server-side) + store computeds (`filtered`, `publicHallazgos`) also exclude hidden/archived client-side
- **Admin pages** show all items with toggle buttons in table columns (eye icon for visible, archive box for archivado)
- **Admin forms** include checkbox controls for both fields
- **Backend** public endpoints pass `publicOnly: true` to filter; admin endpoints accept `visible` and `archivado` query params
- **Persistence** admin toggle changes are saved to `localStorage` as overrides, applied on store init and on `set*()` calls. This ensures changes survive page reloads even when backend PATCH fails. When backend is properly synced, server data takes precedence

### Admin UI/UX Patterns
- **Pipeline banner:** Indicador horizontal de pasos en cada página del pipeline, resalta el paso actual
- **Mobile-first responsive:** Sidebar oculto en mobile (toggle hamburger, cierre automático al navegar), tablas con scroll horizontal edge-to-edge (`-mx-4 px-4 sm:mx-0`), grids desde `grid-cols-1`, touch targets 44px, acciones siempre visibles en mobile
- **Collapsible methodology:** Panel cerrado por defecto explicando scoring/detección
- **Paginated tables:** Filtros avanzados + columnas ordenables + selector de filas por página (10/15/25/50, default 15)
- **Advanced filters:** Each admin page has contextual filter dropdowns (alcaldía, tipo, estado, impacto, plazo, tag, role, visibilidad, archivo) with "Limpiar filtros" button via `#filters` slot in AdminDataTable
- **Score breakdown:** Barras de progreso expandibles por fila mostrando componentes del score
- **Column tooltips:** `title` nativo con subrayado punteado en headers
- **TransitionGroup:** Animaciones fade + slide en listas
- **Modal transitions:** `fade` + `scale-in` + `backdrop-blur`
- **Active route indicator:** Sidebar con matching exacto de ruta
- **Welcome greeting:** Saludo personalizado con nombre del admin
- **Empty states:** Iconos contextuales + texto descriptivo + CTAs

### Prospect Approval Flow
```
/registra (formulario publico) → POST /prospectos (source: 'formulario')
                                       ↓
                                  prospectos store (pendiente)
                                       ↓
Detector (OSM + Turf.js)   ────→ POST /detector/submit (source: 'ia_detector')
                                       ↓
                                  /admin/prospectos — cola de aprobacion
                                       ↓
                          Aprobar → humedalesStore.addHumedal() → aparece en /inventario
                          Rechazar → notas de rechazo (prospecto no reaparece)
```
**Datos del prospecto (formulario):** nombre, alcaldia, ubicacion, tipoHumedal, tipoVegetacion, funcionPrincipal, superficie, volumen, anio, sustrato, vegetacion, documentoLink, documentoDescripcion, institucion, email.
**Visualizacion en admin:** grid legible con campos etiquetados (ya no JSON crudo). Badge indica origen: "Formulario publico" o "Detector IA".

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
