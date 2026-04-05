import type { FetchOptions } from 'ofetch'

export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function apiFetch<T = any>(
    path: string,
    opts: FetchOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(opts.headers as Record<string, string> || {}),
    }
    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }

    try {
      return await $fetch<T>(`${config.public.apiBaseUrl}${path}`, {
        ...opts,
        headers,
      })
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.status === 401) {
        auth.logout()
      }
      throw error
    }
  }

  return { apiFetch }
}
