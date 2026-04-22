<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import type { ProspectoNoticia } from '~/types'

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const store = useNotihumedalStore()
const { available: backendUp, check: checkBackend } = useBackendStatus()

// ── State ──
const activeTab = ref<'publicados' | 'prospectos'>('publicados')
const loading = ref(true)
const backendAvailable = ref(false)
const prospectos = ref<ProspectoNoticia[]>([])
const prospectosLoading = ref(false)
const prospectosFilter = ref<'pendiente' | 'aprobado' | 'rechazado'>('pendiente')

// ── Form state ──
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const editorRef = ref<any>(null)
const editorKey = ref(0)
const form = reactive({
  titulo: '',
  resumen: '',
  contenido: '',
  editorData: null as Record<string, any> | null,
  autor: '',
  fecha: new Date().toISOString().slice(0, 10),
  tags: '',
  imagen: '',
  fuenteImagen: '',
  url: '',
  fuente: '',
  visible: true,
  archivado: false,
})

// ── Preview state ──
const showPreview = ref(false)
const previewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const previewFrame = ref<HTMLIFrameElement | null>(null)

const previewContainerStyle = computed(() => {
  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' }
  return { maxWidth: widths[previewDevice.value], margin: '0 auto' }
})

function handlePreview() {
  const html = editorRef.value?.getPreviewHtml?.() || ''
  if (!html) return

  showPreview.value = true
  nextTick(() => {
    const iframe = previewFrame.value
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
      }
    }
  })
}

function resetForm() {
  form.titulo = ''
  form.resumen = ''
  form.contenido = ''
  form.editorData = null
  form.autor = 'Observatorio de Humedales Artificiales CDMX'
  form.fecha = new Date().toISOString().slice(0, 10)
  form.tags = ''
  form.imagen = ''
  form.fuenteImagen = ''
  form.url = ''
  form.fuente = ''
  form.visible = true
  form.archivado = false
  editingId.value = null
  editorKey.value++ // force re-mount editor
}

// ── Rejection state ──
const rejectingId = ref<number | null>(null)
const rejectNotes = ref('')

// ── Scraper state ──
const scraping = ref(false)

// ── Load published articles ──
async function loadArticulos() {
  loading.value = true
  backendAvailable.value = await checkBackend()
  if (backendAvailable.value) {
    try {
      const res = await apiFetch(`/observatory/${obs}/admin/notihumedal`)
      const items = (res as any).items || (res as any).data || []
      if (items.length) store.setArticulos(items)
    } catch { /* use store fallback */ }
  }
  loading.value = false
}

// ── Load prospectos ──
async function loadProspectos() {
  if (!backendAvailable.value) { prospectos.value = []; return }
  prospectosLoading.value = true
  try {
    const res = await apiFetch(`/observatory/${obs}/admin/notihumedal/prospectos?status=${prospectosFilter.value}`)
    prospectos.value = (res as any).items || (res as any).data || []
  } catch {
    prospectos.value = []
  }
  prospectosLoading.value = false
}

// ── CRUD ──
async function saveArticulo() {
  saving.value = true
  const editorOutput = editorRef.value?.getOutput?.() || { html: form.contenido, css: '', editorData: null }
  const body = {
    titulo: form.titulo,
    slug: form.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    resumen: form.resumen,
    contenido: editorOutput.html,
    autor: form.autor,
    fecha: form.fecha,
    tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    imagen: form.imagen || undefined,
    fuenteImagen: form.fuenteImagen || undefined,
    url: form.url || undefined,
    fuente: form.fuente || undefined,
    visible: form.visible,
    archivado: form.archivado,
  }
  try {
    if (backendAvailable.value) {
      if (editingId.value) {
        await apiFetch(`/observatory/${obs}/admin/notihumedal/${editingId.value}`, { method: 'PATCH', body: { ...body, css_content: editorOutput.css, editor_data: editorOutput.editorData } })
      } else {
        await apiFetch(`/observatory/${obs}/admin/notihumedal`, { method: 'POST', body: { ...body, css_content: editorOutput.css, editor_data: editorOutput.editorData } })
      }
      await loadArticulos()
    } else {
      if (editingId.value) {
        store.updateArticulo(editingId.value, body)
      } else {
        store.addArticulo(body)
      }
    }
    showForm.value = false
    resetForm()
  } catch {
    // API failed — save locally
    if (editingId.value) {
      store.updateArticulo(editingId.value, body)
    } else {
      store.addArticulo(body)
    }
    showForm.value = false
    resetForm()
  }
  saving.value = false
}

