export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!auth.isAuthenticated) {
      return navigateTo('/admin/login')
    }
  }
})
