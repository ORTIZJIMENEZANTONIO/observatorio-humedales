// ============================================================================
// Observatorio de Humedales Artificiales CDMX — Hallazgos y Comparativo de Costos
// Fuente: Inventario Fase 1, CIIEMAD-IPN (Domínguez Solís)
// ============================================================================

import type { Hallazgo, ComparativoCostos } from '~/types'

export const hallazgos: Hallazgo[] = [
  // ── Hallazgo 1: Monitoreo ──
  {
    id: 1,
    titulo: 'Ausencia de monitoreo estandarizado',
    descripcion:
      'La mayoría de los humedales inventariados carecen de datos cuantitativos de desempeño. Solo 2 de 7 registros presentan información parcial de eficiencia; el resto indica "No se reportan datos de monitoreo cuantitativo", lo que impide evaluar el impacto real de estas infraestructuras.',
    evidencia: [
      'Solo 2-3 de los 7 humedales cuentan con datos cuantitativos parciales de remoción de contaminantes.',
      'La mayoría de las fichas del inventario señalan "No se reportan datos de monitoreo cuantitativo".',
      'No existe un protocolo común de medición entre los humedales de distintas alcaldías.',
      'Las fuentes públicas (prensa, boletines institucionales) reportan capacidades de diseño, pero no resultados operativos.',
    ],
    impacto: 'critico',
    recomendacion: {
      titulo: 'Implementar protocolo de monitoreo estandarizado',
      descripcion:
        'Establecer un protocolo unificado de monitoreo que incluya parámetros fisicoquímicos y microbiológicos clave, con frecuencia trimestral y publicación en datos abiertos.',
      acciones: [
        'Definir parámetros mínimos obligatorios: DQO, nitrógeno total, fósforo total, coliformes fecales y caudal tratado.',
        'Establecer frecuencia de muestreo trimestral para cada humedal.',
        'Crear una plataforma de datos abiertos para publicar resultados de monitoreo.',
        'Capacitar a personal operativo de cada sitio en técnicas de muestreo y registro.',
      ],
      responsables: ['SEDEMA', 'CIIEMAD-IPN', 'CONAGUA'],
      plazo: 'corto',
      costoEstimado: '$500,000 – $1,500,000 MXN por humedal',
    },
  },

  // ── Hallazgo 2: Concentración territorial ──
  {
    id: 2,
    titulo: 'Concentración territorial desigual',
    descripcion:
      'Los 7 humedales artificiales se ubican en solo 5 de las 16 alcaldías de la Ciudad de México. Las 11 alcaldías restantes no cuentan con ningún humedal inventariado, a pesar de que varias presentan altos índices de estrés hídrico, islas de calor e inundaciones recurrentes.',
    evidencia: [
      'Solo 5 de 16 alcaldías (31 %) cuentan con al menos un humedal artificial.',
      '11 alcaldías no tienen ningún humedal inventariado.',
      'Iztapalapa y Gustavo A. Madero concentran múltiples instalaciones (2 cada una).',
      'Alcaldías con alta necesidad hídrica —como Iztacalco, Venustiano Carranza y Tláhuac— carecen de humedales.',
    ],
    impacto: 'alto',
    recomendacion: {
      titulo: 'Priorizar expansión con índice de necesidad territorial',
      descripcion:
        'Diseñar una estrategia de expansión que priorice alcaldías sin cobertura utilizando un índice compuesto de necesidad (estrés hídrico, inundaciones, islas de calor, densidad poblacional).',
      acciones: [
        'Construir un índice de necesidad por alcaldía que integre variables de estrés hídrico, riesgo de inundación e islas de calor.',
        'Priorizar las alcaldías de Iztacalco, Venustiano Carranza y Tláhuac como candidatas inmediatas.',
        'Elaborar estudios de factibilidad para al menos 3 nuevos humedales en alcaldías sin cobertura.',
        'Vincular la estrategia con los programas de desarrollo urbano de cada alcaldía.',
      ],
      responsables: ['Gobierno de la CDMX', 'SEDEMA', 'Alcaldías prioritarias'],
      plazo: 'mediano',
    },
  },

  // ── Hallazgo 3: Eficiencia limitada a pilotos ──
  {
    id: 3,
    titulo: 'Datos de eficiencia limitados a estudios piloto',
    descripcion:
      'Las tasas de remoción de contaminantes reportadas (50-95 %) provienen de estudios piloto realizados por la UNAM, UAM y UACh en condiciones controladas, no de mediciones in situ de los humedales urbanos operativos. Esto genera una brecha entre la eficiencia teórica y el desempeño real.',
    evidencia: [
      'Los estudios de la UNAM y UAM reportan eficiencias de remoción del 50-95 % en condiciones experimentales controladas.',
      'Dichas mediciones corresponden a pilotos académicos, no a los humedales operativos del inventario.',
      'No existen datos publicados de eficiencia in situ para ninguno de los 7 humedales inventariados.',
      'Las condiciones reales (variabilidad de carga, clima, mantenimiento) pueden reducir significativamente la eficiencia.',
    ],
    impacto: 'alto',
    recomendacion: {
      titulo: 'Establecer convenios universidad-gobierno para monitoreo in situ',
      descripcion:
        'Formalizar alianzas con instituciones académicas para realizar mediciones de eficiencia directamente en los humedales operativos, generando datos comparables con los estudios piloto.',
      acciones: [
        'Firmar convenios de colaboración con UNAM, UAM, UACh e IPN para monitoreo in situ.',
        'Diseñar campañas de muestreo estacional (mínimo 4 al año) en cada humedal operativo.',
        'Comparar resultados de campo con las eficiencias reportadas en estudios piloto.',
        'Publicar reportes técnicos anuales con datos de eficiencia real.',
      ],
      responsables: ['SEDEMA', 'IPN', 'UNAM'],
      plazo: 'mediano',
      costoEstimado: '$2,000,000 – $5,000,000 MXN (programa integral)',
    },
  },

  // ── Hallazgo 4: Ventaja económica ──
  {
    id: 4,
    titulo: 'Ventaja económica no cuantificada formalmente',
    descripcion:
      'Los humedales artificiales presentan costos de tratamiento estimados entre $0.50 y $2.00 MXN/m³, significativamente inferiores a los $5-15 MXN/m³ de plantas convencionales. Sin embargo, no existe un análisis costo-beneficio formal que documente esta ventaja para fundamentar la inversión en nuevos proyectos.',
    evidencia: [
      'El costo estimado de tratamiento en humedales artificiales es de ~$0.50-2.00 MXN/m³ frente a $5-15 MXN/m³ en plantas convencionales.',
      'Los 7 humedales inventariados podrían procesar un volumen estimado de ~2,640 m³/día en conjunto.',
      'Ningún documento público presenta un análisis formal de costo-beneficio para los humedales de la CDMX.',
      'La ausencia de argumentos económicos cuantificados dificulta la justificación de nuevas inversiones.',
    ],
    impacto: 'alto',
    recomendacion: {
      titulo: 'Realizar análisis costo-beneficio formal',
      descripcion:
        'Elaborar un estudio de costo-beneficio que compare humedales artificiales con tratamientos convencionales, documentando la ventaja económica para fundamentar la política pública de expansión.',
      acciones: [
        'Contratar o desarrollar un análisis costo-beneficio que incluya costos de inversión, operación, mantenimiento y externalidades ambientales.',
        'Cuantificar el valor económico de los servicios ecosistémicos co-producidos (captura de carbono, hábitat, recreación).',
        'Documentar el argumento económico en un formato accesible para tomadores de decisión.',
        'Presentar resultados ante las comisiones de medio ambiente y agua del Congreso de la CDMX.',
      ],
      responsables: ['CONAGUA', 'SEDEMA', 'Academia (IPN, UNAM)'],
      plazo: 'corto',
    },
  },
]

