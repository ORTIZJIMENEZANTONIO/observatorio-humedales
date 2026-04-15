const _status = ref<boolean | null>(null)
let _pending: Promise<boolean> | null = null

export function useBackendStatus() {
  const available = computed(() => _status.value === true)
  const checked = computed(() => _status.value !== null)

  async function check() {
    if (_status.value !== null) return _status.value
    // Deduplicate parallel calls — all await the same promise
    if (_pending) return _pending
    _pending = _doCheck()
    const result = await _pending
    _pending = null
    return result
  }

  async function _doCheck() {
    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBaseUrl}/observatory/${config.public.observatory}/hallazgos`, {
        timeout: 3000,
      })
      _status.value = true
    } catch (e: any) {
      const status = e?.statusCode || e?.status || e?.response?.status
      _status.value = status ? true : false
    }
    return _status.value!
  }

  function reset() {
    _status.value = null
    _pending = null
  }

  return { available, checked, check, reset }
}
