<template>
  <div class="card overflow-hidden">
    <div class="flex">
      <div class="w-2 shrink-0" :style="{ backgroundColor: goal.color }" />
      <div class="flex-1 p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold shrink-0" :style="{ backgroundColor: goal.color }">
            {{ goal.numero }}
          </div>
          <h3 class="text-base font-semibold text-ink">{{ goal.nombre }}</h3>
        </div>
        <p class="text-sm text-slate-custom leading-relaxed">{{ goal.contribucionGeneral }}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="meta in goal.metasEspecificas" :key="meta" class="rounded-badge px-2 py-0.5 text-[10px] font-medium" :style="{ backgroundColor: goal.color + '15', color: goal.color }">
            {{ meta }}
          </span>
        </div>
        <div v-if="goal.indicadores.length" class="mt-3 space-y-1">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Indicadores</p>
          <ul class="space-y-0.5">
            <li v-for="ind in goal.indicadores" :key="ind" class="flex items-start gap-1.5 text-xs text-slate-custom">
              <span class="mt-1 h-1 w-1 shrink-0 rounded-full" :style="{ backgroundColor: goal.color }" />
              {{ ind }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ODSGoal } from '~/types'

defineProps<{
  goal: ODSGoal
}>()
</script>
