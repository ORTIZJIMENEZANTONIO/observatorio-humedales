<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const pages = [
  { slug: 'home', title: 'Inicio', description: 'Hero, features, pasos, tipologias, servicios ecosistemicos', sections: 4, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { slug: 'sobre', title: 'Sobre', description: 'Objetivos, criterios de sistematizacion, marco normativo', sections: 3, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { slug: 'analisis', title: 'Analisis', description: 'Cards del hub de analisis (Indicadores, Brecha, Hallazgos)', sections: 1, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-ink">Contenido de paginas</h2>
      <p class="mt-1 text-sm text-slate-custom">Edita el contenido de las secciones de las paginas publicas</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="page in pages" :key="page.slug" :to="`/admin/contenido/${page.slug}`" class="card-interactive p-5 group">
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
            <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="page.icon" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-ink group-hover:text-primary transition-colors">{{ page.title }}</h3>
            <p class="mt-1 text-sm text-slate-custom">{{ page.description }}</p>
            <p class="mt-2 text-xs text-ink-muted">{{ page.sections }} {{ page.sections === 1 ? 'seccion' : 'secciones' }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
