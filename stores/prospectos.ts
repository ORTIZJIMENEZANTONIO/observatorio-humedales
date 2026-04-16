import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ProspectoHumedal {
  id: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  source: 'formulario' | 'ia_detector'
  createdAt: string
  notasAdmin?: string
  data: {
    nombre: string
    alcaldia: string
    ubicacion?: string
    tipoHumedal: string
    tipoVegetacion?: string[]
    funcionPrincipal: string
    superficie?: number | null
    volumen?: number | null
    anio?: string
    sustrato?: string
    vegetacion?: string
    documentoLink?: string
    documentoDescripcion?: string
    institucion?: string
    email?: string
  }
}

export const useProspectosStore = defineStore('prospectos', () => {
  const prospectos = ref<ProspectoHumedal[]>([])
  const loading = ref(false)

  const pendientes = computed(() => prospectos.value.filter(p => p.status === 'pendiente'))
  const aprobados = computed(() => prospectos.value.filter(p => p.status === 'aprobado'))
  const rechazados = computed(() => prospectos.value.filter(p => p.status === 'rechazado'))

  function byStatus(status: string) {
    return prospectos.value.filter(p => p.status === status)
  }

  function addProspecto(data: ProspectoHumedal['data'], source: ProspectoHumedal['source'] = 'formulario'): ProspectoHumedal {
    const maxId = prospectos.value.reduce((max, p) => Math.max(max, p.id), 0)
    const nuevo: ProspectoHumedal = {
      id: maxId + 1,
      status: 'pendiente',
      source,
      createdAt: new Date().toISOString(),
      data,
    }
    prospectos.value = [...prospectos.value, nuevo]
    return nuevo
  }

  function aprobar(id: number) {
    prospectos.value = prospectos.value.map(p =>
      p.id === id ? { ...p, status: 'aprobado' as const } : p
    )
  }

  function rechazar(id: number, notas: string) {
    prospectos.value = prospectos.value.map(p =>
      p.id === id ? { ...p, status: 'rechazado' as const, notasAdmin: notas } : p
    )
  }

  function setProspectos(items: ProspectoHumedal[]) {
    prospectos.value = items
  }

  return { prospectos, loading, pendientes, aprobados, rechazados, byStatus, addProspecto, aprobar, rechazar, setProspectos }
})
