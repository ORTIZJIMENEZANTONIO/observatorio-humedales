<script setup lang="ts">
const auth = useAuthStore()
if (import.meta.client) auth.loadFromStorage()
const route = useRoute()

const allNavItems = [
  { label: 'Dashboard', to: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', exact: true },
  { label: 'Prospectos', to: '/admin/prospectos', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7', perm: 'manage_prospectos' as const },
  { label: 'Inventario', to: '/admin/humedales', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', perm: 'manage_humedales' as const },
  { label: 'Hallazgos', to: '/admin/hallazgos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', perm: 'manage_hallazgos' as const },
  { label: 'Notihumedal', to: '/admin/notihumedal', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', perm: 'manage_notihumedal' as const },
  { label: 'Contenido', to: '/admin/contenido', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', perm: 'manage_cms' as const },
  { label: 'Usuarios', to: '/admin/usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', perm: 'manage_users' as const },
]

const navItems = computed(() =>
  allNavItems.filter(item => !item.perm || auth.hasPermission(item.perm))
)

function isActive(item: typeof navItems[number]) {
  if ((item as any).exact) return route.path === item.to
  return route.path.startsWith(item.to)
}

const sidebarOpen = ref(false)
const isLg = ref(false)

if (import.meta.client) {
  const mql = window.matchMedia('(min-width: 1024px)')
  isLg.value = mql.matches
  sidebarOpen.value = mql.matches
  mql.addEventListener('change', (e) => {
    isLg.value = e.matches
    sidebarOpen.value = e.matches
  })
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span class="text-sm font-semibold text-ink">Admin Panel</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
          :class="isActive(item)
            ? 'bg-primary-50 text-primary shadow-sm'
            : 'text-gray-600 hover:bg-primary-50/50 hover:text-primary'"
          @click="!isLg && (sidebarOpen = false)"
        >
          <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" :stroke-width="isActive(item) ? '2' : '1.5'">
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-gray-200 p-4">
        <div class="mb-3 flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
            <ClientOnly>
              {{ auth.admin?.name?.charAt(0)?.toUpperCase() || auth.admin?.email?.charAt(0)?.toUpperCase() || 'A' }}
              <template #fallback>A</template>
            </ClientOnly>
          </div>
          <div class="min-w-0 flex-1">
            <ClientOnly>
              <p v-if="auth.admin?.name" class="truncate text-xs font-medium text-ink">{{ auth.admin.name }}</p>
              <div class="flex items-center gap-1.5">
                <p class="truncate text-xs text-gray-500">{{ auth.admin?.email }}</p>
                <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="auth.isSuperadmin ? 'bg-primary-50 text-primary' : auth.admin?.role === 'admin' ? 'bg-eco/10 text-eco-dark' : 'bg-secondary/10 text-secondary-dark'">
                  {{ auth.roleLabel }}
                </span>
              </div>
              <template #fallback><div class="h-4 w-24 rounded bg-gray-100" /></template>
            </ClientOnly>
          </div>
        </div>
        <NuxtLink
          to="/"
          class="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Ver sitio público
        </NuxtLink>
        <button
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          @click="auth.logout()"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen && !isLg"
        class="fixed inset-0 z-30 bg-black/20"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Main content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
        <button
          class="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="min-w-0 truncate text-sm font-semibold text-ink sm:text-lg">Observatorio de Humedales — Admin</h1>
      </header>
      <main class="flex-1 overflow-x-hidden p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
