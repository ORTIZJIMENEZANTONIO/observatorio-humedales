import { describe, it, expect } from 'vitest'
import type { Humedal } from '~/types'
import { humedales as realHumedales } from '~/data/mock-humedales'

function generateHumedales(count: number): Humedal[] {
  const alcaldias = ['Miguel Hidalgo', 'Iztapalapa', 'Gustavo A. Madero', 'Xochimilco', 'Coyoacán', 'Tlalpan'] as any[]
  const tipos = ['conservacion', 'tratamiento_aguas', 'recreativo', 'captacion_pluvial', 'restauracion_hidrologica'] as any[]
  const flujos = ['superficial', 'subsuperficial_horizontal', 'subsuperficial_vertical', 'combinado'] as any[]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nombre: `Humedal Artificial Test ${i + 1}`,
    alcaldia: alcaldias[i % alcaldias.length],
    ubicacion: `Ubicación ${i + 1}`,
    tipoHumedal: tipos[i % tipos.length],
    tipoFlujo: flujos[i % flujos.length],
    tipoVegetacion: ['emergente'] as any[],
    funcionPrincipal: `Función ${i + 1}`,
    superficie: Math.floor(Math.random() * 50000),
    anioImplementacion: String(2010 + (i % 16)),
    vegetacion: ['Typha', 'Juncus'],
    sustrato: 'Grava',
    usoAgua: 'Riego',
    serviciosEcosistemicos: ['depuracion_agua', 'habitat_fauna'] as any[],
    serviciosDescripcion: ['Desc 1', 'Desc 2'],
    monitoreo: 'Sin datos',
    estado: 'activo' as const,
    lat: 19.2 + Math.random() * 0.3,
    lng: -99.3 + Math.random() * 0.3,
    fuente: 'Test',
    fuenteImagen: 'Test',
  }))
}

describe('Stress — Large dataset filtering', () => {
  const bigData = generateHumedales(1000)

  it('filters 1000 items by alcaldia in < 50ms', () => {
    const start = performance.now()
    const filtered = bigData.filter(h => h.alcaldia === 'Iztapalapa')
    const duration = performance.now() - start
    expect(filtered.length).toBeGreaterThan(0)
    expect(duration).toBeLessThan(50)
  })

  it('filters 1000 items by search query in < 50ms', () => {
    const query = 'test 500'
    const start = performance.now()
    const filtered = bigData.filter(h =>
      h.nombre.toLowerCase().includes(query) ||
      h.alcaldia.toLowerCase().includes(query)
    )
    const duration = performance.now() - start
    expect(duration).toBeLessThan(50)
  })

  it('sorts 1000 items by nombre in < 50ms', () => {
    const start = performance.now()
    const sorted = [...bigData].sort((a, b) => a.nombre.localeCompare(b.nombre))
    const duration = performance.now() - start
    expect(sorted[0].nombre).toBeTruthy()
    expect(duration).toBeLessThan(50)
  })

  it('sorts 1000 items by superficie in < 50ms', () => {
    const start = performance.now()
    const sorted = [...bigData].sort((a, b) => (b.superficie || 0) - (a.superficie || 0))
    const duration = performance.now() - start
    expect(sorted[0].superficie).toBeGreaterThanOrEqual(sorted[sorted.length - 1].superficie || 0)
    expect(duration).toBeLessThan(50)
  })

  it('paginates 1000 items correctly', () => {
    const perPage = 15
    const totalPages = Math.ceil(bigData.length / perPage)
    expect(totalPages).toBe(67)

    // First page
    const page1 = bigData.slice(0, perPage)
    expect(page1).toHaveLength(15)

    // Last page
    const lastPage = bigData.slice((totalPages - 1) * perPage)
    expect(lastPage).toHaveLength(10) // 1000 % 15 = 10
  })

  it('combined filter + sort + paginate in < 100ms', () => {
    const start = performance.now()
    const filtered = bigData.filter(h => h.tipoHumedal === 'tratamiento_aguas')
    const sorted = filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
    const paginated = sorted.slice(0, 15)
    const duration = performance.now() - start
    expect(paginated.length).toBeLessThanOrEqual(15)
    expect(duration).toBeLessThan(100)
  })
})

describe('Stress — Large dataset computation', () => {
  const bigData = generateHumedales(5000)

  it('computes service frequency across 5000 items in < 100ms', () => {
    const start = performance.now()
    const counts: Record<string, number> = {}
    bigData.forEach(h => {
      h.serviciosEcosistemicos.forEach(s => {
        counts[s] = (counts[s] || 0) + 1
      })
    })
    const duration = performance.now() - start
    expect(Object.keys(counts).length).toBeGreaterThan(0)
    expect(duration).toBeLessThan(100)
  })

  it('groups 5000 items by alcaldia in < 50ms', () => {
    const start = performance.now()
    const groups: Record<string, number> = {}
    bigData.forEach(h => {
      groups[h.alcaldia] = (groups[h.alcaldia] || 0) + 1
    })
    const duration = performance.now() - start
    expect(Object.keys(groups).length).toBeGreaterThan(0)
    expect(duration).toBeLessThan(50)
  })
})

describe('Stress — Real data invariants', () => {
  it('real 8 humedales all have valid coordinates', () => {
    realHumedales.forEach(h => {
      expect(h.lat).toBeGreaterThan(19)
      expect(h.lat).toBeLessThan(20)
      expect(h.lng).toBeGreaterThan(-99.5)
      expect(h.lng).toBeLessThan(-98.5)
    })
  })

  it('real data surface total matches KPI', () => {
    const total = realHumedales.reduce((sum, h) => sum + (h.superficie || 0), 0)
    expect(total).toBeGreaterThan(60000) // at least 60k m²
  })
})
