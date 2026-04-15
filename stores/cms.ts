import { defineStore } from 'pinia'
import { cmsDefaults } from '~/data/cms-defaults'

export const useCmsStore = defineStore('cms', () => {
  const sections = reactive<Record<string, Record<string, any[]>>>({})
  const _backendChecked = ref(false)
  const _backendAvailable = ref(false)

  function getSection<T = any>(page: string, section: string): T[] {
    return (sections[page]?.[section] ?? cmsDefaults[page]?.[section] ?? []) as T[]
  }

  function setSection(page: string, section: string, items: any[]) {
    if (!sections[page]) sections[page] = {}
    sections[page][section] = items
  }

  /** Check backend availability once (cached). */
  async function _ensureBackendCheck() {
    if (_backendChecked.value) return _backendAvailable.value
    _backendChecked.value = true
    try {
      const config = useRuntimeConfig()
      const obs = config.public.observatory as string
      await $fetch(`${config.public.apiBaseUrl}/observatory/${obs}/hallazgos`, { timeout: 3000 })
      _backendAvailable.value = true
    } catch (e: any) {
      const status = e?.statusCode || e?.status || e?.response?.status
      _backendAvailable.value = !!status
    }
    return _backendAvailable.value
  }

  /** Fetch a section from the public API. Skips if backend is offline. */
  async function fetchSection(page: string, section: string) {
    // Show defaults immediately
    if (!sections[page]?.[section]) {
      setSection(page, section, [...(cmsDefaults[page]?.[section] ?? [])])
    }

    // Only attempt API if backend is running
    const isOnline = await _ensureBackendCheck()
    if (!isOnline) return

    try {
      const config = useRuntimeConfig()
      const obs = config.public.observatory as string
      const res = await $fetch<any>(
        `${config.public.apiBaseUrl}/observatory/${obs}/cms/${page}/${section}`
      )
      // Backend returns { success, sections: { [key]: [...] } }
      const data = res?.sections?.[section]
      if (Array.isArray(data) && data.length) {
        setSection(page, section, data)
      }
    } catch {
      // API error on this specific endpoint — keep defaults
    }
  }

  /** Initialize all sections for a page from defaults (synchronous). */
  function initPage(page: string) {
    const pageSections = cmsDefaults[page]
    if (!pageSections) return
    for (const sectionKey of Object.keys(pageSections)) {
      if (!sections[page]?.[sectionKey]) {
        setSection(page, sectionKey, [...pageSections[sectionKey]])
      }
    }
  }

  return { sections, getSection, setSection, fetchSection, initPage }
})
