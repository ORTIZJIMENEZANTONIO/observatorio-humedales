/**
 * Datos de percepción remota por alcaldía — estadísticas zonales.
 *
 * PLACEHOLDER calibrado con datos SEDEMA/CONABIO/Atlas de Riesgos.
 * Será reemplazado por datos reales de GEE o Sentinel Hub.
 *
 * Nota para humedales: NDWI es especialmente relevante — valores positivos
 * indican presencia de agua superficial. Las alcaldías con humedales
 * (Xochimilco, Tláhuac, GAM, Coyoacán, Tlalpan) tienen NDWI más alto.
 */

import type { RSAlcaldiaData } from '~/types/remote-sensing'

function generarSerie(baseValues: Record<string, number>, fechaInicio: string, fechaFin: string) {
  const obs = []
  const start = new Date(fechaInicio)
  const end = new Date(fechaFin)
  const current = new Date(start)

  while (current <= end) {
    const mes = current.getMonth()
    const esLluvias = mes >= 5 && mes <= 9
    const factorNDVI = esLluvias ? 1.12 : 0.88
    const factorLST = esLluvias ? 0.92 : 1.08
    const factorNDWI = esLluvias ? 1.20 : 0.80 // NDWI más sensible a lluvias

    obs.push({
      fecha: current.toISOString().split('T')[0],
      satelite: 'sentinel-2' as const,
      nubosidad: esLluvias ? 35 + Math.random() * 30 : 5 + Math.random() * 15,
      indices: {
        ndvi: +(baseValues.ndvi * factorNDVI * (0.95 + Math.random() * 0.1)).toFixed(4),
        evi: +(baseValues.evi * factorNDVI * (0.95 + Math.random() * 0.1)).toFixed(4),
        savi: +(baseValues.savi * factorNDVI * (0.95 + Math.random() * 0.1)).toFixed(4),
        ndwi: +(baseValues.ndwi * factorNDWI * (0.90 + Math.random() * 0.2)).toFixed(4),
        lst: +(baseValues.lst * factorLST * (0.97 + Math.random() * 0.06)).toFixed(1),
      },
    })
    current.setMonth(current.getMonth() + 1)
  }
  return obs
}

function calcEstadistica(valores: number[]) {
  const sorted = [...valores].sort((a, b) => a - b)
  const n = sorted.length
  const mean = valores.reduce((s, v) => s + v, 0) / n
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
  const stdDev = Math.sqrt(valores.reduce((s, v) => s + (v - mean) ** 2, 0) / n)
  const xs = valores.map((_, i) => i / 12)
  const meanX = xs.reduce((s, x) => s + x, 0) / n
  const num = xs.reduce((s, x, i) => s + (x - meanX) * (valores[i] - mean), 0)
  const den = xs.reduce((s, x) => s + (x - meanX) ** 2, 0)
  const slope = den === 0 ? 0 : num / den
  const ssTot = valores.reduce((s, v) => s + (v - mean) ** 2, 0)
  const ssRes = valores.reduce((s, v, i) => s + (v - (mean + slope * (xs[i] - meanX))) ** 2, 0)
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot
  return { media: +mean.toFixed(4), mediana: +median.toFixed(4), desviacionEstandar: +stdDev.toFixed(4), min: sorted[0], max: sorted[n - 1], tendencia: +slope.toFixed(4), r2Tendencia: +r2.toFixed(4) }
}

function buildAlcaldiaData(alcaldia: string, base: Record<string, number>): RSAlcaldiaData {
  const serie = generarSerie(base, '2019-01-15', '2025-06-15')
  const ultimo = serie[serie.length - 1].indices
  return {
    alcaldia: alcaldia as any,
    fechaProcesamiento: '2025-06-20',
    actual: ultimo,
    historico: {
      ndvi: calcEstadistica(serie.map(o => o.indices.ndvi)),
      evi: calcEstadistica(serie.map(o => o.indices.evi)),
      savi: calcEstadistica(serie.map(o => o.indices.savi)),
      ndwi: calcEstadistica(serie.map(o => o.indices.ndwi)),
      lst: calcEstadistica(serie.map(o => o.indices.lst)),
    },
    serie: {
      observaciones: serie,
      estadisticas: { inicio: serie[0].fecha, fin: serie[serie.length - 1].fecha, totalObservaciones: serie.length, intervaloPromedioDias: 30 },
    },
    calidad: { porcentajePixelesValidos: 92, resolucionEspacialM: 10, sistemaCoordenadasEPSG: 32614, metodoAtmosferico: 'L2A_Sen2Cor', metodoLST: 'single_channel' },
  }
}

// Valores base calibrados — alcaldías CON humedales tienen NDWI más alto
const baseData: Record<string, Record<string, number>> = {
  'Álvaro Obregón':      { ndvi: 0.28, evi: 0.22, savi: 0.25, ndwi: -0.15, lst: 34.2 },
  'Azcapotzalco':        { ndvi: 0.12, evi: 0.09, savi: 0.10, ndwi: -0.28, lst: 37.8 },
  'Benito Juárez':       { ndvi: 0.14, evi: 0.11, savi: 0.12, ndwi: -0.25, lst: 36.5 },
  'Coyoacán':            { ndvi: 0.32, evi: 0.26, savi: 0.29, ndwi: -0.05, lst: 33.1 }, // tiene humedal
  'Cuajimalpa':          { ndvi: 0.52, evi: 0.42, savi: 0.46, ndwi: -0.02, lst: 28.4 },
  'Cuauhtémoc':          { ndvi: 0.08, evi: 0.06, savi: 0.07, ndwi: -0.32, lst: 39.1 },
  'Gustavo A. Madero':   { ndvi: 0.20, evi: 0.16, savi: 0.18, ndwi: 0.02, lst: 35.5 }, // tiene humedal (Aragón)
  'Iztacalco':           { ndvi: 0.10, evi: 0.08, savi: 0.09, ndwi: -0.30, lst: 38.2 },
  'Iztapalapa':          { ndvi: 0.11, evi: 0.08, savi: 0.09, ndwi: -0.29, lst: 38.5 },
  'Magdalena Contreras':  { ndvi: 0.48, evi: 0.38, savi: 0.42, ndwi: -0.05, lst: 29.2 },
  'Miguel Hidalgo':      { ndvi: 0.22, evi: 0.17, savi: 0.19, ndwi: -0.18, lst: 35.4 },
  'Milpa Alta':          { ndvi: 0.58, evi: 0.47, savi: 0.52, ndwi: 0.02, lst: 26.8 },
  'Tláhuac':             { ndvi: 0.28, evi: 0.22, savi: 0.25, ndwi: 0.08, lst: 33.5 }, // tiene humedal
  'Tlalpan':             { ndvi: 0.45, evi: 0.36, savi: 0.40, ndwi: 0.01, lst: 30.1 }, // tiene humedal
  'Venustiano Carranza':  { ndvi: 0.09, evi: 0.07, savi: 0.08, ndwi: -0.31, lst: 38.8 },
  'Xochimilco':          { ndvi: 0.40, evi: 0.32, savi: 0.36, ndwi: 0.12, lst: 30.8 }, // tiene humedal (chinampa)
}

export const rsAlcaldias: RSAlcaldiaData[] = Object.entries(baseData)
  .map(([alc, base]) => buildAlcaldiaData(alc, base))
