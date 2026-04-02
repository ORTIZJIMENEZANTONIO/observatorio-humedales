import type { KPI } from '~/types'

export const kpis: KPI[] = [
  {
    label: 'Humedales inventariados',
    valor: '7',
    color: 'primary',
  },
  {
    label: 'Superficie total',
    valor: '60,195',
    unidad: 'm² documentados',
    color: 'eco',
  },
  {
    label: 'Alcaldías con humedales',
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
