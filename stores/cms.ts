import { defineStore } from 'pinia'
import { cmsDefaults } from '~/data/cms-defaults'

export const useCmsStore = defineStore('cms', () => {
  const sections = reactive<Record<string, Record<string, any[]>>>({})

  function getSection<T = any>(page: string, section: string): T[] {
    return (sections[page]?.[section] ?? cmsDefaults[page]?.[section] ?? []) as T[]
  }

  function setSection(page: string, section: string, items: any[]) {
    if (!sections[page]) sections[page] = {}
    sections[page][section] = items
  }

  /** Fetch a section from the public API. Always hits the API (no cache). */
  async function fetchSection(page: string, section: string) {
    // Show defaults immediately while the API responds
    if (!sections[page]?.[section]) {
      setSection(page, section, [...(cmsDefaults[page]?.[section] ?? [])])
    }

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
      // API unavailable — keep defaults
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
