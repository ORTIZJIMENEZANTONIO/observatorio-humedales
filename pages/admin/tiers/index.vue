<script setup lang="ts">
import type { Tier } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const tiersStore = useTiersStore()
const items = computed(() => [...tiersStore.items].sort((a, b) => a.sortOrder - b.sortOrder))

// ── Editor ──
type TierForm = {
  slug: string
  label: string
  description: string
  minScore: number
  maxScore: number | null
  color: string
  requirements: string
  icon: string
  sortOrder: number
  visible: boolean
  modeTitle: string
  audience: string
  contributionsText: string  // textarea separado por \n
  bridge: string
}

const blankForm = (): TierForm => ({
  slug: '',
  label: '',
  description: '',
  minScore: 0,
  maxScore: null,
  color: 'slate',
  requirements: '',
  icon: 'lucide:medal',
  sortOrder: items.value.length + 1,
  visible: true,
  modeTitle: '',
  audience: '',
  contributionsText: '',
  bridge: '',
})

const editingId = ref<number | null>(null)
const form = ref<TierForm>(blankForm())
const formError = ref('')

const openCreate = () => { editingId.value = 0; form.value = blankForm(); formError.value = '' }
const openEdit = (t: Tier) => {
  editingId.value = t.id ?? null
  formError.value = ''
  form.value = {
    slug: t.slug,
    label: t.label,
    description: t.description ?? '',
    minScore: t.minScore,
    maxScore: t.maxScore ?? null,
    color: t.color,
    requirements: t.requirements ?? '',
    icon: t.icon ?? 'lucide:medal',
    sortOrder: t.sortOrder,
    visible: t.visible !== false,
    modeTitle: t.modeTitle ?? '',
    audience: t.audience ?? '',
    contributionsText: (t.contributions ?? []).join('\n'),
    bridge: t.bridge ?? '',
  }
}
const cancelEdit = () => { editingId.value = null; formError.value = '' }

function save() {
  formError.value = ''
  if (!form.value.slug.trim()) { formError.value = 'slug requerido'; return }
  if (!form.value.label.trim()) { formError.value = 'label requerido'; return }
  const contributions = form.value.contributionsText
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
  const payload = {
    slug: form.value.slug.trim(),
    label: form.value.label.trim(),
    description: form.value.description || null,
    minScore: Number(form.value.minScore) || 0,
    maxScore: form.value.maxScore === null || form.value.maxScore === undefined ? null : Number(form.value.maxScore),
    color: form.value.color,
    requirements: form.value.requirements || null,
    icon: form.value.icon || null,
    sortOrder: Number(form.value.sortOrder) || 1,
    visible: form.value.visible,
    archived: false,
    modeTitle: form.value.modeTitle || null,
    audience: form.value.audience || null,
    contributions: contributions.length ? contributions : null,
    bridge: form.value.bridge || null,
  }
  if (editingId.value && editingId.value > 0) {
    tiersStore.updateTier(editingId.value, payload)
  } else {
    // duplicate slug check
    if (tiersStore.items.some(t => t.slug === payload.slug)) {
      formError.value = `Ya existe un tier con slug "${payload.slug}"`
      return
    }
    tiersStore.addTier(payload as any)
  }
  cancelEdit()
}

function confirmDelete(t: Tier) {
  if (!t.id) return
  if (!confirm(`Archivar tier "${t.label}"? Esto lo oculta de la pagina publica pero conserva los contribuyentes con ese tier asignado.`)) return
  tiersStore.deleteTier(t.id)
}

const colorOptions = [
  { value: 'slate', label: 'Gris (Slate)' },
  { value: 'secondary', label: 'Azul agua (Secondary)' },
  { value: 'eco', label: 'Verde (Eco)' },
  { value: 'primary', label: 'Teal (Primary)' },
  { value: 'accent', label: 'Ámbar (Accent)' },
  { value: 'alert', label: 'Rojo (Alert)' },
]

