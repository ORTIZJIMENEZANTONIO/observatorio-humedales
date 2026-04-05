<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
    <div class="container-wide">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div class="hidden sm:block">
            <span class="text-sm font-bold text-ink leading-tight">Observatorio Humedales</span>
            <span class="block text-[10px] font-medium uppercase tracking-wider text-primary">CDMX</span>
          </div>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-primary-50 hover:text-primary"
            active-class="!bg-primary-50 !text-primary !font-semibold">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <a href="https://www.ciiemad.ipn.mx/" target="_blank" rel="noopener noreferrer" class="shrink-0">
            <img src="/images/logo-ciiemad.png" alt="CIIEMAD - IPN" class="h-8 sm:h-10 w-auto" />
          </a>
          <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer" class="shrink-0">
            <img src="/images/logo-ipn.svg" alt="Instituto Politécnico Nacional" class="h-8 sm:h-10 w-auto" />
          </a>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink to="/mapa" class="btn-primary btn-sm hidden lg:inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Explorar mapa
          </NuxtLink>
          <button class="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-gray-100 lg:hidden" @click="mobileOpen = true" aria-label="Abrir menú">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="mobile-overlay">
      <div v-if="mobileOpen" class="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm lg:hidden" @click="mobileOpen = false" />
    </Transition>
    <Transition name="mobile-drawer">
      <div v-if="mobileOpen" class="fixed right-0 top-0 z-[101] flex h-full w-72 flex-col bg-white shadow-2xl lg:hidden">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <span class="text-sm font-bold text-ink">Menú</span>
          <button class="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100" @click="mobileOpen = false" aria-label="Cerrar menú">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary"
            active-class="!bg-primary-50 !text-primary !font-semibold" @click="mobileOpen = false">
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="border-t border-gray-100 p-4">
          <NuxtLink to="/mapa" class="btn-primary w-full justify-center" @click="mobileOpen = false">
            Explorar mapa
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const mobileOpen = ref(false)
const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/inventario', label: 'Inventario' },
  { to: '/indicadores', label: 'Indicadores' },
  { to: '/brecha', label: 'Brecha' },
  { to: '/hallazgos', label: 'Hallazgos' },
  { to: '/metodologia', label: 'Metodología' },
]

const route = useRoute()
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<style scoped>
.mobile-overlay-enter-active, .mobile-overlay-leave-active { transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.mobile-overlay-enter-from, .mobile-overlay-leave-to { opacity: 0; }
.mobile-drawer-enter-active { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.mobile-drawer-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1); }
.mobile-drawer-enter-from, .mobile-drawer-leave-to { transform: translateX(100%); }
</style>
