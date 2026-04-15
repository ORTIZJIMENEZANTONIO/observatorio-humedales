<template>
  <div class="sticky top-14 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm sm:top-16">
    <div class="container-wide">
      <nav class="flex gap-1 overflow-x-auto py-2 scrollbar-hide -mx-1">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to"
          class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap text-ink-muted hover:bg-primary-50 hover:text-primary"
          active-class="!bg-primary !text-white !shadow-sm !shadow-primary/20">
          <Icon :name="link.icon" size="16" />
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  { to: '/analisis/indicadores', label: 'Indicadores', icon: 'lucide:bar-chart-3' },
  { to: '/analisis/brecha', label: 'Brecha de cobertura', icon: 'lucide:map' },
  { to: '/analisis/hallazgos', label: 'Hallazgos', icon: 'lucide:lightbulb' },
]
</script>
