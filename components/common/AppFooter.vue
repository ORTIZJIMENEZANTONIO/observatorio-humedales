<template>
  <footer class="bg-primary-800 text-white">
    <div class="container-wide section-padding">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <span class="text-sm font-bold leading-tight">Observatorio Humedales</span>
              <span class="block text-[10px] font-medium uppercase tracking-wider text-secondary">CDMX</span>
            </div>
          </div>
          <p class="text-sm leading-relaxed text-white/70">
            Plataforma de monitoreo y análisis de humedales artificiales en la Ciudad de México.
          </p>
          <div class="rounded-lg border border-white/10 bg-white/5 p-3">
            <p class="text-xs leading-relaxed text-white/60">
              <span class="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-accent">Aviso importante</span>
              Este observatorio muestra el inventario de humedales artificiales y sus servicios ecosistémicos. Los datos provienen de fuentes públicas y académicas.
            </p>
          </div>
        </div>
        <div>
          <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">Enlaces rápidos</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-white/70 transition-colors duration-200 hover:text-secondary">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">Contacto e información</h4>
          <ul class="space-y-3 text-sm text-white/70">
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-4 w-4 shrink-0 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span>Ciudad de México, México</span>
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-4 w-4 shrink-0 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>CIIEMAD — Instituto Politécnico Nacional</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-10 border-t border-white/10 pt-6">
        <div class="flex items-center justify-center gap-6 mb-4">
          <a href="https://www.ciiemad.ipn.mx/" target="_blank" rel="noopener noreferrer">
            <img src="/images/logo-ciiemad.png" alt="CIIEMAD - IPN" class="h-14 w-auto rounded-full bg-white p-1" />
          </a>
          <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer">
            <img src="/images/logo-ipn.svg" alt="Instituto Politécnico Nacional" class="h-12 w-auto brightness-0 invert" />
          </a>
        </div>
        <p class="text-center text-xs text-white/40">&copy; 2024 Observatorio de Humedales Artificiales CDMX. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/mapa', label: 'Mapa interactivo' },
  { to: '/inventario', label: 'Inventario de humedales' },
  { to: '/indicadores', label: 'Indicadores' },
  { to: '/brecha', label: 'Brecha de cobertura' },
  { to: '/hallazgos', label: 'Hallazgos y recomendaciones' },
  { to: '/metodologia', label: 'Metodología' },
  { to: '/sobre', label: 'Sobre el proyecto' },
]
</script>
