// ============================================================================
// Observatorio de Humedales Artificiales CDMX - TypeScript Type Definitions
// ============================================================================

export type Alcaldia =
  | 'Álvaro Obregón'
  | 'Azcapotzalco'
  | 'Benito Juárez'
  | 'Coyoacán'
  | 'Cuajimalpa'
  | 'Cuauhtémoc'
  | 'Gustavo A. Madero'
  | 'Iztacalco'
  | 'Iztapalapa'
  | 'Magdalena Contreras'
  | 'Miguel Hidalgo'
  | 'Milpa Alta'
  | 'Tláhuac'
  | 'Tlalpan'
  | 'Venustiano Carranza'
  | 'Xochimilco'

export type TipoHumedal =
  | 'conservacion'
  | 'tratamiento_aguas'
  | 'recreativo'
  | 'captacion_pluvial'
  | 'restauracion_hidrologica'

export type EstadoHumedal = 'activo' | 'en_construccion' | 'en_expansion' | 'piloto'

export type ServicioEcosistemico =
  | 'depuracion_agua'
  | 'habitat_fauna'
  | 'educacion_ambiental'
  | 'captura_carbono'
  | 'regulacion_termica'
  | 'control_inundaciones'
  | 'recarga_acuiferos'
  | 'banco_germoplasma'
  | 'recreacion'

export interface Humedal {
  id: number
  nombre: string
  alcaldia: Alcaldia
  ubicacion: string
  tipoHumedal: TipoHumedal
  funcionPrincipal: string
  superficie?: number
  volumen?: number
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

export interface KPI {
  label: string
  valor: string
  unidad?: string
  color: string
  cambio?: string
}

// ── Brecha de Cobertura ──
export interface AlcaldiaCDMX {
  nombre: Alcaldia
  poblacion: number
  superficie: number            // km²
  densidadPoblacional: number   // hab/km²
  zonasInundacion: number       // 1-5
  islasCalor: number            // 1-5
  disponibilidadAgua: number    // 1-5 (5 = más escasa)
  tieneHumedal: boolean
  humedalesIds: number[]
  lat: number
  lng: number
  indiceNecesidad?: number
}

// ── Alineación ODS ──
export type ODS = 'ods_6' | 'ods_11' | 'ods_13' | 'ods_15'

export interface ODSGoal {
  id: ODS
  numero: number
  nombre: string
  descripcion: string
  color: string
  contribucionGeneral: string
  metasEspecificas: string[]
  humedalesRelacionados: number[]
  indicadores: string[]
}

// ── Hallazgos y Recomendaciones ──
export interface Recomendacion {
  titulo: string
  descripcion: string
  acciones: string[]
  responsables: string[]
  plazo: 'corto' | 'mediano' | 'largo'
  costoEstimado?: string
}

export interface Hallazgo {
  id: number
  titulo: string
  descripcion: string
  evidencia: string[]
  impacto: 'alto' | 'medio' | 'critico'
  recomendacion: Recomendacion
}

export interface ComparativoCostos {
  metodo: string
  costoM3: string
  eficiencia: string
  ventajas: string[]
  desventajas: string[]
}
