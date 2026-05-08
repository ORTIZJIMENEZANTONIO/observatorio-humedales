<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import { cmsDefaults } from '~/data/cms-defaults'

const pageMeta: Record<string, { title: string; description: string; icon: string; group: string }> = {
  home: { title: 'Inicio', description: 'Hero, features, pasos, tipologías, servicios', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', group: 'Páginas principales' },
  sobre: { title: 'Sobre', description: 'Objetivos, criterios, marco normativo', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', group: 'Páginas principales' },
  analisis: { title: 'Análisis', description: 'Cards del hub: Indicadores, Brecha, Hallazgos', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', group: 'Páginas principales' },
  inventario: { title: 'Inventario', description: 'Hero y textos de ayuda del listado', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', group: 'Páginas principales' },
  mapa: { title: 'Mapa', description: 'Hero y leyenda del mapa', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3', group: 'Páginas principales' },
  notihumedal: { title: 'Notihumedal', description: 'Hero y mensaje sin artículos', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', group: 'Páginas principales' },
  registra: { title: 'Registra', description: 'Wizard de 3 pasos + mensaje de confirmación', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', group: 'Páginas principales' },
  contributors: { title: 'Contribuyentes', description: 'Hero e introducción a los modos', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', group: 'Páginas principales' },
  'analisis-indicadores': { title: 'Análisis · Indicadores', description: 'Hero y tabs de la página de indicadores', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z', group: 'Subpáginas de análisis' },
  'analisis-brecha': { title: 'Análisis · Brecha', description: 'Hero y metodología del índice', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3', group: 'Subpáginas de análisis' },
  'analisis-hallazgos': { title: 'Análisis · Hallazgos', description: 'Hero y CTA de política pública', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', group: 'Subpáginas de análisis' },
  footer: { title: 'Footer', description: 'Marca, fuentes, enlaces rápidos y aviso legal', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', group: 'Estructura' },
}

const pages = computed(() => Object.keys(cmsDefaults).map(slug => {
  const meta = pageMeta[slug] || { title: slug, description: '', icon: '', group: 'Otros' }
  const sectionCount = Object.keys(cmsDefaults[slug] || {}).length
  return { slug, ...meta, sections: sectionCount }
}))

const groups = computed(() => {
  const map: Record<string, typeof pages.value> = {}
  for (const p of pages.value) {
    if (!map[p.group]) map[p.group] = []
    map[p.group].push(p)
  }
  return map
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-ink">Contenido editorial</h2>
      <p class="mt-1 text-sm text-slate-custom">
        Edita los textos, listas y enlaces de las páginas públicas. Los datos numéricos
        del inventario (humedales, hallazgos, artículos) se gestionan en sus pestañas dedicadas
        del menú lateral; aquí editas el copy editorial.
      </p>
    </div>

    <div v-for="(items, group) in groups" :key="group" class="mb-8">
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">{{ group }}</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="page in items" :key="page.slug" :to="`/admin/contenido/${page.slug}`" class="card-interactive p-5 group">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="page.icon" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-base font-semibold text-ink group-hover:text-primary transition-colors">{{ page.title }}</h4>
              <p class="mt-1 text-sm text-slate-custom">{{ page.description }}</p>
              <p class="mt-2 text-xs text-ink-muted">{{ page.sections }} {{ page.sections === 1 ? 'sección' : 'secciones' }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
