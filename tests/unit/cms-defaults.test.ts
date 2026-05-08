import { describe, it, expect } from 'vitest'
import { cmsDefaults } from '~/data/cms-defaults'

describe('CMS Defaults', () => {
  it('contiene todas las páginas principales', () => {
    const expected = [
      'home', 'sobre', 'analisis',
      'inventario', 'mapa', 'notihumedal', 'registra', 'contributors',
      'analisis-indicadores', 'analisis-brecha', 'analisis-hallazgos',
      'footer',
    ]
    for (const slug of expected) {
      expect(cmsDefaults[slug], `falta página ${slug}`).toBeDefined()
    }
  })

  it('cada página tiene al menos una sección', () => {
    for (const [slug, sections] of Object.entries(cmsDefaults)) {
      const keys = Object.keys(sections)
      expect(keys.length, `${slug} sin secciones`).toBeGreaterThan(0)
    }
  })

  it('cada sección es un array no vacío', () => {
    for (const [slug, sections] of Object.entries(cmsDefaults)) {
      for (const [key, items] of Object.entries(sections)) {
        expect(Array.isArray(items), `${slug}/${key} no es array`).toBe(true)
        expect(items.length, `${slug}/${key} array vacío`).toBeGreaterThan(0)
      }
    }
  })

  it('hero sections tienen al menos title o subtitle', () => {
    for (const [slug, sections] of Object.entries(cmsDefaults)) {
      if (sections.hero) {
        for (const item of sections.hero) {
          const hasContent = item.title || item.subtitle
          expect(hasContent, `${slug}/hero sin contenido textual`).toBeTruthy()
        }
      }
    }
  })

  it('footer.quickLinks usa "to" para rutas internas', () => {
    const links = cmsDefaults.footer?.quickLinks
    expect(links).toBeDefined()
    for (const l of links!) {
      expect(l.to).toMatch(/^\//)
    }
  })

  it('footer.sources usa "href" con URL absoluta', () => {
    const sources = cmsDefaults.footer?.sources
    expect(sources).toBeDefined()
    for (const s of sources!) {
      expect(s.href).toMatch(/^https?:\/\//)
    }
  })
})
