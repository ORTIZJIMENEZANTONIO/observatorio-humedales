<template>
  <div>
    <CommonHeroSection compact>
      <NuxtLink to="/notihumedal" class="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
        <Icon name="lucide:chevron-left" size="16" />
        Volver a Notihumedal
      </NuxtLink>
      <h1 v-if="articulo" class="text-2xl font-extrabold text-white md:text-3xl">{{ articulo.titulo }}</h1>
      <div v-if="articulo" class="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
        <span>{{ formatters.formatDate(articulo.fecha) }}</span>
        <span>{{ articulo.autor }}</span>
      </div>
    </CommonHeroSection>

    <section class="bg-white py-16">
      <div class="container-narrow">
        <figure v-if="articulo?.imagen" class="mb-8 overflow-hidden rounded-2xl">
          <img :src="articulo.imagen" :alt="articulo.titulo" class="w-full object-cover max-h-[400px]" loading="lazy" />
          <figcaption v-if="articulo.fuenteImagen" class="mt-2 text-xs text-ink-muted/70 text-center">Foto: {{ articulo.fuenteImagen }}</figcaption>
        </figure>
        <div v-if="articulo" class="prose prose-sm max-w-none text-slate-custom" v-html="articulo.contenido" />

        <!-- Source link and credit -->
        <div v-if="articulo && (articulo.url || articulo.fuente)" class="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p class="text-xs text-ink-muted">
            <span v-if="articulo.fuente" class="font-medium">Fuente: {{ articulo.fuente }}</span>
            <template v-if="articulo.url">
              <span v-if="articulo.fuente"> — </span>
              <a :href="articulo.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Ver fuente original</a>
            </template>
          </p>
        </div>

        <div v-if="articulo" class="mt-8 flex flex-wrap gap-2">
          <span v-for="tag in (articulo.tags || [])" :key="tag" class="badge-primary">{{ tag }}</span>
        </div>

        <div v-if="!articulo" class="py-16 text-center">
          <p class="text-lg text-ink-muted">Artículo no encontrado</p>
          <NuxtLink to="/notihumedal" class="btn-primary mt-4">Volver a Notihumedal</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Related articles -->
    <section v-if="related.length" class="bg-surface py-16">
      <div class="container-wide">
        <h2 class="mb-6 text-lg font-semibold text-ink">Artículos relacionados</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <NuxtLink v-for="a in related" :key="a.id" :to="`/notihumedal/${a.slug}`" class="card-interactive p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
            <h3 class="text-sm font-semibold text-ink">{{ a.titulo }}</h3>
            <p class="mt-2 text-xs text-slate-custom line-clamp-2">{{ a.resumen }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const formatters = useFormatters()
const route = useRoute()
const config = useRuntimeConfig()
const store = useNotihumedalStore()

onMounted(async () => {
  try {
    const res = await $fetch<any>(`${config.public.apiBaseUrl}/observatory/${config.public.observatory}/notihumedal`, { timeout: 3000 })
    const items = res?.items || res?.data
    if (items?.length) store.setArticulos(items)
  } catch { /* use store fallback */ }
})

const articulo = computed(() => store.articulos.find(a => a.slug === route.params.slug && !a.archivado && a.visible !== false))

const related = computed(() => {
  if (!articulo.value) return []
  return store.filtered.filter(a => a.id !== articulo.value!.id).slice(0, 3)
})
</script>
