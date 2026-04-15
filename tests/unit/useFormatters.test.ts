import { describe, it, expect } from 'vitest'
import { useFormatters } from '~/composables/useFormatters'

describe('useFormatters', () => {
  const fmt = useFormatters()

  // ── Number formatting ──
  describe('formatNumber', () => {
    it('formats integers with locale separators', () => {
      expect(fmt.formatNumber(1000)).toMatch(/1[,.]000/)
    })
    it('formats decimals when requested', () => {
      expect(fmt.formatNumber(3.14159, true)).toContain('3')
    })
    it('handles zero', () => {
      expect(fmt.formatNumber(0)).toBe('0')
    })
    it('handles negative numbers', () => {
      expect(fmt.formatNumber(-500)).toContain('500')
    })
  })

  // ── Area formatting ──
  describe('formatArea', () => {
    it('formats with m² suffix', () => {
      expect(fmt.formatArea(8085)).toContain('m²')
    })
    it('includes formatted number', () => {
      expect(fmt.formatArea(48900)).toMatch(/48[,.]900/)
    })
  })

  // ── Volume formatting ──
  describe('formatVolume', () => {
    it('formats with m³ suffix', () => {
      expect(fmt.formatVolume(13646)).toContain('m³')
    })
  })

  // ── Percent formatting ──
  describe('formatPercent', () => {
    it('formats decimal as percent', () => {
      const result = fmt.formatPercent(0.8)
      expect(result).toContain('80')
    })
    it('handles values over 1 (treats as already percentage)', () => {
      const result = fmt.formatPercent(95)
      expect(result).toContain('95')
    })
  })

  // ── Tipo humedal ──
  describe('formatTipoHumedal', () => {
    it('maps conservacion', () => {
      expect(fmt.formatTipoHumedal('conservacion')).toBe('Conservación')
    })
    it('maps tratamiento_aguas', () => {
      expect(fmt.formatTipoHumedal('tratamiento_aguas')).toBe('Tratamiento de aguas')
    })
    it('maps all 5 types', () => {
      const types = ['conservacion', 'tratamiento_aguas', 'recreativo', 'captacion_pluvial', 'restauracion_hidrologica']
      types.forEach(t => {
        expect(fmt.formatTipoHumedal(t)).not.toBe(t) // should be human-readable
      })
    })
    it('returns fallback for unknown type', () => {
      expect(fmt.formatTipoHumedal('unknown_type')).toBe('Unknown type')
    })
    it('returns Sin tipo for empty', () => {
      expect(fmt.formatTipoHumedal('')).toBe('Sin tipo')
    })
  })

  // ── Tipo flujo ──
  describe('formatTipoFlujo', () => {
    it('maps superficial', () => {
      expect(fmt.formatTipoFlujo('superficial')).toBe('Flujo superficial')
    })
    it('maps subsuperficial_horizontal', () => {
      expect(fmt.formatTipoFlujo('subsuperficial_horizontal')).toBe('Flujo subsuperficial horizontal')
    })
    it('maps combinado', () => {
      expect(fmt.formatTipoFlujo('combinado')).toContain('Combinado')
    })
    it('returns Sin especificar for empty', () => {
      expect(fmt.formatTipoFlujo('')).toBe('Sin especificar')
    })
  })

  // ── Tipo vegetacion ──
  describe('formatTipoVegetacion', () => {
    it('maps flotante', () => {
      expect(fmt.formatTipoVegetacion('flotante')).toBe('Flotante')
    })
    it('maps emergente', () => {
      expect(fmt.formatTipoVegetacion('emergente')).toBe('Emergente')
    })
    it('maps sumergida', () => {
      expect(fmt.formatTipoVegetacion('sumergida')).toBe('Sumergida')
    })
  })

  // ── Estado humedal ──
  describe('formatEstadoHumedal', () => {
    it('maps activo', () => {
      expect(fmt.formatEstadoHumedal('activo')).toBe('Activo')
    })
    it('maps en_expansion', () => {
      expect(fmt.formatEstadoHumedal('en_expansion')).toBe('En expansión')
    })
  })

  // ── Servicio ecosistemico ──
  describe('formatServicioEcosistemico', () => {
    it('maps depuracion_agua', () => {
      expect(fmt.formatServicioEcosistemico('depuracion_agua')).toBe('Tratamiento de agua')
    })
    it('maps reduccion_lst', () => {
      expect(fmt.formatServicioEcosistemico('reduccion_lst')).toBe('Reducción LST')
    })
    it('maps all 10 services', () => {
      const services = ['depuracion_agua', 'habitat_fauna', 'educacion_ambiental', 'captura_carbono', 'regulacion_termica', 'control_inundaciones', 'recarga_acuiferos', 'banco_germoplasma', 'recreacion', 'reduccion_lst']
      services.forEach(s => {
        expect(fmt.formatServicioEcosistemico(s)).not.toBe(s)
      })
    })
  })

  // ── Badge classes ──
  describe('badge classes', () => {
    it('tipoHumedalBadgeClass returns correct classes', () => {
      expect(fmt.tipoHumedalBadgeClass('conservacion')).toContain('eco')
      expect(fmt.tipoHumedalBadgeClass('tratamiento_aguas')).toContain('secondary')
      expect(fmt.tipoHumedalBadgeClass('')).toContain('gray')
    })
    it('tipoFlujoBadgeClass returns correct classes', () => {
      expect(fmt.tipoFlujoBadgeClass('superficial')).toContain('secondary')
      expect(fmt.tipoFlujoBadgeClass('combinado')).toContain('accent')
      expect(fmt.tipoFlujoBadgeClass('')).toContain('gray')
    })
    it('estadoHumedalBadgeClass returns correct classes', () => {
      expect(fmt.estadoHumedalBadgeClass('activo')).toContain('eco')
      expect(fmt.estadoHumedalBadgeClass('en_expansion')).toContain('secondary')
    })
  })

  // ── KPI helpers ──
  describe('KPI helpers', () => {
    it('kpiIconBg returns bg class', () => {
      expect(fmt.kpiIconBg('primary')).toContain('bg-')
      expect(fmt.kpiIconBg('eco')).toContain('bg-')
      expect(fmt.kpiIconBg('unknown')).toContain('bg-')
    })
    it('kpiIconColor returns text class', () => {
      expect(fmt.kpiIconColor('primary')).toContain('text-')
      expect(fmt.kpiIconColor('eco')).toContain('text-')
    })
  })
})
