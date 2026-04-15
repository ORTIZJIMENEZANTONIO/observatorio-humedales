// ============================================================================
// Observatorio de Humedales Artificiales CDMX — Remote Sensing Types
// ============================================================================
//
// Pipeline: Sentinel-2 / Landsat → GEE / Sentinel Hub → JSON → Plataforma
//
// Uso específico para humedales:
// - NDVI/EVI/SAVI: vegetación en y alrededor de los humedales
// - NDWI: detección de cuerpos de agua, monitoreo de niveles
// - LST: efecto de humedales en reducción de isla de calor
// ============================================================================

import type { Alcaldia } from './index'

// ---------------------------------------------------------------------------
// Índices espectrales
// ---------------------------------------------------------------------------

export interface IndicesEspectrales {
  ndvi: number   // Normalized Difference Vegetation Index (-1 a 1)
  evi: number    // Enhanced Vegetation Index (-1 a 1)
  savi: number   // Soil Adjusted Vegetation Index (-1 a 1)
  ndwi: number   // Normalized Difference Water Index (-1 a 1, clave para humedales)
  lst: number    // Land Surface Temperature (°C)
}

// ---------------------------------------------------------------------------
// Serie temporal
// ---------------------------------------------------------------------------

export interface ObservacionTemporal {
  fecha: string
  satelite: 'sentinel-2' | 'landsat-8' | 'landsat-9'
  nubosidad: number
  indices: IndicesEspectrales
}

export interface SerieTemporal {
  observaciones: ObservacionTemporal[]
  estadisticas: {
    inicio: string
    fin: string
    totalObservaciones: number
    intervaloPromedioDias: number
  }
}

// ---------------------------------------------------------------------------
// Datos por alcaldía
// ---------------------------------------------------------------------------

export interface EstadisticaIndice {
  media: number
  mediana: number
  desviacionEstandar: number
  min: number
  max: number
  tendencia: number
  r2Tendencia: number
}

export interface CalidadDatos {
  porcentajePixelesValidos: number
  resolucionEspacialM: number
  sistemaCoordenadasEPSG: number
  metodoAtmosferico: 'L2A_Sen2Cor' | 'FLAASH' | 'QUAC' | 'DOS' | 'ninguno'
  metodoLST: 'split_window' | 'single_channel' | 'radiative_transfer' | 'mono_window'
}

export interface RSAlcaldiaData {
  alcaldia: Alcaldia
  fechaProcesamiento: string
  actual: IndicesEspectrales
  historico: {
    ndvi: EstadisticaIndice
    evi: EstadisticaIndice
    savi: EstadisticaIndice
    ndwi: EstadisticaIndice
    lst: EstadisticaIndice
  }
  serie: SerieTemporal
  calidad: CalidadDatos
}

// ---------------------------------------------------------------------------
// Datos por humedal individual
// ---------------------------------------------------------------------------

export interface RSHumedalData {
  humedalId: number
  centroide: { lat: number; lng: number }
  areaPixelesM2: number
  actual: IndicesEspectrales
  serie: SerieTemporal
  diferencialVsAlcaldia: IndicesEspectrales
  calidad: CalidadDatos
}
