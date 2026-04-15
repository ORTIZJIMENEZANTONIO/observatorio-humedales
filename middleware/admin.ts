import type { AdminPermission } from '~/types'

const routePermissions: Record<string, AdminPermission> = {
  '/admin/usuarios': 'manage_users',
  '/admin/contenido': 'manage_cms',
  '/admin/humedales': 'manage_humedales',
  '/admin/hallazgos': 'manage_hallazgos',
  '/admin/notihumedal': 'manage_notihumedal',
  '/admin/prospectos': 'manage_prospectos',
}

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!auth.isAuthenticated) {
      return navigateTo('/admin/login')
    }

    // Check route-level permissions
    for (const [route, perm] of Object.entries(routePermissions)) {
      if (to.path.startsWith(route) && !auth.hasPermission(perm)) {
        return navigateTo('/admin')
      }
    }
  }
})
