<template>
  <div>
    <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div class="container-wide">
        <div class="flex h-14 items-center justify-between sm:h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group shrink-0">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95 sm:h-9 sm:w-9">
              <Icon name="lucide:droplets" size="18" />
            </div>
            <div class="hidden sm:block">
              <span class="text-sm font-bold text-ink leading-tight">Observatorio Humedales</span>
              <span class="block text-[10px] font-medium uppercase tracking-wider text-primary">CDMX</span>
            </div>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
              class="rounded-lg px-2.5 py-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-primary-50 hover:text-primary xl:px-3"
              active-class="!bg-primary-50 !text-primary !font-semibold">
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Right side -->
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Institutional logos — hidden on mobile -->
            <div class="hidden md:flex items-center gap-2">
              <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer" class="shrink-0">
                <img src="/images/logo-ciiemad.png" alt="IPN" class="h-8 lg:h-10 w-auto" />
              </a>
              <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer" class="shrink-0">
                <img src="/images/logo-ipn.svg" alt="Instituto Politécnico Nacional" class="h-8 lg:h-10 w-auto" />
              </a>
            </div>

            <!-- CTA — desktop only -->
            <NuxtLink to="/registra" class="btn-eco btn-sm hidden lg:inline-flex">
              <Icon name="lucide:plus" size="16" />
              Registra tu humedal
            </NuxtLink>

            <!-- Hamburger — mobile/tablet -->
            <button class="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-gray-100 active:bg-gray-200 lg:hidden" @click="mobileOpen = true" aria-label="Abrir menú">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile drawer — OUTSIDE header to avoid stacking context from backdrop-blur -->
    <Transition name="mobile-overlay">
      <div v-if="mobileOpen" class="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm lg:hidden" @click="mobileOpen = false" />
    </Transition>
    <Transition name="mobile-drawer">
      <div v-if="mobileOpen" class="fixed right-0 top-0 z-[201] flex h-full w-72 flex-col bg-white shadow-2xl lg:hidden">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <span class="text-sm font-bold text-ink">Menú</span>
          <button class="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-gray-100" @click="mobileOpen = false" aria-label="Cerrar menú">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary"
            active-class="!bg-primary-50 !text-primary !font-semibold" @click="mobileOpen = false">
            <Icon :name="link.icon" size="18" class="shrink-0" />
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="border-t border-gray-100 p-4 space-y-4">
          <div class="flex items-center justify-center gap-4 md:hidden">
            <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer">
              <img src="/images/logo-ciiemad.png" alt="IPN" class="h-10 w-auto" loading="lazy" />
            </a>
            <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer">
              <img src="/images/logo-ipn.svg" alt="IPN" class="h-9 w-auto" loading="lazy" />
            </a>
          </div>
          <NuxtLink to="/registra" class="btn-eco w-full justify-center" @click="mobileOpen = false">
            Registra tu humedal
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const mobileOpen = ref(false)
const navLinks = [
  { to: '/', label: 'Inicio', icon: 'lucide:home' },
  { to: '/mapa', label: 'Mapa', icon: 'lucide:map' },
  { to: '/inventario', label: 'Inventario', icon: 'lucide:list' },
  { to: '/analisis', label: 'Análisis', icon: 'lucide:bar-chart-3' },
  { to: '/notihumedal', label: 'Notihumedal', icon: 'lucide:newspaper' },
  { to: '/sobre', label: 'Sobre', icon: 'lucide:info' },
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