async function deleteArticulo(row: any) {
  if (!confirm(`¿Eliminar "${row.titulo}"?`)) return
  try {
    if (backendAvailable.value) {
      await apiFetch(`/observatory/${obs}/admin/notihumedal/${row.id}`, { method: 'DELETE' })
      await loadArticulos()
    } else {
      store.deleteArticulo(row.id)
    }
  } catch {
    store.deleteArticulo(row.id)
  }
}

function editArticulo(row: any) {
  editingId.value = row.id
  form.titulo = row.titulo
  form.resumen = row.resumen
  form.contenido = row.contenido || ''
  form.editorData = row.editor_data || null
  form.autor = row.autor
  form.fecha = row.fecha
  form.tags = Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || '')
  form.imagen = row.imagen || ''
  form.fuenteImagen = row.fuenteImagen || ''
  form.url = row.url || ''
  form.fuente = row.fuente || ''
  form.visible = row.visible ?? true
  form.archivado = row.archivado ?? false
  editorKey.value++ // force re-mount with new content
  showForm.value = true
}

// ── Approval flow ──
async function aprobarProspecto(prospecto: ProspectoNoticia) {
  // Pre-fill form with prospecto data and switch to create mode
  editingId.value = null
  form.titulo = prospecto.titulo
  form.resumen = prospecto.resumen
  form.contenido = `<p>${prospecto.resumen}</p><p><strong>Fuente:</strong> <a href="${prospecto.url}" target="_blank" rel="noopener noreferrer">${prospecto.fuente}</a></p>`
  form.autor = prospecto.fuente
  form.fecha = prospecto.fecha
  form.tags = prospecto.fuente
  form.imagen = ''

  try {
    await apiFetch(`/observatory/${obs}/admin/notihumedal/prospectos/${prospecto.id}/aprobar`, { method: 'POST' })
    await loadProspectos()
  } catch { /* fallback: just show form */ }

  activeTab.value = 'publicados'
  showForm.value = true
}

function startReject(id: number) {
  rejectingId.value = id
  rejectNotes.value = ''
}

async function confirmReject() {
  if (!rejectingId.value) return
  try {
    await apiFetch(`/observatory/${obs}/admin/notihumedal/prospectos/${rejectingId.value}/rechazar`, {
      method: 'POST',
      body: { notas: rejectNotes.value },
    })
    await loadProspectos()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al rechazar')
  }
  rejectingId.value = null
}

// ── Scraper manual ──
async function runScraper() {
  if (!backendAvailable.value) return
  scraping.value = true
  try {
    await apiFetch(`/observatory/${obs}/admin/notihumedal/scraper/run`, { method: 'POST' })
    await loadProspectos()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al ejecutar el scraper.')
  }
  scraping.value = false
}

// ── Table columns ──
// ── Advanced article filters ──
const advFilter = reactive({ tag: '', visibilidad: '', archivo: '' })
const hasAdvFilters = computed(() => Object.values(advFilter).some(v => !!v))
function clearAdvFilters() { Object.assign(advFilter, { tag: '', visibilidad: '', archivo: '' }) }

const articuloColumns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'titulo', label: 'Titulo' },
  { key: 'autor', label: 'Autor' },
  { key: 'fecha', label: 'Fecha', class: 'w-28' },
  { key: 'tags', label: 'Tags' },
  { key: 'visible', label: 'Visible', class: 'w-20 text-center' },
  { key: 'archivado', label: 'Archivado', class: 'w-20 text-center' },
]

async function toggleVisible(row: any) {
  const newVal = !(row.visible ?? true)
  store.updateArticulo(row.id, { visible: newVal })
  if (backendAvailable.value) {
    try { await apiFetch(`/observatory/${obs}/admin/notihumedal/${row.id}`, { method: 'PATCH', body: { visible: newVal } }) } catch {}
  }
}

async function toggleArchivado(row: any) {
  const newVal = !row.archivado
  store.updateArticulo(row.id, { archivado: newVal })
  if (backendAvailable.value) {
    try { await apiFetch(`/observatory/${obs}/admin/notihumedal/${row.id}`, { method: 'PATCH', body: { archivado: newVal } }) } catch {}
  }
}

// ── Computed rows ──
const articuloRows = computed(() => {
  return store.articulos.filter(a => {
    if (advFilter.tag && !(a.tags || []).includes(advFilter.tag)) return false
    if (advFilter.visibilidad === 'visible' && (a.visible === false)) return false
    if (advFilter.visibilidad === 'oculto' && (a.visible !== false)) return false
    if (advFilter.archivo === 'activo' && a.archivado) return false
    if (advFilter.archivo === 'archivado' && !a.archivado) return false
    return true
  }).map(a => ({
    ...a,
    tags: Array.isArray(a.tags) ? a.tags.join(', ') : a.tags,
  }))
})

