// Glosario centralizado del admin de humedales. Cada entrada es una definición
// corta (≤180 chars) en lenguaje accesible para editores sin background técnico.
//
// Uso:
//   <AdminInfoTooltip :text="GLOSSARY.haFws">HA-FWS</AdminInfoTooltip>

export const GLOSSARY = {
  // ── Tipologías de humedal artificial ──
  ha: 'Humedal Artificial: ecosistema diseñado por humanos que reproduce las funciones de un humedal natural — depuración de agua, hábitat, captura de carbono.',
  haFws:
    'HA de Flujo Superficial (Free Water Surface): el agua corre visiblemente sobre el sustrato. Imita un humedal natural; ideal para conservación y tratamiento secundario.',
  haSfs:
    'HA de Flujo Subsuperficial: el agua circula por dentro del sustrato (grava, tezontle, arena) sin verse en la superficie. Más eficiente en remover contaminantes.',
  haHibrido:
    'HA Híbrido (FWS + SFS): combina módulos de flujo superficial y subsuperficial en serie para maximizar la remoción de nutrientes y patógenos.',
  haHssf:
    'HA de Flujo Subsuperficial Horizontal: el agua entra por un extremo y sale por el opuesto, atravesando el sustrato. Subtipo de SFS.',
  haVssf:
    'HA de Flujo Subsuperficial Vertical: el agua se aplica por arriba y percola hacia abajo. Subtipo de SFS, mejor para nitrificación.',

  // ── Servicios ecosistémicos ──
  servicioEcosistemico:
    'Beneficio ambiental que aporta el humedal: tratamiento de agua, hábitat para fauna, captura de carbono, regulación térmica, control de inundaciones, educación.',
  depuracionAgua:
    'Capacidad del humedal de remover contaminantes (sólidos, materia orgánica, nutrientes, patógenos) usando procesos físicos, químicos y biológicos.',

  // ── Hallazgos y validación ──
  hallazgo:
    'Recomendación o problema detectado en el inventario fase 1 (Domínguez-Solís 2025, CIIEMAD-IPN). Se publica con sustento técnico y normativo.',
  estadoHumedal:
    'Estatus operativo: activo (funcionando), mantenimiento (intervención en curso), inactivo (fuera de servicio), histórico (referencia documental).',

  // ── Detector + prospectos ──
  prospecto:
    'Sitio candidato a humedal artificial detectado automáticamente vía OSM (cuerpos de agua, parques, plantas de tratamiento). Pendiente de validación humana.',
  detectorOsm:
    'Pipeline que consulta OpenStreetMap (nodos water/wetland/waterway/wastewater_plant) y lo mete a la cola de prospectos para revisión.',
  notasRechazo:
    'Motivo documentado por el revisor cuando descarta un prospecto (no es humedal artificial, ya está en el inventario, ubicación errónea, etc.).',

  // ── CMS / contenido editorial ──
  cms:
    'Sistema para editar copy del sitio público (home, sobre, análisis) sin tocar código. Cada cambio se publica al guardar y aparece en la página.',
  pageSlug:
    'Identificador estable de una página en el CMS (home, sobre, analisis…). Se usa en la URL del editor.',
  sectionKey:
    'Identificador estable de una sección dentro de una página (features, steps, tipologias…). Junto con el pageSlug determina qué bloque editas.',
  cmsItem:
    'Cada bloque editable de una sección. Algunas secciones tienen un solo bloque (hero), otras una lista (features tiene 3, criterios tiene 6, etc.).',

  // ── Notihumedal / scraper ──
  notihumedal:
    'Artículo editorial publicado en /notihumedal del sitio público. Puede ser nota propia o aprobada desde la cola de prospectos del scraper.',
  prospectoNoticia:
    'Artículo candidato extraído por el scraper de Mongabay México que aún no es público. El admin lo aprueba o rechaza desde /admin/notihumedal.',
  scraperMongabay:
    'Bot que lee https://es.mongabay.com/list/mexico/ filtra por keywords (humedal, manglar, laguna, ramsar…) y mete novedades a la cola de prospectos.',
  urlHash:
    'SHA-256 de la URL normalizada del artículo. Garantiza que re-correr el scraper no inserta duplicados.',

  // ── Geometría / mapa ──
  alcaldia:
    'Demarcación territorial de la CDMX (16 alcaldías). El inventario clasifica cada humedal por la alcaldía donde se ubica.',
  brechaCobertura:
    'Análisis de qué alcaldías tienen pocos humedales artificiales relativos a su población o necesidad. Alimenta priorización de nuevos sitios.',
  indice:
    'Indicador agregado calculado a partir del inventario (cobertura por alcaldía, distribución por tipología, servicios ecosistémicos cumplidos).',

  // ── Marco normativo ──
  ods:
    'Objetivos de Desarrollo Sostenible (ONU). Los humedales artificiales aportan a ODS 6 (agua limpia), 11 (ciudades sostenibles) y 15 (vida terrestre).',
  nom001:
    'NOM-001-SEMARNAT-2021 — norma mexicana que establece límites permisibles de contaminantes en descargas de aguas residuales.',

  // ── Identidad de datos ──
  slug:
    'Identificador URL-friendly único (sólo a-z, 0-9, guiones). Inmutable tras crear — referenciado por otros registros y por las rutas públicas.',
  visible:
    'Si está apagado, el registro NO aparece en el sitio público pero sigue editable desde admin (útil para borradores).',
  archived:
    'Soft-delete: el registro queda invisible y no se cuenta en KPIs públicos, pero sigue en BD para auditoría. Preferir archivar antes que borrar.',
  trackingEvent:
    'Visita o click registrado de forma anónima (sesión local, sin PII). Alimenta la pestaña Interacciones de /admin/analytics.',
} as const

export type GlossaryKey = keyof typeof GLOSSARY
