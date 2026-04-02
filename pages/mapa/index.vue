<template>
  <div class="relative h-[calc(100vh-4rem)]">
    <ClientOnly>
      <template #fallback>
        <div class="flex h-full items-center justify-center bg-surface">
          <div class="text-center">
            <div class="mx-auto h-12 w-12 animate-spin-smooth rounded-full border-4 border-primary border-t-transparent" />
            <p class="mt-4 text-sm text-slate-custom">Cargando mapa...</p>
          </div>
        </div>
      </template>
      <MapPanel />
    </ClientOnly>

    <div class="absolute bottom-6 left-4 z-[1000] rounded-card bg-white/95 p-4 shadow-panel backdrop-blur-sm">
      <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Leyenda</h4>
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-primary" />
          <span class="text-xs text-ink">Humedal inventariado</span>
        </div>
      </div>
      <p class="mt-3 text-[10px] text-ink-muted">{{ store.totalCount }} humedales en el inventario</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHumedalesStore } from '~/stores/humedales'
definePageMeta({ layout: 'default' })
const store = useHumedalesStore()
</script>
