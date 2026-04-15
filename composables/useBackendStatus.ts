const _status = ref<boolean | null>(null)

export function useBackendStatus() {
  const available = computed(() => _status.value === true)
  const checked = computed(() => _status.value !== null)

  async function check() {
    if (_status.value !== null) return _status.value
    try {
      const config = useRuntimeConfig()
      // Use a simple GET to the public hallazgos endpoint (no auth required, always exists)
      await $fetch(`${config.public.apiBaseUrl}/observatory/${config.public.observatory}/hallazgos`, {
        timeout: 3000,
      })
      _status.value = true
    } catch (e: any) {
      // If we get an HTTP response (even 401/403/404), the backend IS running
      const status = e?.statusCode || e?.status || e?.response?.status
      _status.value = status ? true : false
    }
    return _status.value
  }

  // Allow resetting (e.g., after login)
  function reset() {
    _status.value = null
  }

  return { available, checked, check, reset }
}
