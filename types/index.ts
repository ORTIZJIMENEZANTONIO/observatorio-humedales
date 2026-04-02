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