const colorBadgeClass = (color: string) => {
  const map: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    secondary: 'bg-secondary/10 text-secondary border-secondary/30',
    eco: 'bg-eco/10 text-eco border-eco/30',
    primary: 'bg-primary/10 text-primary border-primary/30',
    accent: 'bg-accent/10 text-accent-dark border-accent/30',
    alert: 'bg-alert/10 text-alert border-alert/30',
  }
  return map[color] || map.slate
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold text-ink">Modos de participación</h2>
        <p class="mt-1 text-sm text-slate-custom">
          Cada modo es una forma distinta de aportar al observatorio (no un nivel a alcanzar).
          Define quién aporta así, qué tipo de contribuciones y cómo se conecta con los otros
          modos. Visible públicamente en <code>/contributors</code>.
        </p>
      </div>
      <button @click="openCreate" class="btn-primary btn-sm shrink-0">
        <Icon name="lucide:plus" size="16" />
        Nuevo modo
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="card p-8 text-center">
      <Icon name="lucide:layers" size="32" class="mx-auto text-ink-muted" />
      <p class="mt-3 text-sm text-slate-custom">Aún no hay modos definidos. Crea el primero.</p>
    </div>

    <!-- Tier cards -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <article
        v-for="t in items"
        :key="t.id"
        class="card p-5 flex flex-col gap-3"
        :class="t.archived ? 'opacity-50' : ''"
      >
        <header class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              :class="colorBadgeClass(t.color)"
            >
              <Icon v-if="t.icon" :name="t.icon" size="20" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-ink">{{ t.label }}</h3>
              <p class="text-xs text-ink-muted">
                <code>{{ t.slug }}</code>
                · score {{ t.minScore }}–{{ t.maxScore ?? '∞' }}
              </p>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <button @click="openEdit(t)" class="rounded p-1.5 text-ink-muted hover:bg-primary/10 hover:text-primary" title="Editar">
              <Icon name="lucide:pencil" size="16" />
            </button>
            <button @click="confirmDelete(t)" class="rounded p-1.5 text-ink-muted hover:bg-alert/10 hover:text-alert" title="Archivar">
              <Icon name="lucide:archive" size="16" />
            </button>
          </div>
        </header>
        <p v-if="t.modeTitle" class="text-sm font-medium text-ink">{{ t.modeTitle }}</p>
        <p v-if="t.description" class="text-xs leading-relaxed text-slate-custom">{{ t.description }}</p>

        <div v-if="t.audience" class="rounded-lg bg-slate-50 p-3 text-xs">
          <p class="font-semibold text-ink-muted">Quién aporta así</p>
          <p class="mt-1 text-ink">{{ t.audience }}</p>
        </div>

        <div v-if="t.contributions?.length" class="text-xs">
          <p class="mb-1 font-semibold text-ink-muted">Contribuciones típicas</p>
          <ul class="ml-4 list-disc space-y-0.5 text-slate-custom">
            <li v-for="(c, i) in t.contributions" :key="i">{{ c }}</li>
          </ul>
        </div>

        <p v-if="t.bridge" class="rounded-lg border border-primary/15 bg-primary/5 p-3 text-xs text-ink">
          <span class="font-semibold">Puente al siguiente modo:</span> {{ t.bridge }}
        </p>
      </article>
    </div>

    <!-- Edit modal -->
    <Transition name="fade">
      <div
        v-if="editingId !== null"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        @click.self="cancelEdit"
      >
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="mb-4 text-lg font-semibold text-ink">
            {{ editingId === 0 ? 'Nuevo modo de participación' : 'Editar modo' }}
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="form-group">
                <label class="form-label">Slug <span class="text-alert">*</span></label>
                <input v-model="form.slug" class="input" placeholder="ej. observador" :disabled="editingId !== 0" />
                <p class="form-hint">Identificador estable. No se puede cambiar después.</p>
              </div>
              <div class="form-group">
                <label class="form-label">Etiqueta <span class="text-alert">*</span></label>
                <input v-model="form.label" class="input" placeholder="ej. Observador" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.description" class="input" rows="2" />
            </div>

            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="form-group">
                <label class="form-label">Score min</label>
                <input v-model.number="form.minScore" type="number" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">Score max</label>
                <input v-model.number="form.maxScore" type="number" class="input" placeholder="(vacío = sin tope)" />
              </div>
              <div class="form-group">
                <label class="form-label">Orden</label>
                <input v-model.number="form.sortOrder" type="number" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">Color</label>
                <select v-model="form.color" class="select">
                  <option v-for="c in colorOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Icono (lucide)</label>
              <input v-model="form.icon" class="input" placeholder="ej. lucide:droplets" />
            </div>

            <div class="form-group">
              <label class="form-label">Título del modo</label>
              <input v-model="form.modeTitle" class="input" placeholder="ej. Observación sostenida" />
            </div>

            <div class="form-group">
              <label class="form-label">Audiencia</label>
              <textarea v-model="form.audience" class="input" rows="2" placeholder="Quién aporta así..." />
            </div>

            <div class="form-group">
              <label class="form-label">Contribuciones típicas</label>
              <textarea v-model="form.contributionsText" class="input" rows="4" placeholder="Una por línea" />
              <p class="form-hint">Una contribución por línea (3–5 ítems recomendado).</p>
            </div>

            <div class="form-group">
              <label class="form-label">Puente al siguiente modo</label>
              <textarea v-model="form.bridge" class="input" rows="2" />
            </div>

            <div class="form-group">
              <label class="form-label">Requisitos</label>
              <textarea v-model="form.requirements" class="input" rows="2" />
            </div>

            <label class="checkbox-label">
              <input v-model="form.visible" type="checkbox" class="checkbox" />
              Visible en página pública
            </label>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <div class="flex justify-end gap-2 pt-2">
              <button @click="cancelEdit" class="btn-ghost">Cancelar</button>
              <button @click="save" class="btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
