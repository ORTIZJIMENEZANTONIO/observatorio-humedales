export function useCmsContent<T = any>(pageSlug: string, sectionKey: string) {
  const store = useCmsStore()

  const items = computed<T[]>(() => store.getSection<T>(pageSlug, sectionKey))
  const loaded = ref(false)

  onMounted(async () => {
    await store.fetchSection(pageSlug, sectionKey)
    loaded.value = true
  })

  return { items, loaded }
}
