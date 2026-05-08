<script setup lang="ts">
import type { Contributor, ContributorRole, ContributorTierSlug } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const contribStore = useContributorsStore()
const tiersStore = useTiersStore()

const filteredItems = computed(() => contribStore.filtered)

// ── Editor ──
type ContribForm = {
  displayName: string
  handle: string
  role: ContributorRole
  affiliation: string
  bio: string
  avatarUrl: string
  alcaldia: string
  tier: ContributorTierSlug
  reputationScore: number
  validatedContributions: number
  rejectedContributions: number
  averageQuality: number
  publicProfile: boolean
  verified: boolean
}

const blankForm = (): ContribForm => ({
  displayName: '',
  handle: '',
  role: 'ciudadano',
  affiliation: '',
  bio: '',
  avatarUrl: '',
  alcaldia: '',
  tier: 'aprendiz',
  reputationScore: 0,
  validatedContributions: 0,
  rejectedContributions: 0,
  averageQuality: 0,
  publicProfile: true,
  verified: false,
})

const editingId = ref<number | null>(null)
const form = ref<ContribForm>(blankForm())
const formError = ref('')

const openCreate = () => { editingId.value = 0; form.value = blankForm(); formError.value = '' }
const openEdit = (c: Contributor) => {
  editingId.value = c.id
  formError.value = ''
  form.value = {
    displayName: c.displayName,
    handle: c.handle,
    role: c.role,
    affiliation: c.affiliation ?? '',
    bio: c.bio ?? '',
    avatarUrl: c.avatarUrl ?? '',
    alcaldia: c.alcaldia ?? '',
    tier: c.tier,
    reputationScore: c.reputationScore,
    validatedContributions: c.validatedContributions,
    rejectedContributions: c.rejectedContributions,
    averageQuality: Number(c.averageQuality),
    publicProfile: c.publicProfile,
    verified: c.verified,
  }
}
const cancelEdit = () => { editingId.value = null; formError.value = '' }

function save() {
  formError.value = ''
  if (!form.value.displayName.trim()) { formError.value = 'Nombre requerido'; return }
  if (!form.value.handle.trim()) { formError.value = 'Handle requerido'; return }
  if (!/^[a-z0-9-]{3,50}$/i.test(form.value.handle)) {
    formError.value = 'Handle solo permite letras, números y guiones (3–50 caracteres)'
    return
  }
  const total = form.value.validatedContributions + form.value.rejectedContributions
  const acceptanceRate = total > 0
    ? Number((form.value.validatedContributions / total).toFixed(3))
    : 0
  const payload = {
    displayName: form.value.displayName.trim(),
    handle: form.value.handle.trim().toLowerCase(),
    role: form.value.role,
    affiliation: form.value.affiliation || null,
    bio: form.value.bio || null,
    avatarUrl: form.value.avatarUrl || null,
    alcaldia: form.value.alcaldia || null,
    tier: form.value.tier,
    reputationScore: Number(form.value.reputationScore) || 0,
    validatedContributions: Number(form.value.validatedContributions) || 0,
    rejectedContributions: Number(form.value.rejectedContributions) || 0,
    acceptanceRate,
    averageQuality: Number(form.value.averageQuality) || 0,
    publicProfile: form.value.publicProfile,
    verified: form.value.verified,
  }
  if (editingId.value && editingId.value > 0) {
    contribStore.updateContributor(editingId.value, payload as any)
  } else {
    if (contribStore.items.some(c => c.handle === payload.handle)) {
      formError.value = `Ya existe un contribuyente con handle "${payload.handle}"`
      return
    }
    contribStore.addContributor(payload as any)
  }
  cancelEdit()
}

function confirmDelete(c: Contributor) {
  if (!confirm(`Archivar a "${c.displayName}"? Sus contribuciones quedan registradas pero deja de listarse en la página pública.`)) return
  contribStore.deleteContributor(c.id)
}

const roleLabels: Record<ContributorRole, string> = {
  ciudadano: 'Ciudadano',
  investigador: 'Investigador',
  estudiante: 'Estudiante',
  institucion: 'Institución',
  gobierno: 'Gobierno',
  ong: 'ONG',
  tecnico_campo: 'Técnico de campo',
}

const tierColorClass = (slug: string) => {
  const tier = tiersStore.getTier(slug)
  if (!tier) return 'bg-slate-100 text-slate-700 border-slate-200'
  const map: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    secondary: 'bg-secondary/10 text-secondary border-secondary/30',
    eco: 'bg-eco/10 text-eco border-eco/30',
    primary: 'bg-primary/10 text-primary border-primary/30',
    accent: 'bg-accent/10 text-accent-dark border-accent/30',
  }
  return map[tier.color] || map.slate
}

