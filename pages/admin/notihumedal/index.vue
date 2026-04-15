<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import type { ArticuloNotihumedal, ProspectoNoticia } from '~/types'
import { articulos as localArticulos } from '~/data/notihumedal'

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string

// ── State ──
const activeTab = ref<'publicados' | 'prospectos'>('publicados')
const loading = ref(true)
const backendAvailable = ref(false)
const items = ref<ArticuloNotihumedal[]>([])
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
})

function resetForm() {
  form.titulo = ''
  form.resumen = ''
  form.contenido = ''
  form.editorData = null
  form.autor = 'Observatorio de Humedales Artificiales CDMX'
  form.fecha = new Date().toISOString().slice(0, 10)
  form.tags = ''
  form.imagen = ''
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
  try {
    const res = await apiFetch(`/observatory/${obs}/admin/notihumedal`)
    items.value = (res as any).items || (res as any).data || []
    backendAvailable.value = true
  } catch {
    items.value = [...localArticulos]
    backendAvailable.value = false
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
    css_content: editorOutput.css,
    editor_data: editorOutput.editorData,
    autor: form.autor,
    fecha: form.fecha,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    imagen: form.imagen || undefined,
  }
  try {
    if (editingId.value) {
      await apiFetch(`/observatory/${obs}/admin/notihumedal/${editingId.value}`, { method: 'PATCH', body })
    } else {
      await apiFetch(`/observatory/${obs}/admin/notihumedal`, { method: 'POST', body })
    }
    showForm.value = false
    resetForm()
    await loadArticulos()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar el articulo')
  }
  saving.value = false
}

async function deleteArticulo(row: any) {
  if (!confirm(`Eliminar "${row.titulo}"?`)) return
  try {
    await apiFetch(`/observatory/${obs}/admin/notihumedal/${row.id}`, { method: 'DELETE' })
    await loadArticulos()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al eliminar')
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
const articuloColumns = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'titulo', label: 'Titulo' },
  { key: 'autor', label: 'Autor' },
  { key: 'fecha', label: 'Fecha', class: 'w-28' },
  { key: 'tags', label: 'Tags' },
]

const prospectoColumns = [
  { key: 'titulo', label: 'Titulo' },
  { key: 'fuente', label: 'Fuente', class: 'w-32' },
  { key: 'fecha', label: 'Fecha', class: 'w-28' },
  { key: 'estado', label: 'Estado', class: 'w-28' },
]

// ── Computed rows ──
const articuloRows = computed(() => items.value.map(a => ({
  ...a,
  tags: Array.isArray(a.tags) ? a.tags.join(', ') : a.tags,
})))

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
      <p class="text-sm text-accent-dark">Modo offline — mostrando datos locales. Conecte el backend para habilitar CRUD y scraper.</p>
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

      <!-- Inline form -->
      <Transition name="slide-up">
        <div v-if="showForm" class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-4">
          <h3 class="text-base font-semibold text-ink">{{ editingId ? 'Editar articulo' : 'Nuevo articulo' }}</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Titulo *</label>
              <input v-model="form.titulo" type="text" class="input" placeholder="Titulo del articulo..." />
            </div>
            <div class="form-group">
              <label class="form-label">Autor</label>
              <input v-model="form.autor" type="text" class="input" placeholder="Nombre o fuente..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Resumen *</label>
            <textarea v-model="form.resumen" class="input" rows="2" placeholder="Resumen breve del articulo..." />
          </div>

          <div class="form-group">
            <label class="form-label">Contenido</label>
            <ClientOnly>
              <AdminArticleEditor
                ref="editorRef"
                :key="editorKey"
                :html-content="form.contenido"
                :editor-data="form.editorData"
              />
              <template #fallback>
                <div class="flex h-[600px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                  <p class="text-sm text-ink-muted">Cargando editor...</p>
                </div>
              </template>
            </ClientOnly>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Fecha</label>
              <input v-model="form.fecha" type="date" class="input" />
            </div>
            <div class="form-group">
              <label class="form-label">Tags (separados por coma)</label>
              <input v-model="form.tags" type="text" class="input" placeholder="UNAM, SEDEMA, aragon..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">URL de imagen (opcional)</label>
            <input v-model="form.imagen" type="url" class="input" placeholder="https://..." />
          </div>

          <div class="flex items-center gap-3">
            <button @click="saveArticulo" class="btn-primary" :disabled="saving || !form.titulo || !form.resumen">
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Publicar') }}
            </button>
            <button @click="showForm = false; resetForm()" class="btn-ghost">Cancelar</button>
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
        <template #cell-tags="{ value }">
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in (value || '').split(',')" :key="tag" class="badge-primary text-[10px]">{{ tag.trim() }}</span>
          </div>
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
