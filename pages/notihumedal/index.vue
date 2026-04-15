<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Notihumedal</h1>
        <p class="mt-2 text-base text-white/80">Noticias, investigaciones y novedades sobre humedales artificiales</p>
      </div>
    </section>

    <section class="bg-surface py-16">
      <div class="container-wide">
        <!-- Search -->
        <div class="mb-8">
          <input v-model="searchQuery" type="text" placeholder="Buscar artículos..." class="input w-full max-w-md" />
        </div>

        <!-- Articles grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="a in filtered" :key="a.id" :to="`/notihumedal/${a.slug}`" class="card-interactive overflow-hidden group">
            <div class="p-6">
              <div class="mb-3 flex flex-wrap gap-2">
                <span v-for="tag in a.tags.slice(0, 3)" :key="tag" class="badge-primary text-[10px]">{{ tag }}</span>
              </div>
              <h2 class="text-base font-semibold text-ink group-hover:text-primary transition-colors">{{ a.titulo }}</h2>
              <p class="mt-2 text-sm text-slate-custom line-clamp-3">{{ a.resumen }}</p>
              <div class="mt-4 flex items-center justify-between text-xs text-ink-muted">
                <span>{{ formatters.formatDate(a.fecha) }}</span>
                <span>{{ a.autor }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="filtered.length === 0" class="py-16 text-center">
          <p class="text-lg text-ink-muted">No se encontraron artículos</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ArticuloNotihumedal } from '~/types'
import { articulos as localArticulos } from '~/data/notihumedal'

const formatters = useFormatters()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string

const articulos = ref<ArticuloNotihumedal[]>([...localArticulos])
const searchQuery = ref('')

onMounted(async () => {
  try {
    const res = await apiFetch(`/observatory/${obs}/notihumedal`)
    const items = (res as any).items || (res as any).data
    if (items?.length) articulos.value = items
  } catch { /* use local fallback */ }
})

const filtered = computed(() => {
  if (!searchQuery.value) return articulos.value
  const q = searchQuery.value.toLowerCase()
  return articulos.value.filter(a =>
    a.titulo.toLowerCase().includes(q) ||
    a.resumen.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q))
  )
})
</script>
