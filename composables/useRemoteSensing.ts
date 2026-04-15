/**
 * Composable para consultar índices espectrales (NDVI, EVI, SAVI, NDWI, LST).
 *
 * Flujo:
 *   1. Llama a cercu-backend: POST /api/v1/observatory/humedales/remote-sensing/indices
 *      (GEE o Sentinel Hub, procesado en el backend)
 *   2. Si el backend no responde, usa datos locales calibrados (data/envi/alcaldias.ts)
 *
 * Uso:
 * ```vue
 * const { indices, serie, loading, error, fuente, fetchIndices } = useRemoteSensing()
 * await fetchIndices({ lat: 19.43, lng: -99.15, alcaldia: 'Xochimilco' })
 * ```
 */

import type { IndicesEspectrales } from '~/types/remote-sensing'
import { rsAlcaldias } from '~/data/envi/alcaldias'

export interface RemoteSensingQuery {
  lat: number
  lng: number
  alcaldia?: string
  radio?: number
  fechaInicio?: string
  fechaFin?: string
}

interface SeriePoint {
  fecha: string
  indices: Record<string, number>
}

type Fuente = 'google_earth_engine' | 'sentinel_hub' | 'datos_locales'

interface RemoteSensingResult {
  fuente: Fuente
  indices: IndicesEspectrales
  serie?: SeriePoint[]
  calidad: {
    confianza: number
    resolucionM: number
    metodo: string
  }
  timestamp: string
}

export function useRemoteSensing() {
  const config = useRuntimeConfig()
  const indices = ref<IndicesEspectrales | null>(null)
  const serie = ref<SeriePoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fuente = ref<Fuente | null>(null)
  const calidad = ref<RemoteSensingResult['calidad'] | null>(null)

  async function fetchIndices(query: RemoteSensingQuery) {
    loading.value = true
    error.value = null

    // 1. Intentar cercu-backend (GEE / Sentinel Hub procesado en el back)
    try {
      const result = await $fetch<RemoteSensingResult>(
        `${config.public.apiBaseUrl}/observatory/humedales/remote-sensing/indices`,
        { method: 'POST', body: query, timeout: 30000 },
      )
      indices.value = result.indices
      serie.value = result.serie || []
      fuente.value = result.fuente
      calidad.value = result.calidad
      loading.value = false
      return
    }
    catch {
      // Backend no disponible — fallback a datos locales
    }

    // 2. Fallback: datos locales calibrados
    try {
      const local = getLocalData(query)
      indices.value = local.indices
      serie.value = local.serie || []
      fuente.value = local.fuente
      calidad.value = local.calidad
    }
    catch (e: any) {
      error.value = e?.message || 'Error al consultar índices espectrales'
      indices.value = null
      serie.value = []
    }
    finally {
      loading.value = false
    }
  }

  const fuenteLabel = computed(() => {
    switch (fuente.value) {
      case 'google_earth_engine': return 'Google Earth Engine (gratis)'
      case 'sentinel_hub': return 'Sentinel Hub (Copernicus)'
      case 'datos_locales': return 'Datos locales (placeholder)'
      default: return 'Sin datos'
    }
  })

  const confianzaColor = computed(() => {
    const c = calidad.value?.confianza ?? 0
    if (c >= 0.85) return 'text-eco'
    if (c >= 0.70) return 'text-accent'
    return 'text-alert'
  })

  return { indices, serie, loading, error, fuente, fuenteLabel, calidad, confianzaColor, fetchIndices }
}

// ── Datos locales (fallback) ─────────────────────────────────────────────────

function getLocalData(query: RemoteSensingQuery): RemoteSensingResult {
  const alcaldia = query.alcaldia || findNearestAlcaldia(query.lat, query.lng)
  const data = rsAlcaldias.find(d => d.alcaldia === alcaldia)

  if (data) {
    return {
      fuente: 'datos_locales',
      indices: data.actual,
      serie: data.serie.observaciones.map(o => ({ fecha: o.fecha, indices: o.indices as any })),
      calidad: {
        confianza: 0.75,
        resolucionM: 10,
        metodo: 'Datos placeholder calibrados (SEDEMA/CONABIO). Configurar GEE en cercu-backend para mayor precisión.',
      },
      timestamp: new Date().toISOString(),
    }
  }

  return {
    fuente: 'datos_locales',
    indices: { ndvi: 0, evi: 0, savi: 0, ndwi: 0, lst: 0 },
    calidad: { confianza: 0, resolucionM: 0, metodo: 'Sin datos disponibles' },
    timestamp: new Date().toISOString(),
  }
}

function findNearestAlcaldia(lat: number, lng: number): string {
  const centroids: Record<string, [number, number]> = {
    'Álvaro Obregón': [19.3577, -99.2260], 'Azcapotzalco': [19.4869, -99.1838],
    'Benito Juárez': [19.3724, -99.1614], 'Coyoacán': [19.3500, -99.1620],
    'Cuajimalpa': [19.3590, -99.2910], 'Cuauhtémoc': [19.4285, -99.1507],
    'Gustavo A. Madero': [19.4748, -99.1133], 'Iztacalco': [19.3952, -99.0975],
    'Iztapalapa': [19.3558, -99.0520], 'Magdalena Contreras': [19.3200, -99.2440],
    'Miguel Hidalgo': [19.4145, -99.1935], 'Milpa Alta': [19.1926, -99.0231],
    'Tláhuac': [19.2869, -99.0048], 'Tlalpan': [19.2965, -99.1680],
    'Venustiano Carranza': [19.4253, -99.1075], 'Xochimilco': [19.2618, -99.1040],
  }
  let nearest = 'Cuauhtémoc'
  let minDist = Infinity
  for (const [name, [clat, clng]] of Object.entries(centroids)) {
    const d = (lat - clat) ** 2 + (lng - clng) ** 2
    if (d < minDist) { minDist = d; nearest = name }
  }
  return nearest
}
