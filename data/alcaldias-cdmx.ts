import type { AlcaldiaCDMX } from '~/types'

// ============================================================================
// Inventario de las 16 alcaldías de la Ciudad de México
// Población y superficie: Censo INEGI 2020
// Vulnerabilidad hídrica: estimaciones 1-5 basadas en literatura disponible
// ============================================================================

export const alcaldiasCDMX: AlcaldiaCDMX[] = [
  {
    nombre: 'Álvaro Obregón',
    poblacion: 759137,
    superficie: 96.17,
    densidadPoblacional: 7893,
    zonasInundacion: 3,
    islasCalor: 3,
    disponibilidadAgua: 3,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.3575,
    lng: -99.2332,
  },
  {
    nombre: 'Azcapotzalco',
    poblacion: 400161,
    superficie: 33.66,
    densidadPoblacional: 11889,
    zonasInundacion: 3,
    islasCalor: 4,
    disponibilidadAgua: 3,
    tieneHumedal: true,
    humedalesIds: [13],
    lat: 19.4869,
    lng: -99.1840,
  },
  {
    nombre: 'Benito Juárez',
    poblacion: 434153,
    superficie: 26.63,
    densidadPoblacional: 16305,
    zonasInundacion: 2,
    islasCalor: 4,
    disponibilidadAgua: 2,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.3718,
    lng: -99.1593,
  },
  {
    nombre: 'Coyoacán',
    poblacion: 614447,
    superficie: 54.40,
    densidadPoblacional: 11294,
    zonasInundacion: 3,
    islasCalor: 3,
    disponibilidadAgua: 3,
    tieneHumedal: true,
    humedalesIds: [9, 10],
    lat: 19.3500,
    lng: -99.1617,
  },
  {
    nombre: 'Cuajimalpa',
    poblacion: 217686,
    superficie: 74.58,
    densidadPoblacional: 2919,
    zonasInundacion: 2,
    islasCalor: 1,
    disponibilidadAgua: 2,
    tieneHumedal: true,
    humedalesIds: [12],
    lat: 19.3590,
    lng: -99.3005,
  },
  {
    nombre: 'Cuauhtémoc',
    poblacion: 545884,
    superficie: 32.44,
    densidadPoblacional: 16831,
    zonasInundacion: 3,
    islasCalor: 5,
    disponibilidadAgua: 3,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    nombre: 'Gustavo A. Madero',
    poblacion: 1173351,
    superficie: 94.07,
    densidadPoblacional: 12474,
    zonasInundacion: 4,
    islasCalor: 4,
    disponibilidadAgua: 4,
    tieneHumedal: true,
    humedalesIds: [3, 4, 8, 11],
    lat: 19.4839,
    lng: -99.1130,
  },
  {
    nombre: 'Iztacalco',
    poblacion: 404695,
    superficie: 23.30,
    densidadPoblacional: 17369,
    zonasInundacion: 4,
    islasCalor: 4,
    disponibilidadAgua: 4,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.3953,
    lng: -99.0977,
  },
  {
    nombre: 'Iztapalapa',
    poblacion: 1835486,
    superficie: 117.00,
    densidadPoblacional: 15688,
    zonasInundacion: 5,
    islasCalor: 5,
    disponibilidadAgua: 5,
    tieneHumedal: true,
    humedalesIds: [2, 5],
    lat: 19.3558,
    lng: -99.0630,
  },
  {
    nombre: 'Magdalena Contreras',
    poblacion: 247622,
    superficie: 74.58,
    densidadPoblacional: 3320,
    zonasInundacion: 2,
    islasCalor: 1,
    disponibilidadAgua: 3,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.3225,
    lng: -99.2440,
  },
  {
    nombre: 'Miguel Hidalgo',
    poblacion: 414470,
    superficie: 46.99,
    densidadPoblacional: 8821,
    zonasInundacion: 2,
    islasCalor: 3,
    disponibilidadAgua: 2,
    tieneHumedal: true,
    humedalesIds: [1],
    lat: 19.4320,
    lng: -99.2020,
  },
  {
    nombre: 'Milpa Alta',
    poblacion: 152685,
    superficie: 228.41,
    densidadPoblacional: 669,
    zonasInundacion: 1,
    islasCalor: 1,
    disponibilidadAgua: 4,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.1928,
    lng: -99.0230,
  },
  {
    nombre: 'Tláhuac',
    poblacion: 392313,
    superficie: 85.34,
    densidadPoblacional: 4597,
    zonasInundacion: 4,
    islasCalor: 3,
    disponibilidadAgua: 4,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.2868,
    lng: -99.0048,
  },
  {
    nombre: 'Tlalpan',
    poblacion: 699928,
    superficie: 312.00,
    densidadPoblacional: 2244,
    zonasInundacion: 2,
    islasCalor: 2,
    disponibilidadAgua: 3,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.2964,
    lng: -99.1680,
  },
  {
    nombre: 'Venustiano Carranza',
    poblacion: 443704,
    superficie: 33.42,
    densidadPoblacional: 13276,
    zonasInundacion: 4,
    islasCalor: 4,
    disponibilidadAgua: 4,
    tieneHumedal: false,
    humedalesIds: [],
    lat: 19.4253,
    lng: -99.1070,
  },
  {
    nombre: 'Xochimilco',
    poblacion: 442178,
    superficie: 122.00,
    densidadPoblacional: 3624,
    zonasInundacion: 4,
    islasCalor: 2,
    disponibilidadAgua: 4,
    tieneHumedal: true,
    humedalesIds: [6, 7],
    lat: 19.2620,
    lng: -99.1040,
  },
]

// ============================================================================
// Cálculo del Índice de Necesidad
// Formula: (zonasInundacion * 0.3) + (islasCalor * 0.25)
//        + (disponibilidadAgua * 0.3) + (normalizedDensity * 0.15)
// donde normalizedDensity = (densidadPoblacional / maxDensidad) * 5
// ============================================================================

function computeIndiceNecesidad(alcaldias: AlcaldiaCDMX[]): AlcaldiaCDMX[] {
  const maxDensidad = Math.max(...alcaldias.map((a) => a.densidadPoblacional))

  return alcaldias.map((a) => {
    const normalizedDensity = (a.densidadPoblacional / maxDensidad) * 5
    const indiceNecesidad =
      a.zonasInundacion * 0.3 +
      a.islasCalor * 0.25 +
      a.disponibilidadAgua * 0.3 +
      normalizedDensity * 0.15

    return {
      ...a,
      indiceNecesidad: Math.round(indiceNecesidad * 100) / 100,
    }
  })
}

export const alcaldiasCDMXConIndice: AlcaldiaCDMX[] = computeIndiceNecesidad(alcaldiasCDMX)
