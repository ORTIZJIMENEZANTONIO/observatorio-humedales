<script setup lang="ts">
definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  auth.loadFromStorage()
  if (auth.isAuthenticated) navigateTo('/admin')
})
</script>

<template>
  <div class="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50/60 via-surface to-secondary/5" />
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;" />

    <div class="relative z-10 w-full max-w-md px-4 animate-fade-in">
      <div class="card p-5 sm:p-8 shadow-panel">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-ink">Panel de administración</h1>
          <p class="mt-1 text-sm text-slate-custom">Observatorio de Humedales Artificiales CDMX</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-ink">Correo electronico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input w-full transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
              placeholder="admin@observatorio.cdmx"
            />
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-ink">Contrasena</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="input w-full transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
              placeholder="********"
            />
          </div>

          <Transition name="slide-up">
            <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {{ error }}
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <svg v-if="loading" class="h-4 w-4 animate-spin-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? 'Ingresando...' : 'Iniciar sesion' }}
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-gray-400">
          Acceso restringido a administradores del sistema
        </p>
      </div>
    </div>
  </div>
</template>
