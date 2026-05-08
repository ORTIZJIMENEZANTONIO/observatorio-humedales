// Catálogo de contenido editable desde /admin/contenido. Cada página agrupa
// secciones; cada sección es un array de items (uno o varios). Las páginas
// públicas leen via useCmsContent() y caen a estos defaults si el backend no
// responde. Cualquier persona del equipo puede editar copys, listas y enlaces
// sin tocar código.
export const cmsDefaults: Record<string, Record<string, any[]>> = {
  home: {
    features: [
      { title: 'Inventario geoespacial', description: 'Localización y caracterización de humedales artificiales en la Ciudad de México, con datos de ubicación, superficie y vegetación.', to: '/inventario', bg: 'bg-primary-50', iconColor: 'text-primary', icon: 'lucide:map-pin' },
      { title: 'Servicios ecosistémicos', description: 'Análisis de los beneficios ambientales: tratamiento de agua, hábitat para fauna, captura de carbono y regulación térmica.', to: '/analisis/indicadores', bg: 'bg-eco/10', iconColor: 'text-eco', icon: 'lucide:droplets' },
      { title: 'Metodología científica', description: 'Sistematización basada en criterios técnicos: clasificación del humedal artificial por sistema de flujo (FWS, SFS), vegetación, sustrato y uso del agua tratada.', to: '/sobre#metodologia', bg: 'bg-secondary/10', iconColor: 'text-secondary', icon: 'lucide:microscope' },
    ],
    steps: [
      { title: 'Identificación', description: 'Localización de humedales artificiales existentes en la CDMX mediante fuentes oficiales, académicas y de trabajo de campo.' },
      { title: 'Caracterización', description: 'Documentación de tipo, vegetación, sustrato, superficie y capacidad de tratamiento.' },
      { title: 'Análisis', description: 'Evaluación de servicios ecosistémicos y comparación entre tipologías de humedales.' },
      { title: 'Visualización', description: 'Presentación interactiva en mapas y gráficas para tomadores de decisiones.' },
    ],
    tipologias: [
      { title: 'HA flujo superficial (FWS)', description: 'El agua fluye visiblemente sobre el sustrato, similar a un humedal natural. Usado para conservación, hábitat y tratamiento secundario.', examples: 'Anfibium, Playa de Aves, Vivero Tlaxialtemalco, Cerro de la Estrella', badge: 'FWS', badgeClass: 'badge-secondary' },
      { title: 'HA flujo subsuperficial (SFS)', description: 'El agua fluye a través del sustrato (grava, arena, tezontle) sin ser visible en la superficie. Mayor eficiencia en remoción de contaminantes.', examples: 'Parque Ecológico Cuitláhuac, Segundo Aragón, Bajo Puente Cuemanco', badge: 'HSSF', badgeClass: 'badge-primary' },
      { title: 'HA híbrido (FWS + SFS)', description: 'Combina módulos de flujo superficial y subsuperficial en serie para maximizar la remoción de contaminantes.', examples: 'Aragón STHA (HAFSS + HAFS)', badge: 'Híbrido', badgeClass: 'badge-eco' },
    ],
    servicios: [
      { title: 'Tratamiento de agua', icon: 'lucide:droplets' },
      { title: 'Hábitat para fauna', icon: 'lucide:bird' },
      { title: 'Captura de carbono', icon: 'lucide:leaf' },
      { title: 'Regulación térmica', icon: 'lucide:thermometer' },
      { title: 'Control de inundaciones', icon: 'lucide:waves' },
      { title: 'Educación ambiental', icon: 'lucide:book-open' },
    ],
  },
  sobre: {
    objetivos: [
      { title: 'Sistematizar', description: 'Organizar la información dispersa sobre humedales artificiales en la CDMX en un repositorio accesible.', icon: '📋' },
      { title: 'Visualizar', description: 'Mostrar la distribución geoespacial y características técnicas de cada humedal en mapas interactivos.', icon: '🗺️' },
      { title: 'Analizar', description: 'Evaluar los servicios ecosistémicos y su contribución a la sustentabilidad urbana de la ciudad.', icon: '📊' },
    ],
    criterios: [
      { title: 'Ubicación y año', description: 'Coordenadas geográficas y año de implementación de cada humedal.', icon: '📍' },
      { title: 'Tipo de humedal artificial', description: 'Clasificación por sistema de flujo: HA de flujo superficial (FWS), HA de flujo subsuperficial horizontal (HSSF) o vertical (VSSF), y sistemas híbridos (FWS + SFS).', icon: '🏷️' },
      { title: 'Características técnicas', description: 'Vegetación utilizada, tipo de sustrato, volumen o superficie documentada.', icon: '🔬' },
      { title: 'Uso del agua tratada', description: 'Destino del agua procesada: riego, recirculación, infiltración o mantenimiento.', icon: '💧' },
      { title: 'Servicios ecosistémicos', description: 'Beneficios ambientales documentados: depuración, hábitat, captura de carbono, etc.', icon: '🌿' },
      { title: 'Resultados o monitoreo', description: 'Datos cuantitativos o cualitativos disponibles sobre el desempeño del humedal.', icon: '📊' },
    ],
    normativas: [
      { title: 'Ley de Aguas de la CDMX', description: 'Marco regulatorio para el manejo integral del agua en la Ciudad de México.' },
      { title: 'Programa de Medio Ambiente CDMX', description: 'Estrategia de sustentabilidad que incluye infraestructura verde.' },
      { title: 'NOM-001-SEMARNAT-2021', description: 'Límites permisibles de contaminantes en descargas de aguas residuales.' },
      { title: 'ODS 6 — Agua limpia y saneamiento', description: 'Garantizar la disponibilidad y gestión sostenible del agua.' },
      { title: 'ODS 11 — Ciudades sostenibles', description: 'Lograr que ciudades sean inclusivas, seguras, resilientes y sostenibles.' },
      { title: 'ODS 15 — Vida de ecosistemas terrestres', description: 'Proteger, restaurar y promover el uso sostenible de los ecosistemas.' },
    ],
  },
  analisis: {
    sections: [
      { to: '/analisis/indicadores', title: 'Indicadores y distribución', description: 'Gráficas de distribución geográfica, tipológica y de servicios ecosistémicos. Evidencia científica de eficiencia.', icon: 'lucide:bar-chart-3', bg: 'bg-primary-50', iconColor: 'text-primary', accentColor: 'bg-primary' },
      { to: '/analisis/brecha', title: 'Brecha de cobertura', description: 'Análisis de las 16 alcaldías: índice de necesidad, mapa de cobertura y ranking de prioridad.', icon: 'lucide:map', bg: 'bg-eco/10', iconColor: 'text-eco', accentColor: 'bg-eco' },
      { to: '/analisis/hallazgos', title: 'Hallazgos y recomendaciones', description: 'Síntesis del inventario Fase 1, comparativo de costos y propuestas para la política pública.', icon: 'lucide:lightbulb', bg: 'bg-accent/10', iconColor: 'text-accent-dark', accentColor: 'bg-accent' },
    ],
  },
  inventario: {
    hero: [
      { title: 'Inventario de humedales', subtitle: 'Sistema de búsqueda, filtros y vista detallada de los humedales artificiales documentados en CDMX.', cta: 'Registra un humedal', ctaLink: '/registra' },
    ],
    helpText: [
      { title: '¿Qué encontrarás aquí?', description: 'Cada tarjeta muestra el tipo de humedal (FWS / SFS / Híbrido), año, alcaldía, vegetación y servicios ecosistémicos documentados. Toca una tarjeta para ver la ficha completa.' },
    ],
  },
  mapa: {
    hero: [
      { title: 'Mapa interactivo', subtitle: 'Distribución geográfica de los humedales artificiales en la CDMX. Cada marcador despliega los datos clave del sitio.', cta: 'Ver inventario', ctaLink: '/inventario' },
    ],
    legend: [
      { color: 'bg-primary', label: 'Activo', description: 'Humedal en operación regular' },
      { color: 'bg-accent', label: 'En expansión', description: 'En construcción de etapa nueva' },
      { color: 'bg-secondary', label: 'Piloto', description: 'Demostrativo o experimental' },
      { color: 'bg-slate-400', label: 'Pendiente verificación', description: 'Sitio reportado sin confirmación oficial' },
    ],
  },
  notihumedal: {
    hero: [
      { title: 'Notihumedal', subtitle: 'Notas, comunicados y publicaciones recientes sobre humedales artificiales en CDMX y México.', cta: '', ctaLink: '' },
    ],
    emptyState: [
      { title: 'Aún no hay artículos', description: 'Los nuevos artículos publicados aparecerán aquí. También puedes seguirnos por RSS.' },
    ],
  },
  registra: {
    hero: [
      { title: 'Registra un humedal', subtitle: 'Aporta tu conocimiento al observatorio. Tu reporte pasa por revisión de un especialista antes de publicarse.', cta: '', ctaLink: '' },
    ],
    steps: [
      { title: 'Paso 1', label: 'Datos técnicos', description: 'Ubicación, tipo de flujo, vegetación, sustrato y capacidad. Llena lo que tengas; los campos opcionales se pueden completar después.' },
      { title: 'Paso 2', label: 'Documento de respaldo', description: 'Si tienes un PDF, paper o reporte que documente el humedal, súbelo o pega el enlace. Es opcional pero acelera la verificación.' },
      { title: 'Paso 3', label: 'Confirmación', description: 'Revisa el resumen y envía. Recibirás respuesta del equipo en 5–10 días hábiles.' },
    ],
    confirmation: [
      { title: '¡Gracias por tu aporte!', description: 'Tu reporte entró a la cola de revisión. Si proporcionaste correo, te avisaremos del resultado. Mientras tanto puedes seguir explorando el inventario.' },
    ],
  },
  'analisis-indicadores': {
    hero: [
      { title: 'Indicadores', subtitle: 'Distribución, servicios ecosistémicos, comparativa técnica y evidencia científica.' },
    ],
    tabs: [
      { id: 'distribucion', label: 'Distribución', description: 'Por alcaldía, tipología y superficie' },
      { id: 'servicios', label: 'Servicios ecosistémicos', description: 'Frecuencia y matriz humedal × servicio' },
      { id: 'comparativo', label: 'Análisis comparativo', description: 'Timeline + tabla técnica completa' },
      { id: 'evidencia', label: 'Evidencia científica', description: 'Eficiencias documentadas y respaldo académico' },
    ],
  },
  'analisis-brecha': {
    hero: [
      { title: 'Brecha de cobertura', subtitle: 'Las 9 alcaldías sin humedal artificial vs. las 7 que ya tienen. Índice de necesidad y ranking.' },
    ],
    methodology: [
      { title: 'Cómo se calcula el índice de necesidad', description: 'IN = (inundación × 0.30) + (calor × 0.25) + (escasez de agua × 0.30) + (densidad poblacional normalizada × 0.15). Escalas 1–5 ordinales.' },
    ],
  },
  'analisis-hallazgos': {
    hero: [
      { title: 'Hallazgos y recomendaciones', subtitle: 'Síntesis del inventario Fase 1: 4 hallazgos, recomendaciones de política pública y comparativo de costos.' },
    ],
    callToAction: [
      { title: 'Quiero participar en política pública', description: 'Si representas a una alcaldía, dependencia o universidad y quieres explorar implementar humedales artificiales, escríbenos.', cta: 'Contacto', ctaLink: '/sobre' },
    ],
  },
  contributors: {
    hero: [
      { title: 'Red de contribuyentes', subtitle: 'Personas, instituciones y comunidades que aportan al observatorio. Cinco modos de participación.' },
    ],
    intro: [
      { title: 'Cinco modos de participación', description: 'Cada modo es una forma distinta de aportar (no un nivel a alcanzar). Aprendiz reporta, Observador da seguimiento, Caracterizador mide, Especialista investiga, Custodio resguarda.' },
    ],
  },
  footer: {
    brand: [
      { title: 'Observatorio de Humedales Artificiales CDMX', subtitle: 'Una iniciativa CIIEMAD-IPN', description: 'Plataforma de monitoreo, inventario y análisis de humedales artificiales en la Ciudad de México.' },
    ],
    sources: [
      { label: 'CIIEMAD — IPN', href: 'https://www.ciiemad.ipn.mx' },
      { label: 'CONAGUA — Inventario Nacional de Humedales', href: 'https://sigagis.conagua.gob.mx/humedales/' },
      { label: 'CONABIO — SIMOH-Mx', href: 'https://www.biodiversidad.gob.mx/monitoreo/simoh-mx' },
      { label: 'OpenStreetMap (Overpass API)', href: 'https://overpass-api.de' },
    ],
    quickLinks: [
      { label: 'Mapa', to: '/mapa' },
      { label: 'Inventario', to: '/inventario' },
      { label: 'Análisis', to: '/analisis' },
      { label: 'Notihumedal', to: '/notihumedal' },
      { label: 'Sobre', to: '/sobre' },
      { label: 'Registra un humedal', to: '/registra' },
    ],
    legal: [
      { body: 'Plataforma de datos abiertos. Licencia de software Apache 2.0. Contenido editorial bajo licencia CC BY 4.0 con atribución al inventario Fase 1 (Domínguez Solís, CIIEMAD-IPN).', copyright: '© 2026 Observatorio de Humedales Artificiales CDMX.' },
    ],
  },
}
