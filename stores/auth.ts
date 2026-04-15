import { defineStore } from 'pinia'
import type { AdminRole, AdminPermission } from '~/types'

interface AdminInfo {
  id: string
  email: string
  name: string
  observatories: string[]
  role?: AdminRole
  permissions?: AdminPermission[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const admin = ref<AdminInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  const isSuperadmin = computed(() => !admin.value?.role || admin.value.role === 'superadmin')

  function hasPermission(perm: AdminPermission): boolean {
    if (!admin.value) return false
    // If backend doesn't send role yet, assume superadmin (backward compat)
    if (!admin.value.role) return true
    if (admin.value.role === 'superadmin') return true
    if (admin.value.role === 'admin') return perm !== 'manage_users'
    return admin.value.permissions?.includes(perm) ?? false
  }

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

  return { token, admin, isAuthenticated, isSuperadmin, hasPermission, login, logout, loadFromStorage }
})
