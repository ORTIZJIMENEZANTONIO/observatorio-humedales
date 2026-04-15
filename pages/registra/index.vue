<template>
  <div>
    <section class="bg-gradient-to-r from-primary-800 to-primary py-12">
      <div class="container-wide">
        <h1 class="text-3xl font-extrabold text-white md:text-4xl">Registra tu humedal artificial</h1>
        <p class="mt-2 text-base text-white/80">Propón un humedal artificial para el inventario. Completa los datos técnicos y adjunta documentación de respaldo.</p>
      </div>
    </section>

    <section class="bg-surface py-16">
      <div class="container-narrow">
        <!-- Stepper -->
        <div class="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-2">
            <div :class="[currentStep >= i ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-200 text-ink-muted', 'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300']">
              <Icon v-if="currentStep > i" name="lucide:check" size="20" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="hidden text-sm sm:block" :class="currentStep >= i ? 'text-ink font-medium' : 'text-ink-muted'">{{ step.label }}</span>
            <div v-if="i < steps.length - 1" class="hidden h-0.5 w-8 rounded-full sm:block md:w-12 transition-colors duration-300" :class="currentStep > i ? 'bg-primary' : 'bg-gray-200'" />
          </div>
        </div>

        <!-- Step 1: Datos técnicos -->
        <div v-show="currentStep === 0" class="panel space-y-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Icon name="lucide:clipboard-list" size="20" class="text-primary" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-ink">Datos técnicos del humedal</h2>
              <p class="text-xs text-slate-custom">Los campos con * son obligatorios</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre del humedal <span class="text-alert">*</span></label>
              <div class="input-icon-wrapper">
                <Icon name="lucide:droplets" size="18" class="input-icon" />
                <input v-model="form.nombre" type="text" class="input" placeholder="Ej: Humedal Artificial del Parque..." />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Alcaldía <span class="text-alert">*</span></label>
              <select v-model="form.alcaldia" class="select w-full">
                <option value="">Seleccionar alcaldía...</option>
                <option v-for="a in alcaldias" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Ubicación específica</label>
            <div class="input-icon-wrapper">
              <Icon name="lucide:map-pin" size="18" class="input-icon" />
              <input v-model="form.ubicacion" type="text" class="input" placeholder="Ej: Interior del parque, zona norte..." />
            </div>
            <p class="form-hint">Describe la ubicación dentro de la alcaldía</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tipo de humedal <span class="text-alert">*</span></label>
              <select v-model="form.tipoHumedal" class="select w-full">
                <option value="">Seleccionar tipo...</option>
                <option value="conservacion">Conservación</option>
                <option value="tratamiento_aguas">Tratamiento de aguas</option>
                <option value="recreativo">Recreativo</option>
                <option value="captacion_pluvial">Captación pluvial</option>
                <option value="restauracion_hidrologica">Restauración hidrológica</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de flujo</label>
              <select v-model="form.tipoFlujo" class="select w-full">
                <option value="">Seleccionar flujo...</option>
                <option value="superficial">Flujo superficial</option>
                <option value="subsuperficial_horizontal">Flujo subsuperficial horizontal</option>
                <option value="subsuperficial_vertical">Flujo subsuperficial vertical</option>
                <option value="combinado">Combinado (HAFSS + HAFS)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Tipo de vegetación</label>
            <div class="flex flex-wrap gap-5">
              <label v-for="veg in vegOptions" :key="veg.value" class="checkbox-label">
                <input type="checkbox" :value="veg.value" v-model="form.tipoVegetacion" class="checkbox" />
                <span>{{ veg.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Función principal <span class="text-alert">*</span></label>
            <textarea v-model="form.funcionPrincipal" class="input" rows="2" placeholder="Describa la función principal del humedal..." />
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Superficie (m²)</label>
              <input v-model.number="form.superficie" type="number" class="input" placeholder="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Volumen (m³)</label>
              <input v-model.number="form.volumen" type="number" class="input" placeholder="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Año de implementación</label>
              <input v-model="form.anio" type="text" class="input" placeholder="Ej: 2023" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Sustrato</label>
              <input v-model="form.sustrato" type="text" class="input" placeholder="Ej: Grava, tezontle, arena..." />
            </div>
            <div class="form-group">
              <label class="form-label">Especies de vegetación</label>
              <input v-model="form.vegetacionTexto" type="text" class="input" placeholder="Ej: Typha, Juncus (separar con coma)" />
            </div>
          </div>
        </div>

        <!-- Step 2: Documento de respaldo -->
        <div v-show="currentStep === 1" class="panel space-y-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Icon name="lucide:file-text" size="20" class="text-secondary-dark" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-ink">Documento de respaldo</h2>
              <p class="text-xs text-slate-custom">Proporciona una referencia académica o documento oficial</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Enlace al documento o publicación</label>
            <div class="input-icon-wrapper">
              <Icon name="lucide:link" size="18" class="input-icon" />
              <input v-model="form.documentoLink" type="url" class="input" placeholder="https://..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción del documento</label>
            <textarea v-model="form.documentoDescripcion" class="input" rows="3" placeholder="Título del artículo, revista, autores, año..." />
          </div>

          <div class="form-group">
            <label class="form-label">Institución o grupo de investigación</label>
            <div class="input-icon-wrapper">
              <Icon name="lucide:building-2" size="18" class="input-icon" />
              <input v-model="form.institucion" type="text" class="input" placeholder="Ej: Facultad de Química, UNAM" />
            </div>
          </div>

          <div class="flex items-start gap-3 rounded-card border border-accent/30 bg-accent/5 p-4">
            <Icon name="lucide:info" size="18" class="mt-0.5 shrink-0 text-accent-dark" />
            <p class="text-sm text-accent-dark">
              La imagen del humedal podrá subirse una vez que la propuesta sea aprobada por el equipo del observatorio.
            </p>
          </div>
        </div>

        <!-- Step 3: Confirmación -->
        <div v-show="currentStep === 2" class="panel space-y-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Icon name="lucide:send" size="20" class="text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-ink">Confirmación y envío</h2>
          </div>

          <div class="rounded-lg border border-gray-100 bg-surface p-6 space-y-4">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-ink-muted uppercase tracking-wider">
              <Icon name="lucide:clipboard-check" size="16" />
              Resumen de la propuesta
            </h3>
            <dl class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div v-if="form.nombre"><dt class="text-ink-muted">Nombre</dt><dd class="font-medium">{{ form.nombre }}</dd></div>
              <div v-if="form.alcaldia"><dt class="text-ink-muted">Alcaldía</dt><dd class="font-medium">{{ form.alcaldia }}</dd></div>
              <div v-if="form.tipoHumedal"><dt class="text-ink-muted">Tipo</dt><dd class="font-medium">{{ formatters.formatTipoHumedal(form.tipoHumedal) }}</dd></div>
              <div v-if="form.tipoFlujo"><dt class="text-ink-muted">Flujo</dt><dd class="font-medium">{{ formatters.formatTipoFlujo(form.tipoFlujo) }}</dd></div>
              <div v-if="form.funcionPrincipal"><dt class="text-ink-muted">Función</dt><dd class="font-medium">{{ form.funcionPrincipal }}</dd></div>
              <div v-if="form.superficie"><dt class="text-ink-muted">Superficie</dt><dd class="font-medium">{{ formatters.formatArea(form.superficie) }}</dd></div>
              <div v-if="form.institucion"><dt class="text-ink-muted">Institución</dt><dd class="font-medium">{{ form.institucion }}</dd></div>
              <div v-if="form.documentoLink"><dt class="text-ink-muted">Documento</dt><dd class="font-medium truncate"><a :href="form.documentoLink" target="_blank" class="text-primary hover:underline">{{ form.documentoLink }}</a></dd></div>
            </dl>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico de contacto <span class="text-alert">*</span></label>
            <div class="input-icon-wrapper">
              <Icon name="lucide:mail" size="18" class="input-icon" />
              <input v-model="form.email" type="email" class="input" placeholder="investigador@ejemplo.com" />
            </div>
            <p class="form-hint">Te notificaremos sobre el estado de tu propuesta</p>
          </div>

          <div v-if="submitted" class="rounded-2xl border border-eco/30 bg-eco/5 p-6 text-center">
            <Icon name="lucide:check-circle-2" size="48" class="mx-auto text-eco" />
            <h3 class="mt-3 text-lg font-semibold text-primary">Propuesta enviada</h3>
            <p class="mt-1 text-sm text-slate-custom">Tu propuesta será revisada por el equipo del observatorio. Te notificaremos al correo proporcionado.</p>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="mt-8 flex items-center justify-between">
          <button v-if="currentStep > 0" @click="currentStep--" class="btn-outline">
            <Icon name="lucide:arrow-left" size="16" />
            Anterior
          </button>
          <div v-else />
          <button v-if="currentStep < steps.length - 1" @click="currentStep++" class="btn-primary" :disabled="!canAdvance">
            Siguiente
            <Icon name="lucide:arrow-right" size="16" />
          </button>
          <button v-else-if="!submitted" @click="submitForm" class="btn-primary" :disabled="!form.email">
            <Icon name="lucide:send" size="16" />
            Enviar propuesta
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const formatters = useFormatters()

const currentStep = ref(0)
const submitted = ref(false)

const steps = [
  { label: 'Datos técnicos' },
  { label: 'Documento' },
  { label: 'Confirmación' },
]

const alcaldias = [
  'Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán',
  'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco',
  'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta',
  'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco',
]

const vegOptions = [
  { value: 'flotante', label: 'Flotante' },
  { value: 'emergente', label: 'Emergente' },
  { value: 'sumergida', label: 'Sumergida' },
]

const form = reactive({
  nombre: '',
  alcaldia: '',
  ubicacion: '',
  tipoHumedal: '',
  tipoFlujo: '',
  tipoVegetacion: [] as string[],
  funcionPrincipal: '',
  superficie: null as number | null,
  volumen: null as number | null,
  anio: '',
  sustrato: '',
  vegetacionTexto: '',
  documentoLink: '',
  documentoDescripcion: '',
  institucion: '',
  email: '',
})

const canAdvance = computed(() => {
  if (currentStep.value === 0) return form.nombre && form.alcaldia && form.tipoHumedal && form.funcionPrincipal
  return true
})

function submitForm() {
  submitted.value = true
}
</script>
