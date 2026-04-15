<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import { cmsDefaults } from '~/data/cms-defaults'

const route = useRoute()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const pageSlug = route.params.pageSlug as string

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
const sections = reactive<Record<string, any[]>>({})
const expandedSection = ref<string | null>(sectionKeys[0] || null)
const editingItem = ref<{ section: string; index: number } | null>(null)
const editForm = reactive<Record<string, any>>({})
const saving = ref(false)

// Load sections from API or defaults
onMounted(async () => {
  for (const key of sectionKeys) {
    sections[key] = [...pageDefaults[key]]
  }
  const isOnline = await checkBackend()
  if (!isOnline) return
  try {
    const res = await apiFetch(`/observatory/${obs}/admin/cms/${pageSlug}`)
    const data = (res as any).sections || (res as any).data
    if (data) {
      for (const [key, items] of Object.entries(data)) {
        if (Array.isArray(items) && items.length) sections[key] = items
      }
    }
  } catch { /* use defaults */ }
})

function startEdit(section: string, index: number) {
  editingItem.value = { section, index }
  Object.assign(editForm, JSON.parse(JSON.stringify(sections[section][index])))
}

function cancelEdit() {
  editingItem.value = null
  Object.keys(editForm).forEach(k => delete editForm[k])
}

function applyEdit() {
  if (!editingItem.value) return
  const { section, index } = editingItem.value
  sections[section][index] = JSON.parse(JSON.stringify(editForm))
  cancelEdit()
}

function moveItem(section: string, index: number, dir: -1 | 1) {
  const arr = sections[section]
  const newIndex = index + dir
  if (newIndex < 0 || newIndex >= arr.length) return
  const temp = arr[newIndex]
  arr[newIndex] = arr[index]
  arr[index] = temp
}

async function saveSection(sectionKey: string) {
  if (!backendAvailable.value) return
  saving.value = true
  try {
    await apiFetch(`/observatory/${obs}/admin/cms/${pageSlug}/${sectionKey}`, {
      method: 'PUT',
      body: { items: sections[sectionKey] },
    })
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar')
  }
  saving.value = false
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
  bg: 'Color de fondo (clase)',
  iconColor: 'Color de icono (clase)',
  examples: 'Ejemplos',
  badge: 'Badge texto',
  badgeClass: 'Badge clase',
  accentColor: 'Color acento (clase)',
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

    <div v-if="!backendAvailable" class="mb-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3">
      <svg class="h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p class="text-sm text-accent-dark">Modo offline — los cambios no se guardaran en el servidor.</p>
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
            <p class="text-xs text-slate-custom">{{ sections[sectionKey]?.length || 0 }} items</p>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="backendAvailable" @click.stop="saveSection(sectionKey)" class="btn-primary btn-sm" :disabled="saving">
              {{ saving ? '...' : 'Guardar' }}
            </button>
            <svg class="h-5 w-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSection === sectionKey }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </button>

        <!-- Section items -->
        <div v-show="expandedSection === sectionKey" class="border-t border-gray-100">
          <div v-for="(item, idx) in sections[sectionKey]" :key="idx" class="border-b border-gray-50 last:border-0">
            <!-- Item display -->
            <div v-if="!(editingItem?.section === sectionKey && editingItem?.index === idx)" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-ink-muted">{{ idx + 1 }}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-ink truncate">{{ item.title || item.label || JSON.stringify(item).slice(0, 60) }}</p>
                <p v-if="item.description" class="text-xs text-slate-custom truncate">{{ item.description }}</p>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <button @click="moveItem(sectionKey, idx, -1)" :disabled="idx === 0" class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-ink disabled:opacity-30">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button @click="moveItem(sectionKey, idx, 1)" :disabled="idx === sections[sectionKey].length - 1" class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-ink disabled:opacity-30">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <button @click="startEdit(sectionKey, idx)" class="rounded p-1 text-gray-400 hover:bg-primary-50 hover:text-primary">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </div>

            <!-- Item edit form -->
            <div v-else class="bg-primary-50/30 p-5 space-y-3">
              <div v-for="field in getFieldKeys(sectionKey)" :key="field" class="form-group">
                <label class="form-label">{{ fieldLabels[field] || field }}</label>
                <textarea v-if="field === 'description'" v-model="editForm[field]" class="input" rows="2" />
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
