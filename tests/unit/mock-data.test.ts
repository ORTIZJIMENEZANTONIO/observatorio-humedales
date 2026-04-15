import { describe, it, expect } from 'vitest'
import { humedales } from '~/data/mock-humedales'
import { kpis } from '~/data/kpis'
import { odsGoals } from '~/data/ods-alignment'
import { hallazgos, comparativoCostos } from '~/data/hallazgos'
import { articulos } from '~/data/notihumedal'
import { cmsDefaults } from '~/data/cms-defaults'

describe('Data Integrity — Humedales', () => {
  it('has exactly 8 records', () => {
    expect(humedales).toHaveLength(8)
  })
  it('all have unique IDs', () => {
    const ids = humedales.map(h => h.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('all have required fields', () => {
    humedales.forEach(h => {
      expect(h.nombre).toBeTruthy()
      expect(h.alcaldia).toBeTruthy()
      expect(h.ubicacion).toBeTruthy()
      expect(h.tipoHumedal).toBeTruthy()
      expect(h.funcionPrincipal).toBeTruthy()
      expect(h.anioImplementacion).toBeTruthy()
      expect(h.vegetacion.length).toBeGreaterThan(0)
      expect(h.sustrato).toBeTruthy()
      expect(h.serviciosEcosistemicos.length).toBeGreaterThan(0)
      expect(h.lat).toBeGreaterThan(0)
      expect(h.lng).toBeLessThan(0) // CDMX is west of meridian
      expect(h.estado).toBeTruthy()
    })
  })
  it('all names include "Artificial" or "Segundo"', () => {
    humedales.forEach(h => {
      expect(h.nombre).toMatch(/Artificial|Segundo/)
    })
  })
  it('all have tipoFlujo field', () => {
    humedales.forEach(h => {
      expect(h.tipoFlujo).toBeTruthy()
    })
  })
  it('all have tipoVegetacion array', () => {
    humedales.forEach(h => {
      expect(Array.isArray(h.tipoVegetacion)).toBe(true)
      expect(h.tipoVegetacion!.length).toBeGreaterThan(0)
    })
  })
  it('all have fuente field', () => {
    humedales.forEach(h => {
      expect(h.fuente).toBeTruthy()
    })
  })
  it('Aragon STHA (id=3) has correct data', () => {
    const aragon = humedales.find(h => h.id === 3)!
    expect(aragon.tipoFlujo).toBe('combinado')
    expect(aragon.superficie).toBe(8085)
    expect(aragon.capacidadTratamiento).toContain('250')
    expect(aragon.anioImplementacion).toBe('2012')
  })
  it('Segundo Aragon (id=8) has correct data', () => {
    const segundo = humedales.find(h => h.id === 8)!
    expect(segundo.tipoFlujo).toBe('subsuperficial_horizontal')
    expect(segundo.superficie).toBe(3108)
    expect(segundo.capacidadTratamiento).toContain('140')
  })
  it('coordinates are within CDMX bounds', () => {
    humedales.forEach(h => {
      expect(h.lat).toBeGreaterThan(19.0)
      expect(h.lat).toBeLessThan(20.0)
      expect(h.lng).toBeGreaterThan(-99.5)
      expect(h.lng).toBeLessThan(-98.5)
    })
  })
})

describe('Data Integrity — KPIs', () => {
  it('has 6 KPIs', () => {
    expect(kpis).toHaveLength(6)
  })
  it('all have label, valor, color', () => {
    kpis.forEach(k => {
      expect(k.label).toBeTruthy()
      expect(k.valor).toBeTruthy()
      expect(k.color).toBeTruthy()
    })
  })
  it('humedales count is 8', () => {
    const count = kpis.find(k => k.label.includes('inventariados'))
    expect(count?.valor).toBe('8')
  })
})

describe('Data Integrity — ODS Goals', () => {
  it('has 4 goals', () => {
    expect(odsGoals).toHaveLength(4)
  })
  it('covers ODS 6, 11, 13, 15', () => {
    const nums = odsGoals.map(o => o.numero).sort((a, b) => a - b)
    expect(nums).toEqual([6, 11, 13, 15])
  })
  it('all have humedalesRelacionados', () => {
    odsGoals.forEach(o => {
      expect(o.humedalesRelacionados.length).toBeGreaterThan(0)
    })
  })
  it('ODS 6 includes both Aragon entries', () => {
    const ods6 = odsGoals.find(o => o.numero === 6)!
    expect(ods6.humedalesRelacionados).toContain(3)
    expect(ods6.humedalesRelacionados).toContain(8)
  })
})

describe('Data Integrity — Hallazgos', () => {
  it('has 4 findings', () => {
    expect(hallazgos).toHaveLength(4)
  })
  it('all have recomendacion with acciones', () => {
    hallazgos.forEach(h => {
      expect(h.recomendacion).toBeTruthy()
      expect(h.recomendacion.acciones.length).toBeGreaterThan(0)
      expect(h.recomendacion.responsables.length).toBeGreaterThan(0)
    })
  })
  it('CIIEMAD only in hallazgo 1 responsables', () => {
    const withCiiemad = hallazgos.filter(h =>
      h.recomendacion.responsables.some(r => r.includes('CIIEMAD'))
    )
    expect(withCiiemad).toHaveLength(1)
    expect(withCiiemad[0].id).toBe(1)
  })
})

describe('Data Integrity — Comparativo Costos', () => {
  it('has 3 methods', () => {
    expect(comparativoCostos).toHaveLength(3)
  })
  it('includes humedal artificial', () => {
    expect(comparativoCostos.some(c => c.metodo === 'Humedal artificial')).toBe(true)
  })
})

describe('Data Integrity — Notihumedal', () => {
  it('has at least 3 articles', () => {
    expect(articulos.length).toBeGreaterThanOrEqual(3)
  })
  it('all have required fields', () => {
    articulos.forEach(a => {
      expect(a.slug).toBeTruthy()
      expect(a.titulo).toBeTruthy()
      expect(a.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(a.resumen).toBeTruthy()
      expect(a.contenido).toBeTruthy()
      expect(a.autor).toBeTruthy()
      expect(a.tags.length).toBeGreaterThan(0)
    })
  })
  it('all slugs are unique', () => {
    const slugs = articulos.map(a => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('Data Integrity — CMS Defaults', () => {
  it('has 3 pages', () => {
    expect(Object.keys(cmsDefaults)).toEqual(['home', 'sobre', 'analisis'])
  })
  it('home has 4 sections', () => {
    expect(Object.keys(cmsDefaults.home)).toEqual(['features', 'steps', 'tipologias', 'servicios'])
  })
  it('sobre has 3 sections', () => {
    expect(Object.keys(cmsDefaults.sobre)).toEqual(['objetivos', 'criterios', 'normativas'])
  })
  it('analisis has 1 section', () => {
    expect(Object.keys(cmsDefaults.analisis)).toEqual(['sections'])
  })
  it('all sections have non-empty arrays', () => {
    for (const [, sections] of Object.entries(cmsDefaults)) {
      for (const [, items] of Object.entries(sections)) {
        expect(Array.isArray(items)).toBe(true)
        expect(items.length).toBeGreaterThan(0)
      }
    }
  })
})
