import { defineStore } from 'pinia'

interface AdminInfo {
  id: string
  email: string
  name: string
  observatories: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const admin = ref<AdminInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  function loadFromStorage() {
    if (import.meta.server) return
    const saved = localStorage.getItem('obs_token')
    const savedAdmin = localStorage.getItem('obs_admin')
    if (saved) token.value = saved
    if (savedAdmin) {
      try { admin.value = JSON.parse(savedAdmin) } catch { /* ignore */ }
    }
  }

  async function login(email: string, password: string) {
    const config = useRuntimeConfig()
    const res = await $fetch<{ success: boolean; data: { accessToken: string; refreshToken: string; admin: AdminInfo } }>(
      `${config.public.apiBaseUrl}/observatory/auth/login`,
      { method: 'POST', body: { email, password } }
    )
    token.value = res.data.accessToken
    admin.value = res.data.admin
    localStorage.setItem('obs_token', res.data.accessToken)
    localStorage.setItem('obs_admin', JSON.stringify(res.data.admin))
  }

  function logout() {
    token.value = null
    admin.value = null
    localStorage.removeItem('obs_token')
    localStorage.removeItem('obs_admin')
    navigateTo('/admin/login')
  }

  return { token, admin, isAuthenticated, login, logout, loadFromStorage }
})
