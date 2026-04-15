<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  field: 'bg' | 'iconColor' | 'accentColor' | 'badgeClass'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

interface ColorOption {
  label: string
  value: string
  hex: string
  hexBg?: string
}

const colorOptions: Record<string, ColorOption[]> = {
  bg: [
    { label: 'Teal claro', value: 'bg-primary-50', hex: '#0D6B7E', hexBg: '#E6F4F7' },
    { label: 'Verde claro', value: 'bg-eco/10', hex: '#43A047', hexBg: '#eaf5ea' },
    { label: 'Azul claro', value: 'bg-secondary/10', hex: '#4FC3F7', hexBg: '#ecf7fe' },
    { label: 'Amarillo claro', value: 'bg-accent/10', hex: '#F2A81D', hexBg: '#fef6e8' },
    { label: 'Rojo claro', value: 'bg-alert/10', hex: '#D9363E', hexBg: '#fceaeb' },
    { label: 'Gris claro', value: 'bg-gray-50', hex: '#6B7280', hexBg: '#F9FAFB' },
    { label: 'Superficie', value: 'bg-surface', hex: '#8B8B76', hexBg: '#F7F8F4' },
    { label: 'Blanco', value: 'bg-white', hex: '#D1D5DB', hexBg: '#FFFFFF' },
  ],
  iconColor: [
    { label: 'Teal', value: 'text-primary', hex: '#0D6B7E' },
    { label: 'Teal oscuro', value: 'text-primary-dark', hex: '#094E5C' },
    { label: 'Verde', value: 'text-eco', hex: '#43A047' },
    { label: 'Verde oscuro', value: 'text-eco-dark', hex: '#2E7D32' },
    { label: 'Azul', value: 'text-secondary', hex: '#4FC3F7' },
    { label: 'Azul oscuro', value: 'text-secondary-dark', hex: '#2196F3' },
    { label: 'Amarillo', value: 'text-accent', hex: '#F2A81D' },
    { label: 'Amarillo oscuro', value: 'text-accent-dark', hex: '#D99517' },
    { label: 'Rojo', value: 'text-alert', hex: '#D9363E' },
    { label: 'Gris', value: 'text-slate-custom', hex: '#5E6B78' },
    { label: 'Negro', value: 'text-ink', hex: '#1F2937' },
  ],
  accentColor: [
    { label: 'Teal', value: 'bg-primary', hex: '#0D6B7E' },
    { label: 'Verde', value: 'bg-eco', hex: '#43A047' },
    { label: 'Azul', value: 'bg-secondary', hex: '#4FC3F7' },
    { label: 'Amarillo', value: 'bg-accent', hex: '#F2A81D' },
    { label: 'Rojo', value: 'bg-alert', hex: '#D9363E' },
    { label: 'Gris', value: 'bg-slate-custom', hex: '#5E6B78' },
  ],
  badgeClass: [
    { label: 'Teal', value: 'badge-primary', hex: '#0D6B7E' },
    { label: 'Verde', value: 'badge-eco', hex: '#43A047' },
    { label: 'Azul', value: 'badge-secondary', hex: '#4FC3F7' },
    { label: 'Amarillo', value: 'badge-accent', hex: '#F2A81D' },
    { label: 'Rojo', value: 'badge-alert', hex: '#D9363E' },
  ],
}

const options = computed(() => colorOptions[props.field] || [])

const selected = computed(() =>
  options.value.find(o => o.value === props.modelValue)
)

function select(option: ColorOption) {
  emit('update:modelValue', option.value)
}
</script>

<template>
  <div class="space-y-2">
    <!-- Current selection display -->
    <div v-if="selected" class="flex items-center gap-2 text-xs text-slate-custom">
      <span
        class="inline-block h-4 w-4 rounded-full border border-gray-200"
        :style="{ backgroundColor: selected.hexBg || selected.hex }"
      />
      <span>{{ selected.label }}</span>
    </div>

    <!-- Swatch grid -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="select(option)"
        class="group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all hover:shadow-sm"
        :class="modelValue === option.value
          ? 'border-primary bg-primary-50/50 text-primary ring-1 ring-primary/30'
          : 'border-gray-200 bg-white text-ink-muted hover:border-gray-300'
        "
      >
        <!-- Color swatch -->
        <span
          class="inline-block h-5 w-5 shrink-0 rounded-full border border-gray-200/60 shadow-sm"
          :style="{
            backgroundColor: field === 'bg' ? (option.hexBg || option.hex) : option.hex,
          }"
        />
        <!-- Inner dot for bg colors to show the accent -->
        <span
          v-if="field === 'bg' && option.hexBg"
          class="absolute left-[17px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          :style="{ backgroundColor: option.hex }"
        />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>
