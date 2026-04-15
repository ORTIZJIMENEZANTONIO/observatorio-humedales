export const cmsDefaults: Record<string, Record<string, any[]>> = {
  home: {
    features: [
      { title: 'Inventario geoespacial', description: 'Localización y caracterización de humedales artificiales en la Ciudad de México, con datos de ubicación, superficie y vegetación.', to: '/inventario', bg: 'bg-primary-50', iconColor: 'text-primary', icon: 'lucide:map-pin' },
      { title: 'Servicios ecosistémicos', description: 'Análisis de los beneficios ambientales: tratamiento de agua, hábitat para fauna, captura de carbono y regulación térmica.', to: '/analisis/indicadores', bg: 'bg-eco/10', iconColor: 'text-eco', icon: 'lucide:droplets' },
      { title: 'Metodología científica', description: 'Sistematización basada en criterios técnicos: tipo de humedal, vegetación, sustrato y uso del agua tratada.', to: '/sobre#metodologia', bg: 'bg-secondary/10', iconColor: 'text-secondary', icon: 'lucide:microscope' },
    ],
    steps: [
      { title: 'Identificación', description: 'Localización de humedales artificiales existentes en la CDMX mediante fuentes oficiales, académicas y de trabajo de campo.' },
      { title: 'Caracterización', description: 'Documentación de tipo, vegetación, sustrato, superficie y capacidad de tratamiento.' },
      { title: 'Análisis', description: 'Evaluación de servicios ecosistémicos y comparación entre tipologías de humedales.' },
      { title: 'Visualización', description: 'Presentación interactiva en mapas y gráficas para tomadores de decisiones.' },
    ],
    tipologias: [
      { title: 'Tratamiento de aguas', description: 'Sistemas diseñados para depurar aguas residuales y pluviales mediante procesos biológicos naturales.', examples: 'Aragón STHA, Segundo Aragón, Parque Ecológico Cuitláhuac', badge: 'Tratamiento', badgeClass: 'badge-secondary' },
      { title: 'Conservación y biodiversidad', description: 'Humedales enfocados en la preservación de ecosistemas acuáticos y el refugio de fauna nativa.', examples: 'Anfibium (Chapultepec)', badge: 'Conservación', badgeClass: 'badge-eco' },
      { title: 'Regulación hidrológica', description: 'Infraestructura verde para el control de escorrentías, captación pluvial y recarga de acuíferos.', examples: 'Bajo Puente Cuemanco, Cerro de la Estrella', badge: 'Regulación', badgeClass: 'badge-primary' },
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
      { title: 'Tipo de humedal', description: 'Clasificación funcional: conservación, tratamiento, recreativo, captación o restauración.', icon: '🏷️' },
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
}
