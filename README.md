<p align="center">
  <img src="public/images/logo-ipn.svg" alt="IPN" height="80" />
  &nbsp;&nbsp;&nbsp;
  <img src="public/images/logo-ciiemad.png" alt="CIIEMAD" height="80" />
</p>

<h1 align="center">Observatorio de Humedales Artificiales CDMX</h1>

<p align="center">
  Plataforma digital de monitoreo, inventario y an&aacute;lisis de humedales artificiales<br/>
  en la Ciudad de M&eacute;xico
</p>

<p align="center">
  <a href="#-sobre-el-proyecto">Sobre</a>&nbsp;&middot;&nbsp;
  <a href="#-inventario">Inventario</a>&nbsp;&middot;&nbsp;
  <a href="#%EF%B8%8F-stack-tecnol%C3%B3gico">Stack</a>&nbsp;&middot;&nbsp;
  <a href="#-inicio-r%C3%A1pido">Inicio r&aacute;pido</a>&nbsp;&middot;&nbsp;
  <a href="#-despliegue">Despliegue</a>&nbsp;&middot;&nbsp;
  <a href="#-cr%C3%A9ditos">Cr&eacute;ditos</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt_3-00DC82?style=flat-square&logo=nuxtdotjs&logoColor=white" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js" />
</p>

---

## Sobre el proyecto

El **Observatorio de Humedales Artificiales CDMX** sistematiza informacion geoespacial, caracteristicas tecnicas (vegetacion, sustrato, volumen), servicios ecosistemicos y tipologias de **7 humedales artificiales** identificados en **5 alcaldias** de la Ciudad de Mexico.

Basado en el **Inventario de Humedales Artificiales en la Ciudad de Mexico, Fase 1**, elaborado por M. en C. Diego Dominguez Solis del **CIIEMAD -- Instituto Politecnico Nacional**.

### Paginas

| Ruta | Descripcion |
|------|-------------|
| `/` | Inicio -- hero, KPIs, tipologias, servicios ecosistemicos |
| `/mapa` | Mapa interactivo Leaflet con los 7 humedales geolocalizados |
| `/inventario` | Inventario con busqueda, filtros y drawer de detalle |
| `/indicadores` | Dashboard con 4 tabs: Distribucion, Servicios, Comparativo, Evidencia Cientifica |
| `/metodologia` | Criterios de sistematizacion, respaldo cientifico, normativa, fuentes |
| `/sobre` | Acerca del proyecto y objetivos |

---

## Inventario

| # | Nombre | Alcaldia | Tipo | Superficie | Ano |
|---|--------|----------|------|------------|-----|
| 1 | Humedal Anfibium | Miguel Hidalgo | Conservacion | 1,200 m2 | 2023 |
| 2 | Parque Ecologico Cuitlahuac | Iztapalapa | Tratamiento | 8,795 m2 | 2021-2023 |
| 3 | Bosque San Juan de Aragon | Gustavo A. Madero | Tratamiento | -- | 2020 |
| 4 | Playa de Aves | Gustavo A. Madero | Recreativo | 1,100 m2 | 2021 |
| 5 | Cerro de la Estrella | Iztapalapa | Captacion pluvial | -- | 2022 |
| 6 | Vivero San Luis Tlaxialtemalco | Xochimilco | Conservacion | 48,900 m2 | 2023 |
| 7 | Bajo Puente Cuemanco | Xochimilco | Restauracion | -- | 2023 |

### Tipologias identificadas

- **Tratamiento de aguas residuales** -- Aragon, Cuitlahuac
- **Conservacion y biodiversidad** -- Anfibium, Vivero San Luis Tlaxialtemalco
- **Regulacion hidrologica urbana** -- Cuemanco, Cerro de la Estrella

### Servicios ecosistemicos predominantes

1. Regulacion hidrica (depuracion, filtracion, recarga)
2. Captura de carbono (vegetacion acuatica)
3. Habitat para fauna (aves migratorias, ajolotes, fauna nativa)
4. Educacion ambiental (espacios de aprendizaje)

---

## Stack tecnologico