// ── Init ──
onMounted(() => {
  loadArticulos()
})

watch(prospectosFilter, () => loadProspectos())
watch(activeTab, (tab) => {
  if (tab === 'prospectos' && prospectos.value.length === 0) loadProspectos()
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-ink">Notihumedal</h2>
      <p class="mt-1 text-sm text-slate-custom">Gestion de articulos publicados y prospectos de noticias scrapeadas</p>
    </div>

    <!-- Offline banner -->
    <div v-if="!loading && !backendAvailable" class="mb-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3">
      <svg class="h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p class="text-sm text-accent-dark">Modo local — mostrando datos del store. Los cambios se aplican localmente. Conecte el backend para sincronizar con el servidor.</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 w-fit">
      <button
        @click="activeTab = 'publicados'"
        :class="activeTab === 'publicados' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:bg-gray-50'"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
      >
        Articulos publicados
      </button>
      <button
        @click="activeTab = 'prospectos'"
        :class="activeTab === 'prospectos' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:bg-gray-50'"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
      >
        Prospectos scrapeados
      </button>
    </div>

    <!-- Tab 1: Articulos publicados -->
    <div v-show="activeTab === 'publicados'">
      <!-- Add button -->
      <div class="mb-4 flex items-center justify-between">
        <button
          @click="showForm ? (showForm = false, resetForm()) : (resetForm(), showForm = true)"
          class="btn-primary btn-sm"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {{ showForm ? 'Cancelar' : 'Nuevo articulo' }}
        </button>
      </div>

      <!-- Fullscreen editor (like Axend CrmTemplateForm) -->
      <Transition name="fade">
        <div v-if="showForm" class="notihumedal-editor-fullscreen">
          <!-- Toolbar (like CrmTemplateForm toolbar) -->
          <div class="notihumedal-editor-toolbar">
            <button @click="showForm = false; resetForm()" class="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Cerrar editor">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <span class="text-sm font-semibold text-white">{{ editingId ? 'Editar articulo' : 'Nuevo articulo' }}</span>
            <div class="flex-1" />
            <button @click="showForm = false; resetForm()" class="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors">
              Cancelar
            </button>
            <button @click="handlePreview" class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors" title="Vista previa en distintos dispositivos">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Previsualizar
            </button>
            <button @click="saveArticulo" class="flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/25 transition-colors disabled:opacity-40" :disabled="saving || !form.titulo || !form.resumen">
              <svg v-if="saving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Publicar') }}
            </button>
          </div>

          <!-- Form fields with labels -->
          <div class="notihumedal-editor-fields">
            <div class="grid grid-cols-[1fr_180px_140px_180px] gap-x-3 gap-y-1 items-end">
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Titulo *</label>
                <input v-model="form.titulo" type="text" class="input !py-1.5 text-sm" placeholder="Titulo del articulo" />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Autor</label>
                <input v-model="form.autor" type="text" class="input !py-1.5 text-sm" placeholder="Nombre o fuente" />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Fecha</label>
                <input v-model="form.fecha" type="date" class="input !py-1.5 text-sm" />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Tags</label>
                <input v-model="form.tags" type="text" class="input !py-1.5 text-sm" placeholder="UNAM, SEDEMA..." />
              </div>
            </div>
            <div class="mt-2 grid grid-cols-[1fr_1fr_280px] gap-x-3 gap-y-1 items-end">
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Resumen *</label>
                <input v-model="form.resumen" type="text" class="input !py-1.5 text-sm" placeholder="Resumen breve del articulo" />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">URL fuente original</label>
                <input v-model="form.url" type="url" class="input !py-1.5 text-sm" placeholder="https://scielo.org.mx/..." />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Fuente</label>
                <input v-model="form.fuente" type="text" class="input !py-1.5 text-sm" placeholder="UNAM, SciELO, CONABIO..." />
              </div>
            </div>
            <div class="mt-2 grid grid-cols-[1fr_200px_200px_auto_auto] gap-x-3 gap-y-1 items-end">
              <div class="flex items-end gap-3">
                <div class="flex-1">
                  <label class="text-[11px] font-medium text-ink-muted">Imagen (ruta o URL)</label>
                  <input v-model="form.imagen" type="text" class="input !py-1.5 text-sm" placeholder="/images/humedales/... o https://..." />
                </div>
                <img v-if="form.imagen" :src="form.imagen" alt="" class="h-8 w-12 shrink-0 rounded object-cover border border-gray-200" @error="($event.target as HTMLImageElement).style.display='none'" />
              </div>
              <div>
                <label class="text-[11px] font-medium text-ink-muted">Crédito imagen</label>
                <input v-model="form.fuenteImagen" type="text" class="input !py-1.5 text-sm" placeholder="Gobierno CDMX, UNAM..." />
              </div>
              <div class="flex items-center gap-4 pb-0.5">
                <label class="inline-flex items-center gap-1.5 text-[11px]">
                  <input type="checkbox" v-model="form.visible" class="checkbox !h-3.5 !w-3.5" />
                  <span class="font-medium" :class="form.visible ? 'text-eco' : 'text-gray-400'">Visible</span>
                </label>
                <label class="inline-flex items-center gap-1.5 text-[11px]">
                  <input type="checkbox" v-model="form.archivado" class="checkbox !h-3.5 !w-3.5" />
                  <span class="font-medium" :class="form.archivado ? 'text-accent' : 'text-gray-400'">Archivado</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Editor fills remaining space -->
          <div class="notihumedal-editor-canvas">
            <ClientOnly>
              <AdminArticleEditor
                ref="editorRef"
                :key="editorKey"
                :html-content="form.contenido"
                :editor-data="form.editorData"
              />
              <template #fallback>
                <div class="flex h-full items-center justify-center bg-gray-50">
                  <div class="flex flex-col items-center gap-3">
                    <div class="animate-spin-smooth h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
                    <p class="text-sm text-ink-muted">Cargando editor visual...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </Transition>

      <!-- Table -->
      <AdminDataTable
        :columns="articuloColumns"
        :rows="articuloRows"
        :loading="loading"
        search-placeholder="Buscar articulos..."
        @edit="editArticulo"
        @delete="deleteArticulo"
      >
        <template #filters>
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <select v-model="advFilter.tag" class="select !py-1.5 text-xs max-w-[180px]">
              <option value="">Todos los tags</option>
              <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
            <select v-model="advFilter.visibilidad" class="select !py-1.5 text-xs max-w-[140px]">
              <option value="">Visibilidad: todos</option>
              <option value="visible">Solo visibles</option>
              <option value="oculto">Solo ocultos</option>
            </select>
            <select v-model="advFilter.archivo" class="select !py-1.5 text-xs max-w-[140px]">
              <option value="">Archivo: todos</option>
              <option value="activo">Solo activos</option>
              <option value="archivado">Solo archivados</option>
            </select>
            <button v-if="hasAdvFilters" @click="clearAdvFilters" class="btn-ghost !py-1 text-xs">Limpiar filtros</button>
          </div>
        </template>
        <template #cell-tags="{ value }">
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in (value || '').split(',')" :key="tag" class="badge-primary text-[10px]">{{ tag.trim() }}</span>
          </div>
        </template>
        <template #cell-visible="{ row }">
          <button
            @click.stop="toggleVisible(row)"
            class="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            :class="(row.visible ?? true) ? 'text-eco hover:bg-eco/10' : 'text-gray-300 hover:bg-gray-100'"
            :title="(row.visible ?? true) ? 'Visible — clic para ocultar' : 'Oculto — clic para mostrar'"
          >
            <svg v-if="row.visible ?? true" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          </button>
        </template>
        <template #cell-archivado="{ row }">
          <button
            @click.stop="toggleArchivado(row)"
            class="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            :class="row.archivado ? 'text-accent hover:bg-accent/10' : 'text-gray-300 hover:bg-gray-100'"
            :title="row.archivado ? 'Archivado — clic para restaurar' : 'Activo — clic para archivar'"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </button>
        </template>
      </AdminDataTable>
    </div>

    <!-- Tab 2: Prospectos scrapeados -->
    <div v-show="activeTab === 'prospectos'">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <select v-model="prospectosFilter" class="select max-w-[200px]">
          <option value="pendiente">Pendientes</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
        </select>

        <button @click="runScraper" class="btn-outline btn-sm ml-auto" :disabled="scraping || !backendAvailable" :title="!backendAvailable ? 'Requiere conexion con el backend' : ''">
          <svg v-if="scraping" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ scraping ? 'Scrapeando...' : 'Ejecutar scraper' }}
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="!prospectosLoading && prospectos.length === 0" class="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="mt-3 text-sm font-medium text-ink">Sin prospectos {{ prospectosFilter === 'pendiente' ? 'pendientes' : prospectosFilter === 'aprobado' ? 'aprobados' : 'rechazados' }}</p>
        <p class="mt-1 text-xs text-slate-custom">El scraper diario (23:50) busca noticias sobre humedales artificiales en Mexico. Tambien puede ejecutarlo manualmente.</p>
      </div>

      <!-- Prospectos list -->
      <div v-else class="space-y-3">
        <div v-if="prospectosLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
            <div class="h-4 w-3/4 rounded bg-gray-200" />
            <div class="mt-2 h-3 w-1/2 rounded bg-gray-200" />
          </div>
        </div>

        <div v-for="p in prospectos" :key="p.id" class="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-semibold text-ink">{{ p.titulo }}</h4>
              <p class="mt-1 text-xs text-slate-custom line-clamp-2">{{ p.resumen }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <span class="font-medium">{{ p.fuente }}</span>
                <span>{{ p.fecha }}</span>
                <a :href="p.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline truncate max-w-[200px]">{{ p.url }}</a>
              </div>
              <p v-if="p.notasRechazo" class="mt-2 text-xs text-alert">Motivo: {{ p.notasRechazo }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <span v-if="p.estado === 'aprobado'" class="badge-eco">Aprobado</span>
              <span v-else-if="p.estado === 'rechazado'" class="badge-alert">Rechazado</span>
              <template v-else>
                <button @click="aprobarProspecto(p)" class="btn-eco btn-sm">Aprobar</button>
                <button @click="startReject(p.id)" class="btn-outline btn-sm text-alert hover:!bg-alert/5">Rechazar</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Dialog (adapted from Axend CrmTemplateForm) -->
    <Transition name="fade">
      <div v-if="showPreview" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click.self="showPreview = false">
        <div class="flex h-[90vh] w-full max-w-[900px] flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
          <!-- Preview header -->
          <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
            <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span class="text-sm font-semibold text-ink">Vista previa del articulo</span>
            <div class="mx-auto flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              <button
                @click="previewDevice = 'desktop'; handlePreview()"
                :class="previewDevice === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-ink-muted hover:text-ink'"
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                title="Escritorio (100%)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              </button>
              <button
                @click="previewDevice = 'tablet'; handlePreview()"
                :class="previewDevice === 'tablet' ? 'bg-white shadow-sm text-primary' : 'text-ink-muted hover:text-ink'"
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                title="Tablet (768px)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              </button>
              <button
                @click="previewDevice = 'mobile'; handlePreview()"
                :class="previewDevice === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-ink-muted hover:text-ink'"
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                title="Movil (375px)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              </button>
            </div>
            <button @click="showPreview = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors" title="Cerrar">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <!-- Preview body -->
          <div class="flex-1 overflow-auto bg-gray-100 p-6">
            <div :style="previewContainerStyle" class="transition-all duration-300">
              <iframe
                ref="previewFrame"
                class="h-full min-h-[500px] w-full rounded-xl border border-gray-200 bg-white shadow-sm"
                style="height: 70vh;"
                sandbox="allow-same-origin"
                frameborder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reject modal -->
    <Transition name="fade">
      <div v-if="rejectingId" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click.self="rejectingId = null">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-base font-semibold text-ink">Rechazar prospecto</h3>
          <p class="mt-1 text-sm text-slate-custom">Este prospecto no volvera a aparecer en la cola.</p>
          <div class="mt-4 form-group">
            <label class="form-label">Motivo del rechazo</label>
            <textarea v-model="rejectNotes" class="input" rows="3" placeholder="No es relevante, duplicado, fuente no confiable..." />
          </div>
          <div class="mt-4 flex items-center justify-end gap-3">
            <button @click="rejectingId = null" class="btn-ghost">Cancelar</button>
            <button @click="confirmReject" class="btn bg-alert text-white hover:bg-alert-dark">Rechazar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Fullscreen editor layout (like Axend CrmTemplateForm) */
.notihumedal-editor-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* Toolbar: primary color bar at top */
.notihumedal-editor-toolbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0D6B7E;
  flex-wrap: wrap;
}

/* Compact fields row */
.notihumedal-editor-fields {
  flex: 0 0 auto;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

/* Editor fills all remaining space */
.notihumedal-editor-canvas {
  flex: 1 1 auto;
  overflow: hidden;
}

/* Override editor component height to fill parent */
.notihumedal-editor-canvas :deep(.article-editor) {
  border: none;
  border-radius: 0;
  height: 100%;
}
.notihumedal-editor-canvas :deep(.editor-canvas) {
  height: 100%;
}
</style>
