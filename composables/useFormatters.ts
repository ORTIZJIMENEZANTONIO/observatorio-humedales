export function useFormatters() {
  const numberFmt = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 })
  const numberFmtDecimals = new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })
  const percentFmt = new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
  const dateFmt = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  function formatNumber(value: number, decimals = false): string {
    return decimals ? numberFmtDecimals.format(value) : numberFmt.format(value)
  }

  function formatArea(m2: number): string {
    return `${numberFmt.format(m2)} m\u00B2`
  }

  function formatVolume(m3: number): string {
    return `${numberFmt.format(m3)} m\u00B3`
  }

  function formatPercent(value: number): string {
    const normalized = value > 1 ? value / 100 : value
    return percentFmt.format(normalized)
  }

  function formatDate(value: string | Date, short = false): string {
    const date = typeof value === 'string' ? new Date(value + 'T00:00:00') : value
    if (isNaN(date.getTime())) return String(value)
    return dateFmt.format(date)
  }

  function formatTipoHumedal(tipo: string): string {
    if (!tipo) return 'Sin tipo'
    const map: Record<string, string> = {
      conservacion: 'Conservación',
      tratamiento_aguas: 'Tratamiento de aguas',
      recreativo: 'Recreativo',
      captacion_pluvial: 'Captación pluvial',
      restauracion_hidrologica: 'Restauración hidrológica',
    }
    return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ')
  }

  function formatEstadoHumedal(estado: string): string {
    if (!estado) return 'Sin estado'
    const map: Record<string, string> = {
      activo: 'Activo',
      en_construccion: 'En construcción',
      en_expansion: 'En expansión',
      piloto: 'Piloto',
    }
    return map[estado] || estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, ' ')
  }

  function formatServicioEcosistemico(servicio: string): string {
    if (!servicio) return 'Sin datos'
    const map: Record<string, string> = {
      depuracion_agua: 'Tratamiento de agua',
      habitat_fauna: 'Hábitat de fauna',
      educacion_ambiental: 'Educación ambiental',
      captura_carbono: 'Captura de carbono',
      regulacion_termica: 'Regulación térmica',
      control_inundaciones: 'Control de inundaciones',
      recarga_acuiferos: 'Recarga de acuíferos',
      banco_germoplasma: 'Banco de germoplasma',
      recreacion: 'Recreación',
      reduccion_lst: 'Reducción LST',
    }
    return map[servicio] || servicio.charAt(0).toUpperCase() + servicio.slice(1).replace(/_/g, ' ')
  }

  function formatTipoFlujo(tipo: string): string {
    if (!tipo) return 'Sin especificar'
    const map: Record<string, string> = {
      superficial: 'Flujo superficial',
      subsuperficial_horizontal: 'Flujo subsuperficial horizontal',
      subsuperficial_vertical: 'Flujo subsuperficial vertical',
      combinado: 'Combinado (HAFSS + HAFS)',
    }
    return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ')
  }

  function formatTipoVegetacion(tipo: string): string {
    if (!tipo) return 'Sin datos'
    const map: Record<string, string> = {
      flotante: 'Flotante',
      emergente: 'Emergente',
      sumergida: 'Sumergida',
    }
    return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)
  }

  function tipoFlujoBadgeClass(tipo: string): string {
    if (!tipo) return 'bg-gray-100 text-ink-muted'
    const map: Record<string, string> = {
      superficial: 'bg-secondary/10 text-secondary-dark',
      subsuperficial_horizontal: 'bg-primary-50 text-primary',
      subsuperficial_vertical: 'bg-eco/10 text-eco-dark',
      combinado: 'bg-accent/10 text-accent-dark',
    }
    return map[tipo] || 'bg-gray-100 text-ink-muted'
  }

  function tipoHumedalBadgeClass(tipo: string): string {
    if (!tipo) return 'bg-gray-100 text-ink-muted'
    const map: Record<string, string> = {
      conservacion: 'bg-eco/10 text-eco-dark',
      tratamiento_aguas: 'bg-secondary/10 text-secondary-dark',
      recreativo: 'bg-accent/10 text-accent-dark',
      captacion_pluvial: 'bg-primary-50 text-primary',
      restauracion_hidrologica: 'bg-primary-50 text-primary',
    }
    return map[tipo] || 'bg-gray-100 text-ink-muted'
  }

  function estadoHumedalBadgeClass(estado: string): string {
    if (!estado) return 'bg-gray-100 text-ink-muted'
    const map: Record<string, string> = {
      activo: 'bg-eco/10 text-eco-dark',
      en_construccion: 'bg-accent/10 text-accent-dark',
      en_expansion: 'bg-secondary/10 text-secondary-dark',
      piloto: 'bg-primary-50 text-primary',
    }
    return map[estado] || 'bg-gray-100 text-ink-muted'
  }

  function kpiColor(color: string): string {
    const map: Record<string, string> = {
      primary: 'text-primary',
      eco: 'text-eco',
      secondary: 'text-secondary',
      accent: 'text-accent',
    }
    return map[color] || 'text-ink'
  }

  function kpiIconBg(color: string): string {
    const map: Record<string, string> = {
      primary: 'bg-primary-50',
      eco: 'bg-eco/10',
      secondary: 'bg-secondary/10',
      accent: 'bg-accent/10',
    }
    return map[color] || 'bg-gray-100'
  }

  function kpiIconColor(color: string): string {
    const map: Record<string, string> = {
      primary: 'text-primary',
      eco: 'text-eco',
      secondary: 'text-secondary',
      accent: 'text-accent',
    }
    return map[color] || 'text-ink-muted'
  }

  return {
    formatNumber,
    formatArea,
    formatVolume,
    formatPercent,
    formatDate,
    formatTipoHumedal,
    formatTipoFlujo,
    formatTipoVegetacion,
    formatEstadoHumedal,
    formatServicioEcosistemico,
    tipoHumedalBadgeClass,
    tipoFlujoBadgeClass,
    estadoHumedalBadgeClass,
    kpiColor,
    kpiIconBg,
    kpiIconColor,
  }
}