// ============================================================================
// Comparativo de costos de tratamiento de agua
// ============================================================================

export const comparativoCostos: ComparativoCostos[] = [
  {
    metodo: 'Humedal artificial',
    costoM3: '$0.50 – $2.00 MXN',
    eficiencia: '50 – 95 %',
    ventajas: [
      'Bajo costo de operación y mantenimiento.',
      'Genera servicios ecosistémicos adicionales (hábitat, captura de carbono, recreación).',
      'No requiere energía eléctrica en sistemas de flujo libre.',
      'Se integra al paisaje urbano como infraestructura verde.',
    ],
    desventajas: [
      'Requiere mayor superficie de terreno que una planta convencional.',
      'Eficiencia variable según clima, carga contaminante y mantenimiento.',
      'Tiempos de retención hidráulica más largos.',
      'Menor capacidad de tratamiento por unidad de área.',
    ],
  },
  {
    metodo: 'Planta de tratamiento convencional',
    costoM3: '$5.00 – $15.00 MXN',
    eficiencia: '85 – 99 %',
    ventajas: [
      'Alta eficiencia y consistencia en la remoción de contaminantes.',
      'Capacidad de procesar grandes volúmenes en espacios reducidos.',
      'Tecnología ampliamente documentada y regulada.',
      'Control preciso de los parámetros de operación.',
    ],
    desventajas: [
      'Alto costo de inversión inicial, operación y mantenimiento.',
      'Requiere suministro constante de energía eléctrica.',
      'Genera lodos residuales que requieren disposición final.',
      'No produce servicios ecosistémicos adicionales.',
    ],
  },
  {
    metodo: 'Cloración básica',
    costoM3: '$0.20 – $0.80 MXN',
    eficiencia: '30 – 60 % (solo patógenos)',
    ventajas: [
      'Costo muy bajo por metro cúbico tratado.',
      'Implementación sencilla y rápida.',
      'Efectiva contra organismos patógenos.',
      'Ampliamente disponible y de fácil almacenamiento.',
    ],
    desventajas: [
      'Solo elimina patógenos; no remueve contaminantes químicos, nutrientes ni sólidos.',
      'Genera subproductos de desinfección potencialmente tóxicos (trihalometanos).',
      'Eficiencia limitada frente a cargas orgánicas altas.',
      'No contribuye a la mejora ambiental ni genera servicios ecosistémicos.',
    ],
  },
]
