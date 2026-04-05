// ============================================================================
// Alineación con Objetivos de Desarrollo Sostenible (ODS) — ONU
// Observatorio de Humedales Artificiales CDMX
// ============================================================================

import type { ODSGoal } from '~/types'

export const odsGoals: ODSGoal[] = [
  // ── ODS 6: Agua limpia y saneamiento ──
  {
    id: 'ods_6',
    numero: 6,
    nombre: 'Agua limpia y saneamiento',
    descripcion:
      'Garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todos.',
    color: '#26BDE2',
    contribucionGeneral:
      'Los humedales artificiales de tratamiento contribuyen directamente a la depuración de aguas residuales mediante procesos de filtración biológica, remoción de contaminantes y cumplimiento de los parámetros establecidos en la NOM-001-SEMARNAT-2021. Sistemas como los de Bosque de Aragón y Parque Ecológico Cuitláhuac demuestran la viabilidad de soluciones basadas en la naturaleza para el saneamiento urbano.',
    metasEspecificas: [
      'Meta 6.3 — Mejorar la calidad del agua reduciendo la contaminación, eliminando vertimientos y minimizando la emisión de productos químicos y materiales peligrosos, reduciendo a la mitad el porcentaje de aguas residuales sin tratar.',
      'Meta 6.6 — Proteger y restablecer los ecosistemas relacionados con el agua, incluidos los humedales, ríos, acuíferos y lagos.',
    ],
    humedalesRelacionados: [2, 3, 7],
    indicadores: [
      'Capacidad de tratamiento (m³/día)',
      'Eficiencia de remoción de contaminantes (%)',
      'Cumplimiento de parámetros NOM-001-SEMARNAT',
      'Volumen de agua tratada anualmente (m³/año)',
    ],
  },

  // ── ODS 11: Ciudades y comunidades sostenibles ──
  {
    id: 'ods_11',
    numero: 11,
    nombre: 'Ciudades y comunidades sostenibles',
    descripcion:
      'Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles.',
    color: '#FD9D24',
    contribucionGeneral:
      'Los humedales artificiales funcionan como infraestructura verde urbana que fortalece la resiliencia de la Ciudad de México ante eventos climáticos extremos. Proyectos como Playa de Aves y el sistema de captación pluvial en Cerro de la Estrella contribuyen al control de inundaciones, la creación de espacios públicos verdes y la adaptación urbana al cambio climático.',
    metasEspecificas: [
      'Meta 11.5 — Reducir significativamente el número de muertes causadas por desastres, incluidos los relacionados con el agua, y reducir las pérdidas económicas directas.',
      'Meta 11.7 — Proporcionar acceso universal a zonas verdes y espacios públicos seguros, inclusivos y accesibles, en particular para mujeres, niños, personas de edad avanzada y personas con discapacidad.',
      'Meta 11.b — Aumentar considerablemente el número de ciudades que adoptan e implementan políticas y planes integrados para la inclusión, la eficiencia de los recursos, la mitigación del cambio climático y la resiliencia ante los desastres.',
    ],
    humedalesRelacionados: [4, 5],
    indicadores: [
      'Superficie de infraestructura verde incorporada (m²)',
      'Capacidad de control de inundaciones (m³ retenidos)',
      'Población beneficiada en el área de influencia',
      'Espacios públicos verdes generados (m²)',
    ],
  },

  // ── ODS 13: Acción por el clima ──
  {
    id: 'ods_13',
    numero: 13,
    nombre: 'Acción por el clima',
    descripcion:
      'Adoptar medidas urgentes para combatir el cambio climático y sus efectos.',
    color: '#3F7E44',
    contribucionGeneral:
      'Los humedales artificiales con vegetación acuática densa actúan como sumideros de carbono y reguladores térmicos en zonas urbanas. Humedales como Anfibium, Parque Ecológico Cuitláhuac y el Vivero San Luis Tlaxialtemalco capturan CO₂ mediante procesos de fotosíntesis de plantas emergentes y subacuáticas, al tiempo que reducen el efecto de isla de calor en sus áreas circundantes.',
    metasEspecificas: [
      'Meta 13.1 — Fortalecer la resiliencia y la capacidad de adaptación a los riesgos relacionados con el clima y los desastres naturales en todos los países.',
      'Meta 13.2 — Incorporar medidas relativas al cambio climático en las políticas, estrategias y planes nacionales.',
    ],
    humedalesRelacionados: [1, 2, 6],
    indicadores: [
      'Estimación de CO₂ capturado (tCO₂/año)',
      'Superficie con efecto de regulación térmica (m²)',
      'Reducción de temperatura superficial en área de influencia (°C)',
      'Biomasa vegetal acumulada (kg/m²)',
    ],
  },

  // ── ODS 15: Vida de ecosistemas terrestres ──
  {
    id: 'ods_15',
    numero: 15,
    nombre: 'Vida de ecosistemas terrestres',
    descripcion:
      'Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres, gestionar sosteniblemente los bosques, luchar contra la desertificación, detener e invertir la degradación de las tierras y detener la pérdida de biodiversidad.',
    color: '#56C02B',
    contribucionGeneral:
      'Los humedales artificiales generan hábitats para fauna nativa, incluyendo aves migratorias, anfibios (como el ajolote mexicano) y especies de flora acuática endémica. Proyectos como Anfibium, Playa de Aves y el Vivero San Luis Tlaxialtemalco funcionan como reservorios de biodiversidad y bancos de germoplasma que contribuyen a la conservación de especies en entornos urbanos.',
    metasEspecificas: [
      'Meta 15.1 — Asegurar la conservación, el restablecimiento y el uso sostenible de los ecosistemas terrestres y los ecosistemas interiores de agua dulce y sus servicios.',
      'Meta 15.5 — Adoptar medidas urgentes y significativas para reducir la degradación de los hábitats naturales, detener la pérdida de biodiversidad y proteger las especies amenazadas y evitar su extinción.',
    ],
    humedalesRelacionados: [1, 4, 6],
    indicadores: [
      'Número de especies de fauna registradas',
      'Número de especies de flora acuática cultivadas',
      'Superficie de hábitat generado (m²)',
      'Presencia de especies en categoría de riesgo (NOM-059-SEMARNAT)',
    ],
  },
]