| Capa | Tecnologia |
|------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) + [Vue 3](https://vuejs.org) (Composition API, `<script setup lang="ts">`) |
| Estado | [Pinia](https://pinia.vuejs.org) (composable style) |
| Estilos | [Tailwind CSS 3](https://tailwindcss.com) + design system personalizado |
| Mapas | [Leaflet](https://leafletjs.com) (componente `.client.vue` + `<ClientOnly>`) |
| Graficas | [Chart.js](https://www.chartjs.org) + [vue-chartjs](https://vue-chartjs.org) |
| Utilidades | [VueUse](https://vueuse.org), [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) |
| Tipado | TypeScript strict |

---

## Inicio rapido

### Prerrequisitos

- [Node.js](https://nodejs.org) >= 18
- npm >= 9

### Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/ORTIZJIMENEZANTONIO/observatorio-humedales.git
cd observatorio-humedales

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

### Comandos disponibles

```bash
npm run dev        # Servidor de desarrollo (HMR)
npm run build      # Build de produccion
npm run generate   # Generacion estatica
npm run preview    # Preview del build de produccion
```

---

## Despliegue

El proyecto se despliega en **humedales.cercu.com.mx** usando:

| Componente | Detalle |
|-----------|---------|
| Servidor | VPS Alpine Linux |
| Proceso | PM2 -- app `humedales`, puerto `3005` |
| Proxy | Nginx reverse proxy |
| SSL | Let's Encrypt (certbot) |

### Deploy rapido

```bash
# Desde tu maquina local
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git \
  . usuario@servidor:/var/www/cercu-frontend/humedales/

# En el servidor
cd /var/www/cercu-frontend/humedales
npm install
npm run build
pm2 restart humedales
```

Consulta [`deploy/DEPLOY.md`](deploy/DEPLOY.md) para la guia completa de primer despliegue.

---

## Estructura del proyecto

```
observatorio-humedales/
  assets/css/main.css         # Estilos globales, animaciones, Leaflet
  components/
    common/                   # AppHeader, AppFooter, SectionTitle
    charts/                   # DoughnutChart, BarChart (.client.vue)
    map/                      # MapPanel (.client.vue)
  composables/                # useFormatters, useMapConfig, useScrollReveal
  data/
    mock-humedales.ts         # 7 registros de humedales
    kpis.ts                   # Datos KPI del dashboard
  deploy/                     # PM2, Nginx, guia de despliegue
  layouts/default.vue         # Header + contenido + Footer
  pages/                      # 6 paginas
  public/images/              # Logos institucionales + fotos de humedales
  stores/humedales.ts         # Pinia store con filtros reactivos
  types/index.ts              # Tipos TypeScript
```

---

## Evidencia cientifica

La tecnologia de humedales artificiales en Mexico cuenta con mas de **30 anos de investigacion academica**:

| Institucion | Contribucion principal |
|-------------|----------------------|
| **IPN / CIIEMAD** | Inventario Fase 1, lineas de investigacion en calidad del agua, regeneracion Lago de Aragon |
| **UNAM / GAIA** | Sistemas SHATTO, Bosque de Aragon (~1 ha, 250 m3/d), 2 patentes, 80% remocion general |
| **UAM** | Xochimilco -- *S. americanus*, *L. gibba*, planta piloto HAFC-CIBAC (unica mundial) |
| **UACh** | Humedal Santiaguito, Texcoco -- 100% coliformes, 98.5% solidos sedimentables |

### Eficiencias documentadas

| Parametro | Eficiencia | Fuente |
|-----------|-----------|--------|
| DQO | 95.7% | Romero-Aguilar et al. (2009) |
| DQO | 80% | GAIA-UNAM, Aragon (2014) |
| N amoniacal | 86.4% | Martinez-Cruz et al. (2006) |
| Coliformes fecales | >90% | GAIA-UNAM, Aragon |
| Coliformes | 100% | UACh, Texcoco |

---

## Fuentes de datos

### Investigacion academica

- Dominguez Solis, D. (2024). *Inventario de humedales artificiales en la Ciudad de Mexico, Fase 1*. **CIIEMAD-IPN.**
- Luna-Pabello, V.M. y Aburto-Castaneda, S. (2014). *TIP Rev. Esp. Ciencias Quimico-Biologicas*, 17(1). **UNAM-GAIA.**
- Martinez-Cruz, P. et al. (2006). *Hidrobiologica*, 16(3), 211-219. **UAM-Iztapalapa.**
- Romero-Aguilar, M. et al. (2009). *Rev. Int. Contam. Ambie.*, 25(3). **UAEMor / UAEMex.**

### Fuentes oficiales

- SEDEMA (2024) -- 34 humedales creados/recuperados, 26.2 ha
- CONABIO -- SIMOH-Mx, humedales capturan 10x mas CO2 que selvas
- CONAGUA -- Inventario Nacional de Humedales
- NOM-001-SEMARNAT-2021 / NOM-003-SEMARNAT-1997
- Convencion Ramsar -- Xochimilco (2,657 ha)

---

## Creditos

| Rol | Nombre / Institucion |
|-----|---------------------|
| Inventario Fase 1 | M. en C. Diego Dominguez Solis |
| Institucion | CIIEMAD -- Instituto Politecnico Nacional |
| Desarrollo | Observatorio de Humedales Artificiales CDMX |

### Imagenes

Las fotografias del inventario provienen de [Unsplash](https://unsplash.com) bajo la [Licencia Unsplash](https://unsplash.com/license) (uso libre, sin atribucion requerida).

---

<p align="center">
  <sub>Hecho con Vue, Nuxt y datos abiertos para la Ciudad de Mexico</sub>
</p>
