import type { KPI } from '~/types'

export const kpis: KPI[] = [
  {
    label: 'Humedales artificiales inventariados',
    valor: '8',
    color: 'primary',
  },
  {
    label: 'Superficie total',
    valor: '71,188',
    unidad: 'm² documentados',
    color: 'eco',
  },
  {
    label: 'Alcaldías con humedales artificiales',
    valor: '5',
    color: 'secondary',
  },
  {
    label: 'Tipologías principales',
    valor: '3',
    color: 'accent',
  },
  {
    label: 'Capacidad de tratamiento',
    valor: '~2,640',
    unidad: 'm³/día',
    color: 'primary',
  },
  {
    label: 'Servicios ecosistémicos',
    valor: '9',
    unidad: 'tipos identificados',
    color: 'eco',
  },
]
