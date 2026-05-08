<script setup lang="ts">
// Tabla admin reutilizable. Wraps:
//   - search bar (filtro full-text sobre cualquier columna)
//   - filtros avanzados via slot `filters`
//   - sort por click en headers (useSortableList con coerción inteligente)
//   - paginación (usePaginatedList con reset auto)
//   - tooltips por columna (campo `tooltip` opcional)
//   - acciones edit/delete por fila (emits)
//
// Uso típico:
//   <AdminDataTable
//     :columns="[
//       { key: 'nombre', label: 'Nombre' },
//       { key: 'tipoHumedal', label: 'Tipo', tooltip: 'HA-FWS / HA-SFS / HA-Híbrido' },
//     ]"
//     :rows="filteredRows"
//     @edit="openEdit($event)"
//     @delete="confirmDelete($event)"
//   >
//     <template #filters><!-- card de filtros avanzados --></template>
//     <template #cell-tipoHumedal="{ row }"><span class="badge">{{ row.tipoHumedal }}</span></template>
//   </AdminDataTable>

interface Column {
  key: string
  label: string
  class?: string
  align?: 'left' | 'right' | 'center'
  tooltip?: string  // Si está, se muestra <AdminInfoTooltip> al lado del label.
  sortable?: boolean  // default true; pasa false para columnas no-ordenables.
}

const props = withDefaults(defineProps<{
  columns: Column[]
  rows: any[]
  loading?: boolean
  searchPlaceholder?: string
  defaultPerPage?: number
  defaultSortKey?: string
  defaultSortDir?: 'asc' | 'desc'
  hideActions?: boolean
}>(), {
  defaultPerPage: 15,
  defaultSortDir: 'desc',
})

const emit = defineEmits<{
  edit: [row: any]
  delete: [row: any]
}>()

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return props.rows
  const q = search.value.toLowerCase()
  return props.rows.filter(row =>
    props.columns.some(col => {
      const val = row[col.key]
      return val && String(val).toLowerCase().includes(q)
    })
  )
})

// Sort genérico con coerción inteligente (números, ISO dates, locale es-MX).
const { sorted, sortKey, sortDir, toggleSort } = useSortableList(filtered, {
  defaultKey: props.defaultSortKey,
  defaultDir: props.defaultSortDir,
})

// Paginación con perPage configurable en runtime. (No usamos `usePaginatedList`
// aquí porque ese helper congela perPage al montar; este componente expone un
// select para cambiarlo en vivo, así que mantenemos la paginación inline.)
const perPage = ref(props.defaultPerPage)
const currentPage = ref(1)
const totalPagesManual = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage.value)))
const paginatedManual = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return sorted.value.slice(start, start + perPage.value)
})

watch([search, () => props.rows, perPage], () => { currentPage.value = 1 })
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-full sm:basis-auto sm:max-w-xs">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          :placeholder="searchPlaceholder || 'Buscar...'"
          class="input w-full pl-9 transition-shadow duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-slate-custom">
        <span class="tabular-nums font-semibold text-ink">{{ filtered.length }}</span>
        <span>{{ filtered.length === 1 ? 'registro' : 'registros' }}</span>
      </span>
      <div class="ml-auto flex items-center gap-1.5">
        <label class="text-xs text-slate-custom whitespace-nowrap">Por página:</label>
        <select v-model.number="perPage" class="select !py-1 !pl-2 !pr-7 text-xs w-[70px]">
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Slot de filtros avanzados (chips, dropdowns, rangos…) -->
    <slot name="filters" />

    <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div class="rounded-lg border border-gray-200">
        <table class="table-base w-full min-w-[600px]">
          <thead>
            <tr class="bg-gray-50">
              <template v-for="col in columns" :key="col.key">
                <AdminSortableTh
                  v-if="col.sortable !== false"
                  :sort-key="col.key"
                  :current-key="sortKey"
                  :current-dir="sortDir"
                  :align="col.align || 'left'"
                  :class="['px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap', col.class]"
                  @sort="toggleSort(col.key)"
                >
                  {{ col.label }}
                  <AdminInfoTooltip
                    v-if="col.tooltip"
                    :text="col.tooltip"
                    variant="icon"
                    :size="11"
                  />
                </AdminSortableTh>
                <th
                  v-else
                  :class="[
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.class,
                  ]"
                >
                  {{ col.label }}
                  <AdminInfoTooltip v-if="col.tooltip" :text="col.tooltip" variant="icon" :size="11" />
                </th>
              </template>
              <th v-if="!hideActions" class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td :colspan="columns.length + (hideActions ? 0 : 1)" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <svg class="h-8 w-8 animate-spin text-primary/40" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span class="text-sm text-gray-400">Cargando registros...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td :colspan="columns.length + (hideActions ? 0 : 1)" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Sin resultados</p>
                    <p v-if="search" class="mt-0.5 text-xs text-gray-400">Intenta con otro término de búsqueda</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              v-for="row in paginatedManual"
              :key="row.id"
              class="group transition-colors duration-150 hover:bg-primary-50/30"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3 text-sm text-ink"
                :class="[col.class, col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '']"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                  {{ row[col.key] ?? '—' }}
                </slot>
              </td>
              <td v-if="!hideActions" class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1 opacity-60 transition-opacity duration-150 group-hover:opacity-100">
                  <button
                    class="min-h-[44px] min-w-[44px] rounded-md p-2 text-gray-400 transition-all duration-150 hover:bg-primary-50 hover:text-primary hover:shadow-sm"
                    title="Editar"
                    @click="emit('edit', row)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    class="min-h-[44px] min-w-[44px] rounded-md p-2 text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                    title="Eliminar"
                    @click="emit('delete', row)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4">
      <CommonPaginationControls
        v-model:current-page="currentPage"
        :total-pages="totalPagesManual"
        :total-items="sorted.length"
        :per-page="perPage"
      />
    </div>
  </div>
</template>
