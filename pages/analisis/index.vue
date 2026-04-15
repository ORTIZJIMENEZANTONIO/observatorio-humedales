<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Análisis</h1>
        <p class="mt-2 text-base text-white/80">Indicadores, brecha de cobertura y hallazgos del inventario de humedales artificiales</p>
      </div>
    </section>

    <section ref="cardsRef" class="bg-surface py-16">
      <div class="container-wide">
        <div class="stagger-children grid grid-cols-1 gap-5 md:grid-cols-3">
          <NuxtLink v-for="section in sections" :key="section.to" :to="section.to" class="card-interactive overflow-hidden reveal group">
            <div :class="['h-2', section.accentColor]" />
            <div class="p-6">
              <div :class="['mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110', section.bg]">
                <Icon :name="section.icon" size="28" :class="section.iconColor" />
              </div>
              <h2 class="text-lg font-bold text-ink">{{ section.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-slate-custom">{{ section.description }}</p>
              <div class="mt-5 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                Explorar
                <Icon name="lucide:arrow-right" size="16" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { revealRef: cardsRef } = useScrollReveal({ stagger: true })

const { items: sections } = useCmsContent('analisis', 'sections')
</script>
