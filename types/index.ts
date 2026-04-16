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

// Clasificación técnica de humedales artificiales por sistema de flujo
// FWS = Free Water Surface (agua visible sobre el sustrato)
// SFS = Subsurface Flow (agua fluye a través del sustrato)
export type TipoHumedal =
  | 'ha_fws'                  // HA de flujo superficial (FWS) — agua visible
  | 'ha_sfs_horizontal'       // HA de flujo subsuperficial horizontal (HSSF)
  | 'ha_sfs_vertical'         // HA de flujo subsuperficial vertical (VSSF)
  | 'ha_hibrido'              // HA híbrido (FWS + SFS en serie)

export type EstadoHumedal = 'activo' | 'en_construccion' | 'en_expansion' | 'piloto'

export type TipoVegetacion =
  | 'flotante'
  | 'emergente'
  | 'sumergida'

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
  | 'reduccion_lst'

export interface Humedal {
  id: number
  nombre: string
  alcaldia: Alcaldia
  ubicacion: string
  tipoHumedal: TipoHumedal
  tipoVegetacion?: TipoVegetacion[]
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
  fuente?: string
  fuenteImagen?: string
}

// ── Notihumedal (Blog) ──
export interface ArticuloNotihumedal {
  id: number
  slug: string
  titulo: string
  fecha: string
  resumen: string
  contenido: string
  imagen?: string
  fuenteImagen?: string
  autor: string
  tags: string[]
}

// ── Prospectos de noticias (scraping pipeline) ──
export type EstadoProspectoNoticia = 'pendiente' | 'aprobado' | 'rechazado'

export interface ProspectoNoticia {
  id: number
  titulo: string
  resumen: string
  url: string
  fuente: string
  fecha: string
  fechaScraping: string
  estado: EstadoProspectoNoticia
  notasRechazo?: string
}

// ── Admin roles & permissions ──
export type AdminRole = 'superadmin' | 'admin' | 'editor'

export type AdminPermission =
  | 'manage_users'
  | 'manage_cms'
  | 'manage_humedales'
  | 'manage_hallazgos'
  | 'manage_notihumedal'
  | 'manage_prospectos'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  permissions: AdminPermission[]
  createdAt?: string
  lastLogin?: string
}

// ── Registro de humedales ──
export type EstadoRegistro = 'borrador' | 'enviado' | 'aprobado' | 'rechazado'

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
  costoRango?: [number, number]
  eficiencia: string
  ventajas: string[]
  desventajas: string[]
  fuente: string
}