const totalContribs = (c: Contributor) => c.validatedContributions + c.rejectedContributions
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-ink">Contribuyentes</h2>
        <p class="mt-1 text-sm text-slate-custom">
          Personas e instituciones que aportan al observatorio. Su atribución se vincula a los
          prospectos en <NuxtLink to="/admin/prospectos" class="text-primary hover:underline">/admin/prospectos</NuxtLink>.
        </p>
      </div>
      <button @click="openCreate" class="btn-primary btn-sm shrink-0">
        <Icon name="lucide:user-plus" size="16" />
        Nuevo contribuyente
      </button>
    </div>

    <!-- Filtros -->
    <div class="card p-4 mb-4">
      <div class="grid gap-3 md:grid-cols-4">
        <div class="md:col-span-2">
          <input
            v-model="contribStore.search"
            type="text"
            class="input"
            placeholder="Buscar por nombre, handle o afiliación..."
          />
        </div>
        <select v-model="contribStore.filterRole" class="select">
          <option value="all">Todos los roles</option>
          <option v-for="(label, value) in roleLabels" :key="value" :value="value">{{ label }}</option>
        </select>
        <select v-model="contribStore.filterTier" class="select">
          <option value="all">Todos los modos</option>
          <option v-for="t in tiersStore.visibleTiers" :key="t.slug" :value="t.slug">{{ t.label }}</option>
        </select>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredItems.length === 0" class="card p-8 text-center">
      <Icon name="lucide:users" size="32" class="mx-auto text-ink-muted" />
      <p class="mt-3 text-sm text-slate-custom">No hay contribuyentes que coincidan con los filtros.</p>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-3">
      <article v-for="c in filteredItems" :key="c.id" class="card p-4 flex items-start gap-4">
        <div class="shrink-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
            {{ c.displayName.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-base font-semibold text-ink truncate">{{ c.displayName }}</h3>
            <Icon v-if="c.verified" name="lucide:badge-check" size="16" class="text-primary" />
            <span v-if="!c.publicProfile" class="badge-secondary text-[10px]">Privado</span>
          </div>
          <p class="text-xs text-ink-muted">
            <code>@{{ c.handle }}</code>
            · {{ roleLabels[c.role] || c.role }}
            <span v-if="c.affiliation"> · {{ c.affiliation }}</span>
          </p>
          <p v-if="c.bio" class="mt-2 text-sm text-slate-custom line-clamp-2">{{ c.bio }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              class="rounded-full border px-2 py-0.5 font-semibold"
              :class="tierColorClass(c.tier)"
            >
              {{ tiersStore.getTier(c.tier)?.label || c.tier }}
            </span>
            <span class="text-ink-muted">
              <strong class="text-ink">{{ c.reputationScore }}</strong> pts
            </span>
            <span class="text-ink-muted">
              <strong class="text-ink">{{ c.validatedContributions }}</strong> validadas
            </span>
            <span v-if="totalContribs(c) > 0" class="text-ink-muted">
              tasa <strong class="text-ink">{{ Math.round(c.acceptanceRate * 100) }}%</strong>
            </span>
          </div>
        </div>
        <div class="shrink-0 flex items-center gap-1">
          <button @click="openEdit(c)" class="rounded p-1.5 text-ink-muted hover:bg-primary/10 hover:text-primary" title="Editar">
            <Icon name="lucide:pencil" size="16" />
          </button>
          <button @click="confirmDelete(c)" class="rounded p-1.5 text-ink-muted hover:bg-alert/10 hover:text-alert" title="Archivar">
            <Icon name="lucide:archive" size="16" />
          </button>
        </div>
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
            {{ editingId === 0 ? 'Nuevo contribuyente' : 'Editar contribuyente' }}
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="form-group">
                <label class="form-label">Nombre <span class="text-alert">*</span></label>
                <input v-model="form.displayName" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">Handle <span class="text-alert">*</span></label>
                <input v-model="form.handle" class="input" placeholder="ej. juan-perez" />
                <p class="form-hint">Identificador único, sin @.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="form-group">
                <label class="form-label">Rol</label>
                <select v-model="form.role" class="select">
                  <option v-for="(label, value) in roleLabels" :key="value" :value="value">{{ label }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Modo de participación</label>
                <select v-model="form.tier" class="select">
                  <option v-for="t in tiersStore.visibleTiers" :key="t.slug" :value="t.slug">{{ t.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Afiliación</label>
              <input v-model="form.affiliation" class="input" placeholder="ej. Facultad de Química UNAM" />
            </div>

            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea v-model="form.bio" class="input" rows="3" />
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="form-group">
                <label class="form-label">Alcaldía</label>
                <input v-model="form.alcaldia" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">Avatar URL</label>
                <input v-model="form.avatarUrl" class="input" placeholder="https://..." />
              </div>
            </div>

            <details class="rounded-lg border border-gray-200 p-3">
              <summary class="cursor-pointer text-sm font-medium text-ink">Métricas avanzadas</summary>
              <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div class="form-group">
                  <label class="form-label text-xs">Score</label>
                  <input v-model.number="form.reputationScore" type="number" class="input" />
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">Validadas</label>
                  <input v-model.number="form.validatedContributions" type="number" class="input" />
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">Rechazadas</label>
                  <input v-model.number="form.rejectedContributions" type="number" class="input" />
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">Calidad media</label>
                  <input v-model.number="form.averageQuality" type="number" min="0" max="100" class="input" />
                </div>
              </div>
            </details>

            <div class="flex flex-col gap-2 md:flex-row md:gap-6">
              <label class="checkbox-label">
                <input v-model="form.publicProfile" type="checkbox" class="checkbox" />
                Perfil público
              </label>
              <label class="checkbox-label">
                <input v-model="form.verified" type="checkbox" class="checkbox" />
                Identidad verificada
              </label>
            </div>

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
