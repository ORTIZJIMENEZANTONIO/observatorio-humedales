<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const route = useRoute()
const router = useRouter()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const store = useHallazgosStore()
const { check: checkBackend } = useBackendStatus()

const isNew = computed(() => route.params.id === 'nuevo')
const hallazgoId = computed(() => isNew.value ? null : Number(route.params.id))
const saving = ref(false)
const isOnline = ref(false)

const form = reactive({
  titulo: '',
  descripcion: '',
  impacto: 'medio' as string,
  evidencia: '' as string,
  visible: true,
  archivado: false,
  recomendacion: {
    titulo: '',
    descripcion: '',
    plazo: 'mediano' as string,
    acciones: '' as string,
    responsables: '' as string,
    costoEstimado: '',
  },
})

onMounted(async () => {
  isOnline.value = await checkBackend()
  if (!isNew.value && hallazgoId.value) {
    const h = store.hallazgos.find(x => x.id === hallazgoId.value)
    if (h) {
      Object.assign(form, {
        titulo: h.titulo,
        descripcion: h.descripcion,
        impacto: h.impacto,
        evidencia: (h.evidencia || []).join('\n'),
        visible: h.visible ?? true,
        archivado: h.archivado ?? false,
        recomendacion: {
          titulo: h.recomendacion?.titulo || '',
          descripcion: h.recomendacion?.descripcion || '',
          plazo: h.recomendacion?.plazo || 'mediano',
          acciones: (h.recomendacion?.acciones || []).join('\n'),
          responsables: (h.recomendacion?.responsables || []).join(', '),
          costoEstimado: h.recomendacion?.costoEstimado || '',
        },
      })
    }
  }
})

function formToBody() {
  return {
    titulo: form.titulo,
    descripcion: form.descripcion,
    impacto: form.impacto as any,
    evidencia: form.evidencia ? form.evidencia.split('\n').map(s => s.trim()).filter(Boolean) : [],
    visible: form.visible,
    archivado: form.archivado,
    recomendacion: {
      titulo: form.recomendacion.titulo,
      descripcion: form.recomendacion.descripcion,
      plazo: form.recomendacion.plazo as any,
      acciones: form.recomendacion.acciones ? form.recomendacion.acciones.split('\n').map(s => s.trim()).filter(Boolean) : [],
      responsables: form.recomendacion.responsables ? form.recomendacion.responsables.split(',').map(s => s.trim()).filter(Boolean) : [],
      costoEstimado: form.recomendacion.costoEstimado || undefined,
    },
  }
}

