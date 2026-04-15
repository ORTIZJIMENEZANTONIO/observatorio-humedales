export default defineNuxtRouteMiddleware((to) => {
  // Skip admin routes entirely
  if (to.path.startsWith('/admin')) return

  const redirects: Record<string, string> = {
    '/indicadores': '/analisis/indicadores',
    '/brecha': '/analisis/brecha',
    '/hallazgos': '/analisis/hallazgos',
    '/metodologia': '/sobre#metodologia',
  }

  const target = redirects[to.path]
  if (target) {
    return navigateTo(target, { redirectCode: 301 })
  }
})
