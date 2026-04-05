<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.totalItems))

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1)
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push(-1)
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
    <p class="text-xs text-slate-custom">
      Mostrando <span class="font-semibold text-ink tabular-nums">{{ startItem }}-{{ endItem }}</span>
      de <span class="font-semibold text-ink tabular-nums">{{ totalItems }}</span>
    </p>

    <nav class="flex items-center gap-1" aria-label="Paginación">
      <button
        class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
        :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-ink-muted hover:bg-gray-100'"
        :disabled="currentPage === 1"
        aria-label="Página anterior"
        @click="goTo(currentPage - 1)"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <template v-for="(page, idx) in visiblePages" :key="idx">
        <span v-if="page === -1" class="px-1 text-xs text-gray-400">...</span>
        <button
          v-else
          class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-medium tabular-nums transition-colors"
          :class="page === currentPage
            ? 'bg-primary text-white'
            : 'text-ink-muted hover:bg-gray-100'"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
        :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-ink-muted hover:bg-gray-100'"
        :disabled="currentPage === totalPages"
        aria-label="Página siguiente"
        @click="goTo(currentPage + 1)"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  </div>
</template>
