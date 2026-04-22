<template>
  <div>
    <CommonHeroSection compact>
      <h1 class="text-3xl font-extrabold text-white md:text-4xl">Notihumedal</h1>
      <p class="mt-2 text-base text-white/80">Noticias, investigaciones y novedades sobre humedales artificiales</p>
    </CommonHeroSection>

    <section class="bg-surface py-16">
      <div class="container-wide">
        <!-- Filters -->
        <div class="mb-8 flex flex-wrap items-center gap-3">
          <div class="input-icon-wrapper max-w-xs flex-1 basis-full sm:basis-auto">
            <Icon name="lucide:search" size="18" class="input-icon" />
            <input v-model="searchQuery" type="text" placeholder="Buscar por título, autor, tag..." class="input" />
          </div>
          <select v-model="store.filterTag" class="select max-w-[200px]">
            <option value="">Todos los tags</option>
            <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
          <select v-model="store.sortBy" class="select max-w-[180px]">
            <option value="reciente">Más recientes</option>
            <option value="antiguo">Más antiguos</option>
            <option value="titulo">Título (A-Z)</option>
          </select>
          <span class="text-sm text-slate-custom">{{ filtered.length }} artículos</span>
        </div>

        <!-- Articles grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="a in filtered" :key="a.id" :to="`/notihumedal/${a.slug}`" class="card-interactive overflow-hidden group cursor-pointer">
            <div v-if="a.imagen" class="relative h-48 overflow-hidden">
              <img :src="a.imagen" :alt="a.titulo" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div class="p-6">
              <div class="mb-3 flex flex-wrap gap-2">
                <span v-for="tag in (a.tags || []).slice(0, 3)" :key="tag" class="badge-primary text-[10px]">{{ tag }}</span>
              </div>
              <h2 class="text-base font-semibold text-ink group-hover:text-primary transition-colors">{{ a.titulo }}</h2>
              <p class="mt-2 text-sm text-slate-custom line-clamp-3">{{ a.resumen }}</p>
              <div class="mt-4 flex items-center justify-between text-xs text-ink-muted">
                <span>{{ formatters.formatDate(a.fecha) }}</span>
                <span>{{ a.autor }}</span>
              </div>
              <p v-if="a.fuente" class="mt-2 text-[10px] text-ink-muted/60">Fuente: {{ a.fuente }}</p>
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
const formatters = useFormatters()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const store = useNotihumedalStore()

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (v) => { store.searchQuery = v },
})

const filtered = computed(() => store.filtered)

onMounted(async () => {
  try {
    const res = await apiFetch(`/observatory/${obs}/notihumedal`)
    const items = (res as any).items || (res as any).data
    if (items?.length) store.setArticulos(items)
  } catch { /* use store fallback */ }
})
</script>