async function save() {
  saving.value = true
  const body = formToBody()
  try {
    if (isOnline.value) {
      if (hallazgoId.value) {
        await apiFetch(`/observatory/${obs}/admin/hallazgos/${hallazgoId.value}`, { method: 'PATCH', body })
      } else {
        await apiFetch(`/observatory/${obs}/admin/hallazgos`, { method: 'POST', body })
      }
    } else {
      if (hallazgoId.value) {
        store.updateHallazgo(hallazgoId.value, body)
      } else {
        store.addHallazgo(body)
      }
    }
    router.push('/admin/hallazgos')
  } catch {
    if (hallazgoId.value) {
      store.updateHallazgo(hallazgoId.value, body)
    } else {
      store.addHallazgo(body)
    }
    router.push('/admin/hallazgos')
  }
  saving.value = false
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button @click="router.push('/admin/hallazgos')" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 class="text-xl sm:text-2xl font-semibold text-ink">{{ isNew ? 'Nuevo hallazgo' : 'Editar hallazgo' }}</h2>
          <p v-if="!isNew" class="mt-0.5 text-sm text-slate-custom">ID: {{ hallazgoId }}</p>
        </div>
      </div>
      <span v-if="!isOnline" class="badge bg-accent/10 text-accent-dark text-xs">modo local</span>
    </div>

    <form @submit.prevent="save" class="space-y-8">
      <!-- ═══ Hallazgo ═══ -->
      <div class="panel">
        <div class="flex items-center gap-2 mb-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-alert/10">
            <svg class="h-4 w-4 text-alert" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h3 class="text-base font-semibold text-ink">Hallazgo</h3>
        </div>

        <div class="space-y-4">
          <div class="form-group">
            <label class="form-label">Título <span class="text-alert">*</span></label>
            <input v-model="form.titulo" class="input w-full" required placeholder="Ej: Ausencia de monitoreo estandarizado" />
          </div>

          <div class="form-group">
            <label class="form-label">Descripción <span class="text-alert">*</span></label>
            <textarea v-model="form.descripcion" class="input w-full" rows="4" required placeholder="Descripción detallada del hallazgo..." />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nivel de impacto <span class="text-alert">*</span></label>
              <select v-model="form.impacto" class="select w-full">
                <option value="critico">Crítico</option>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Evidencia</label>
            <textarea v-model="form.evidencia" class="input w-full" rows="5" placeholder="Una evidencia por línea:&#10;Solo 2 de 8 humedales cuentan con datos cuantitativos.&#10;No existe un protocolo común de medición.&#10;..." />
            <p class="form-hint">Una evidencia por línea. Cada línea se muestra como un punto en la página pública.</p>
          </div>

          <!-- Visibilidad y archivo -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Visibilidad</label>
              <label class="checkbox-label mt-1 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="form.visible" class="checkbox" />
                Visible en la página pública
              </label>
              <p class="form-hint">Si se desactiva, el hallazgo no aparecerá en /analisis/hallazgos</p>
            </div>
            <div class="form-group">
              <label class="form-label">Archivo</label>
              <label class="checkbox-label mt-1 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="form.archivado" class="checkbox" />
                Archivado
              </label>
              <p class="form-hint">Los registros archivados se conservan pero no se muestran públicamente</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Recomendación ═══ -->
      <div class="panel">
        <div class="flex items-center gap-2 mb-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-eco/10">
            <svg class="h-4 w-4 text-eco" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 class="text-base font-semibold text-ink">Recomendación asociada</h3>
        </div>

        <div class="space-y-4">
          <div class="form-group">
            <label class="form-label">Título <span class="text-alert">*</span></label>
            <input v-model="form.recomendacion.titulo" class="input w-full" required placeholder="Ej: Implementar protocolo de monitoreo estandarizado" />
          </div>

          <div class="form-group">
            <label class="form-label">Descripción <span class="text-alert">*</span></label>
            <textarea v-model="form.recomendacion.descripcion" class="input w-full" rows="3" required placeholder="Descripción de la recomendación..." />
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Plazo <span class="text-alert">*</span></label>
              <select v-model="form.recomendacion.plazo" class="select w-full">
                <option value="corto">Corto plazo</option>
                <option value="mediano">Mediano plazo</option>
                <option value="largo">Largo plazo</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Costo estimado</label>
              <input v-model="form.recomendacion.costoEstimado" class="input w-full" placeholder="$500,000 – $1,500,000 MXN" />
            </div>
            <div class="form-group">
              <label class="form-label">Responsables</label>
              <input v-model="form.recomendacion.responsables" class="input w-full" placeholder="SEDEMA, IPN, CONAGUA..." />
              <p class="form-hint">Separados por coma</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Acciones propuestas</label>
            <textarea v-model="form.recomendacion.acciones" class="input w-full" rows="5" placeholder="Una acción por línea:&#10;Definir parámetros mínimos obligatorios.&#10;Establecer frecuencia de muestreo trimestral.&#10;Crear plataforma de datos abiertos.&#10;..." />
            <p class="form-hint">Una acción por línea. Cada línea se muestra como un punto con checkmark en la página pública.</p>
          </div>
        </div>
      </div>

      <!-- ═══ Actions ═══ -->
      <div class="flex items-center justify-between border-t border-gray-200 pt-6">
        <button type="button" @click="router.push('/admin/hallazgos')" class="btn-ghost">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Cancelar
        </button>
        <button type="submit" class="btn-primary" :disabled="saving || !form.titulo || !form.descripcion || !form.recomendacion.titulo">
          <svg v-if="saving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          {{ saving ? 'Guardando...' : (isNew ? 'Crear hallazgo' : 'Guardar cambios') }}
        </button>
      </div>
    </form>
  </div>
</template>
