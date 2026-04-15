import { cmsDefaults } from '~/data/cms-defaults'

export function useCmsContent<T = any>(pageSlug: string, sectionKey: string) {
  const defaults = (cmsDefaults[pageSlug]?.[sectionKey] ?? []) as T[]
  const items = ref<T[]>([...defaults])
  const loaded = ref(false)

  onMounted(async () => {
    try {
      const config = useRuntimeConfig()
      const obs = config.public.observatory as string
      const res = await $fetch<any>(`${config.public.apiBaseUrl}/observatory/${obs}/cms/${pageSlug}/${sectionKey}`)
      const data = res?.items || res?.data
      if (data?.length) items.value = data
    } catch { /* use defaults silently */ }
    loaded.value = true
  })

  return { items, loaded }
}
