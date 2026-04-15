<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import { cmsDefaults } from '~/data/cms-defaults'

const route = useRoute()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const pageSlug = route.params.pageSlug as string

const cmsStore = useCmsStore()

const pageTitles: Record<string, string> = {
  home: 'Inicio',
  sobre: 'Sobre',
  analisis: 'Analisis',
}

const sectionLabels: Record<string, string> = {
  features: 'Features principales',
  steps: 'Pasos del proceso',
  tipologias: 'Tipologias',
  servicios: 'Servicios ecosistemicos',
  objetivos: 'Objetivos',
  criterios: 'Criterios de sistematizacion',
  normativas: 'Marco normativo',
  sections: 'Secciones del hub',
}

const pageDefaults = cmsDefaults[pageSlug] || {}
const sectionKeys = Object.keys(pageDefaults)

const { available: backendAvailable, check: checkBackend } = useBackendStatus()
const expandedSection = ref<string | null>(sectionKeys[0] || null)
const editingItem = ref<{ section: string; index: number } | null>(null)
const editForm = reactive<Record<string, any>>({})
const saving = ref<string | null>(null) // sectionKey being saved
const lastSaved = ref<string | null>(null) // sectionKey last saved successfully

// ── Load from API ──
onMounted(async () => {
  cmsStore.initPage(pageSlug)
  const isOnline = await checkBackend()
  if (!isOnline) return
  for (const key of sectionKeys) {
    await cmsStore.fetchSection(pageSlug, key)
  }
})

// ── Reactive view into the store ──
function getSectionItems(sectionKey: string): any[] {
  return cmsStore.getSection(pageSlug, sectionKey)
}

// ── Auto-save a section to the backend ──
async function autoSave(sectionKey: string) {
  if (!backendAvailable.value) return
  saving.value = sectionKey
  lastSaved.value = null
  try {
    await apiFetch(`/observatory/${obs}/admin/cms/${pageSlug}/${sectionKey}`, {
      method: 'PUT',
      body: { items: getSectionItems(sectionKey) },
    })
    lastSaved.value = sectionKey
    setTimeout(() => { if (lastSaved.value === sectionKey) lastSaved.value = null }, 2000)
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar')
  }
  saving.value = null
}

// ── Edit flow ──
function startEdit(section: string, index: number) {
  editingItem.value = { section, index }
  const items = getSectionItems(section)
  Object.assign(editForm, JSON.parse(JSON.stringify(items[index])))
}

function cancelEdit() {
  editingItem.value = null
  Object.keys(editForm).forEach(k => delete editForm[k])
}

function applyEdit() {
  if (!editingItem.value) return
  const { section, index } = editingItem.value
  const items = [...getSectionItems(section)]
  items[index] = JSON.parse(JSON.stringify(editForm))
  cmsStore.setSection(pageSlug, section, items)
  cancelEdit()
  autoSave(section)
}

function moveItem(section: string, index: number, dir: -1 | 1) {
  const items = [...getSectionItems(section)]
  const newIndex = index + dir
  if (newIndex < 0 || newIndex >= items.length) return
  const temp = items[newIndex]
  items[newIndex] = items[index]
  items[index] = temp
  cmsStore.setSection(pageSlug, section, items)
  autoSave(section)
}

function getFieldKeys(section: string): string[] {
  const sample = pageDefaults[section]?.[0]
  return sample ? Object.keys(sample) : []
}

const fieldLabels: Record<string, string> = {
  title: 'Titulo',
  description: 'Descripcion',
  icon: 'Icono',
  to: 'Enlace',
  bg: 'Color de fondo',
  iconColor: 'Color de icono',
  examples: 'Ejemplos',
  badge: 'Badge texto',
  badgeClass: 'Color de badge',
  accentColor: 'Color de acento',
}

const colorFields = ['bg', 'iconColor', 'accentColor', 'badgeClass'] as const
type ColorField = typeof colorFields[number]

