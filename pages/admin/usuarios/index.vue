<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

import type { AdminUser, AdminRole, AdminPermission } from '~/types'

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const obs = config.public.observatory as string
const auth = useAuthStore()

const { available: backendAvailable, check: checkBackend } = useBackendStatus()
const loading = ref(true)
const users = ref<AdminUser[]>([])
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)

const allPermissions: { key: AdminPermission; label: string }[] = [
  { key: 'manage_cms', label: 'Contenido (CMS)' },
  { key: 'manage_humedales', label: 'Inventario humedales' },
  { key: 'manage_hallazgos', label: 'Hallazgos' },
  { key: 'manage_notihumedal', label: 'Notihumedal' },
  { key: 'manage_prospectos', label: 'Prospectos' },
  { key: 'manage_users', label: 'Gestion de usuarios' },
]

const form = reactive({
  email: '',
  name: '',
  password: '',
  role: 'editor' as AdminRole,
  permissions: [] as AdminPermission[],
})

function resetForm() {
  form.email = ''
  form.name = ''
  form.password = ''
  form.role = 'editor'
  form.permissions = []
  editingId.value = null
}

function currentUserFallback(): AdminUser[] {
  if (!auth.admin) return []
  return [{
    id: auth.admin.id,
    email: auth.admin.email,
    name: auth.admin.name || '',
    role: auth.admin.role || 'superadmin',
    permissions: auth.admin.permissions || [],
    lastLogin: new Date().toISOString(),
  }]
}

async function loadUsers() {
  loading.value = true
  const isOnline = await checkBackend()
  if (!isOnline) {
    users.value = currentUserFallback()
    loading.value = false
    return
  }
  try {
    const res = await apiFetch(`/observatory/${obs}/admin/usuarios`)
    users.value = (res as any).items || (res as any).data || []
  } catch {
    users.value = currentUserFallback()
  }
  loading.value = false
}

async function saveUser() {
  saving.value = true
  const body: any = {
    name: form.name,
    email: form.email,
    role: form.role,
    permissions: form.role === 'superadmin' ? allPermissions.map(p => p.key) : form.permissions,
  }
  if (form.password) body.password = form.password

  try {
    if (editingId.value) {
      await apiFetch(`/observatory/${obs}/admin/usuarios/${editingId.value}`, { method: 'PATCH', body })
    } else {
      await apiFetch(`/observatory/${obs}/admin/usuarios`, { method: 'POST', body })
    }
    showForm.value = false
    resetForm()
    await loadUsers()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al guardar usuario')
  }
  saving.value = false
}

async function deleteUser(row: AdminUser) {
  if (row.id === auth.admin?.id) { alert('No puedes eliminar tu propia cuenta'); return }
  if (!confirm(`Eliminar usuario "${row.name || row.email}"?`)) return
  try {
    await apiFetch(`/observatory/${obs}/admin/usuarios/${row.id}`, { method: 'DELETE' })
    await loadUsers()
  } catch (e: any) {
    alert(e?.data?.error?.message || 'Error al eliminar')
  }
}

function editUser(row: AdminUser) {
  editingId.value = row.id
  form.email = row.email
  form.name = row.name
  form.password = ''
  form.role = row.role
  form.permissions = [...(row.permissions || [])]
  showForm.value = true
}

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol', class: 'w-32' },
  { key: 'permissions', label: 'Permisos' },
  { key: 'lastLogin', label: 'Ultimo acceso', class: 'w-36' },
]

const tableRows = computed(() => users.value.map(u => ({
  ...u,
  permissions: (u.permissions || []).join(', '),
})))

// Admin can't have manage_users; editor can't have manage_users
const availablePermissions = computed(() => {
  if (form.role === 'admin') return allPermissions.filter(p => p.key !== 'manage_users')
  return allPermissions.filter(p => p.key !== 'manage_users')
})

function roleBadgeClass(role: string) {
  if (role === 'superadmin') return 'badge-primary'
  if (role === 'admin') return 'badge-eco'
  return 'badge-secondary'
}

onMounted(() => loadUsers())
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-ink">Gestion de usuarios</h2>
      <p class="mt-1 text-sm text-slate-custom">Crear, editar y asignar roles y permisos a los administradores</p>
    </div>

    <div v-if="!auth.isSuperadmin" class="rounded-2xl border border-alert/30 bg-alert/5 p-6 text-center">
      <p class="text-sm text-alert-dark">Solo los superadministradores pueden gestionar usuarios.</p>
    </div>

    <template v-else>
      <div class="mb-4">
        <button @click="showForm ? (showForm = false, resetForm()) : (resetForm(), showForm = true)" class="btn-primary btn-sm">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          {{ showForm ? 'Cancelar' : 'Nuevo usuario' }}
        </button>
      </div>

      <Transition name="slide-up">
        <div v-if="showForm" class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-4">
          <h3 class="text-base font-semibold text-ink">{{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input v-model="form.name" type="text" class="input" placeholder="Nombre completo" />
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input v-model="form.email" type="email" class="input" placeholder="admin@ejemplo.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ editingId ? 'Nueva contrasena (dejar vacio para mantener)' : 'Contrasena *' }}</label>
              <input v-model="form.password" type="password" class="input" placeholder="********" />
            </div>
            <div class="form-group">
              <label class="form-label">Rol *</label>
              <select v-model="form.role" class="select w-full">
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Superadministrador</option>
              </select>
              <p class="form-hint">
                {{ form.role === 'superadmin' ? 'Acceso total a todas las secciones, incluyendo gestion de usuarios' : form.role === 'admin' ? 'Acceso a las secciones asignadas (sin gestion de usuarios)' : 'Acceso limitado segun permisos asignados' }}
              </p>
            </div>
          </div>

          <div v-if="form.role !== 'superadmin'" class="form-group">
            <label class="form-label">Permisos asignados</label>
            <p class="form-hint mb-2">Selecciona las secciones a las que tendra acceso este usuario</p>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <label
                v-for="perm in availablePermissions"
                :key="perm.key"
                class="checkbox-label"
              >
                <input type="checkbox" :value="perm.key" v-model="form.permissions" class="checkbox" />
                <span>{{ perm.label }}</span>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button @click="saveUser" class="btn-primary" :disabled="saving || !form.name || !form.email || (!editingId && !form.password)">
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear usuario') }}
            </button>
            <button @click="showForm = false; resetForm()" class="btn-ghost">Cancelar</button>
          </div>
        </div>
      </Transition>

      <AdminDataTable
        :columns="columns"
        :rows="tableRows"
        :loading="loading"
        search-placeholder="Buscar usuarios..."
        @edit="editUser"
        @delete="deleteUser"
      >
        <template #cell-role="{ value }">
          <span :class="['badge', roleBadgeClass(value)]">{{ value }}</span>
        </template>
        <template #cell-permissions="{ value }">
          <div class="flex flex-wrap gap-1">
            <span v-for="p in (value || '').split(',').filter(Boolean)" :key="p" class="badge bg-gray-100 text-ink-muted text-[10px]">{{ p.trim().replace('manage_', '') }}</span>
          </div>
        </template>
      </AdminDataTable>
    </template>
  </div>
</template>
