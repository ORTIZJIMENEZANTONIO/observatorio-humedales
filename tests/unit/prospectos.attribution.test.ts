import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProspectosStore } from '~/stores/prospectos'

describe('Prospectos Store — Atribución', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('addProspecto crea un prospecto sin contributorId', () => {
    const store = useProspectosStore()
    const p = store.addProspecto({
      nombre: 'Humedal de prueba',
      alcaldia: 'Coyoacán',
      tipoHumedal: 'ha_fws',
      funcionPrincipal: 'Tratamiento + recreación',
    })
    expect(p.id).toBeGreaterThan(0)
    expect(p.contributorId).toBeUndefined()
    expect(p.status).toBe('pendiente')
    expect(p.source).toBe('formulario')
  })

  it('asignarContributor vincula un prospecto con un contribuyente', () => {
    const store = useProspectosStore()
    const p = store.addProspecto({
      nombre: 'Humedal X',
      alcaldia: 'Tlalpan',
      tipoHumedal: 'ha_sfs_horizontal',
      funcionPrincipal: 'Investigación',
    })
    store.asignarContributor(p.id, 7)
    const updated = store.prospectos.find(x => x.id === p.id)!
    expect(updated.contributorId).toBe(7)
  })

  it('asignarContributor con null desvincula', () => {
    const store = useProspectosStore()
    const p = store.addProspecto({
      nombre: 'Humedal Y',
      alcaldia: 'Iztapalapa',
      tipoHumedal: 'ha_hibrido',
      funcionPrincipal: 'Educativo',
    })
    store.asignarContributor(p.id, 3)
    expect(store.prospectos.find(x => x.id === p.id)!.contributorId).toBe(3)
    store.asignarContributor(p.id, null)
    expect(store.prospectos.find(x => x.id === p.id)!.contributorId).toBeNull()
  })

  it('aprobar mantiene la atribución (no la borra)', () => {
    const store = useProspectosStore()
    const p = store.addProspecto({
      nombre: 'Humedal Z',
      alcaldia: 'Xochimilco',
      tipoHumedal: 'ha_fws',
      funcionPrincipal: 'Conservación',
    })
    store.asignarContributor(p.id, 42)
    store.aprobar(p.id)
    const final = store.prospectos.find(x => x.id === p.id)!
    expect(final.status).toBe('aprobado')
    expect(final.contributorId).toBe(42)
  })

  it('rechazar también mantiene la atribución (auditoría)', () => {
    const store = useProspectosStore()
    const p = store.addProspecto({
      nombre: 'Humedal W',
      alcaldia: 'Cuauhtémoc',
      tipoHumedal: 'ha_fws',
      funcionPrincipal: 'Demo',
    })
    store.asignarContributor(p.id, 11)
    store.rechazar(p.id, 'Sin evidencia')
    const final = store.prospectos.find(x => x.id === p.id)!
    expect(final.status).toBe('rechazado')
    expect(final.contributorId).toBe(11)
    expect(final.notasAdmin).toBe('Sin evidencia')
  })

  it('byStatus filtra correctamente prospectos con atribución', () => {
    const store = useProspectosStore()
    store.addProspecto({ nombre: 'A', alcaldia: 'A', tipoHumedal: 'ha_fws', funcionPrincipal: 'A' })
    store.addProspecto({ nombre: 'B', alcaldia: 'B', tipoHumedal: 'ha_fws', funcionPrincipal: 'B' })
    store.aprobar(1)
    expect(store.byStatus('pendiente').length).toBe(1)
    expect(store.byStatus('aprobado').length).toBe(1)
  })
})