function isColorField(field: string): field is ColorField {
  return (colorFields as readonly string[]).includes(field)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/admin/contenido" class="mb-2 inline-flex items-center gap-1 text-sm text-slate-custom hover:text-primary">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
        Contenido
      </NuxtLink>
      <h2 class="text-2xl font-semibold text-ink">{{ pageTitles[pageSlug] || pageSlug }}</h2>
      <p class="mt-1 text-sm text-slate-custom">{{ sectionKeys.length }} secciones editables</p>
    </div>

    <div v-if="!backendAvailable" class="mb-4 flex items-center gap-3 rounded-2xl border border-alert/30 bg-alert/5 px-4 py-3">
      <svg class="h-5 w-5 shrink-0 text-alert" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <p class="text-sm text-alert-dark">Backend no disponible — los cambios no se pueden guardar. Inicie el backend para habilitar la edicion.</p>
    </div>

    <!-- Sections accordion -->
    <div class="space-y-3">
      <div v-for="sectionKey in sectionKeys" :key="sectionKey" class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <!-- Section header -->
        <button
          @click="expandedSection = expandedSection === sectionKey ? null : sectionKey"
          class="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 class="text-sm font-semibold text-ink">{{ sectionLabels[sectionKey] || sectionKey }}</h3>
            <p class="text-xs text-slate-custom">{{ getSectionItems(sectionKey).length }} items</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- Auto-save status indicator -->
            <span v-if="saving === sectionKey" class="flex items-center gap-1.5 text-xs text-ink-muted">
              <svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Guardando...
            </span>
            <span v-else-if="lastSaved === sectionKey" class="flex items-center gap-1.5 text-xs text-eco">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              Guardado
            </span>
            <svg class="h-5 w-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSection === sectionKey }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </button>

        <!-- Section items -->
        <div v-show="expandedSection === sectionKey" class="border-t border-gray-100">
          <div v-for="(item, idx) in getSectionItems(sectionKey)" :key="idx" class="border-b border-gray-50 last:border-0">
            <!-- Item display -->
            <div v-if="!(editingItem?.section === sectionKey && editingItem?.index === idx)" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-ink-muted">{{ idx + 1 }}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-ink truncate">{{ item.title || item.label || JSON.stringify(item).slice(0, 60) }}</p>
                <p v-if="item.description" class="text-xs text-slate-custom truncate">{{ item.description }}</p>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <button @click="moveItem(sectionKey, idx, -1)" :disabled="idx === 0 || !backendAvailable" class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-ink disabled:opacity-30">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button @click="moveItem(sectionKey, idx, 1)" :disabled="idx === getSectionItems(sectionKey).length - 1 || !backendAvailable" class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-ink disabled:opacity-30">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <button @click="startEdit(sectionKey, idx)" :disabled="!backendAvailable" class="rounded p-1 text-gray-400 hover:bg-primary-50 hover:text-primary disabled:opacity-30">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </div>

            <!-- Item edit form -->
            <div v-else class="bg-primary-50/30 p-5 space-y-3">
              <div v-for="field in getFieldKeys(sectionKey)" :key="field" class="form-group">
                <label class="form-label">{{ fieldLabels[field] || field }}</label>
                <textarea v-if="field === 'description'" v-model="editForm[field]" class="input" rows="2" />
                <AdminColorClassPicker
                  v-else-if="isColorField(field)"
                  v-model="editForm[field]"
                  :field="field"
                />
                <input v-else v-model="editForm[field]" type="text" class="input" />
              </div>
              <div class="flex items-center gap-2">
                <button @click="applyEdit" class="btn-primary btn-sm">Aplicar</button>
                <button @click="cancelEdit" class="btn-ghost btn-sm">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview link -->
    <div class="mt-6 text-center">
      <a :href="pageSlug === 'home' ? '/' : `/${pageSlug}`" target="_blank" class="btn-outline btn-sm">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        Ver pagina publica
      </a>
    </div>
  </div>
</template>
