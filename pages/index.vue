<template>
  <div>
    <!-- Hero with lava lamp effect -->
    <section
      class="hero-section relative overflow-hidden min-h-[70vh] flex items-center"
    >
      <!-- Lava lamp background -->
      <div class="hero-bg" aria-hidden="true">
        <span class="lava-orb orb--t1"></span>
        <span class="lava-orb orb--t2"></span>
        <span class="lava-orb orb--t3"></span>
        <span class="lava-orb orb--t4"></span>
        <span class="lava-orb orb--a1"></span>
        <span class="lava-orb orb--a2"></span>
      </div>
      <div class="container-wide relative z-10 py-7 md:pt-10 md:pb-16">
        <div
          class="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between lg:gap-16"
        >
          <div class="max-w-2xl">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-light backdrop-blur-sm ring-1 ring-white/10"
            >
              <span
                class="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-glow"
              />
              Plataforma abierta
            </span>
            <h1
              class="mt-6 text-4xl font-extrabold leading-[1.1] text-white md:text-5xl lg:text-6xl"
            >
              Observatorio de<br />
              <span class="text-gradient-hero">Humedales Artificiales</span
              ><br />
              CDMX
            </h1>
            <p
              class="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg"
            >
              Monitoreo, inventario y análisis de humedales artificiales en la
              Ciudad de México. Infraestructura verde y soluciones basadas en la
              naturaleza.
            </p>
            <div class="mt-10 flex flex-wrap gap-3">
              <NuxtLink
                to="/inventario"
                class="btn-lg bg-white text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 inline-flex items-center gap-2 px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Icon name="lucide:compass" size="20" />
                Explorar inventario
              </NuxtLink>
              <NuxtLink
                to="/registra"
                class="btn btn-lg border border-white/25 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Registra tu humedal
              </NuxtLink>
            </div>
          </div>
          <!-- Humedalito SVG — idle breathing, blink, pet easter egg, speech -->
          <div class="shrink-0 relative">
            <div
              class="humedalito-wrap relative"
              :class="{ 'humedalito--petted': isPetted }"
              @mouseenter="showSpeech = true"
              @mouseleave="showSpeech = false"
              @touchstart="toggleSpeechMobile"
            >
              <!-- Speech bubble (diagonal top-right) -->
              <div
                class="speech-bubble"
                :class="{ 'speech-visible': showSpeech }"
              >
                <span class="text-xs font-bold text-primary"
                  >Hola, soy Humedalito</span
                >
              </div>
              <!-- Hearts (pet easter egg) -->
              <div v-if="isPetted" class="humedalito-hearts" aria-hidden="true">
                <span
                  class="humedalito-heart"
                  style="left: 15%; animation-delay: 0s"
                  >💚</span
                >
                <span
                  class="humedalito-heart"
                  style="left: 50%; animation-delay: 0.2s"
                  >💙</span
                >
                <span
                  class="humedalito-heart"
                  style="left: 80%; animation-delay: 0.4s"
                  >💚</span
                >
              </div>
              <CommonHumedalitoBlink :blinking="isBlinking">
                <img
                  src="~/assets/humedalito.svg"
                  alt="Humedalito — mascota del Observatorio de Humedales Artificiales CDMX"
                  class="humedalito-img h-44 w-44 object-contain md:h-56 md:w-56 lg:h-64 lg:w-64"
                  :class="{ 'humedalito--speaking': showSpeech }"
                  loading="lazy"
                  @pointerdown.prevent="petHumedalito"
                />
              </CommonHumedalitoBlink>
            </div>
            <!-- Humedalito name 
            <p class="mt-3 text-center text-xs font-semibold text-white/60 tracking-wide">Humedalito</p>
            -->
          </div>
        </div>
      </div>
    </section>

    <!-- KPIs — Bento-inspired, interactive -->
    <section ref="kpiSection" class="relative -mt-10 z-10 pb-8">
      <div class="container-wide">
        <div
          class="stagger-children grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6"
        >
          <NuxtLink
            v-for="kpi in kpis"
            :key="kpi.label"
            :to="kpiLink(kpi.color)"
            class="reveal kpi-card cursor-pointer rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100/60 p-4 shadow-lg shadow-black/[0.03] text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 group"
          >
            <div
              :class="[
                'mx-auto flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6',
                kpiIconBg(kpi.color),
              ]"
            >
              <Icon
                :name="kpiIcons[kpi.color] || 'lucide:droplets'"
                size="18"
                :class="kpiIconColor(kpi.color)"
              />
            </div>
            <p
              class="mt-3 text-2xl font-extrabold text-ink tracking-tight transition-colors duration-300 group-hover:text-primary"
            >
              {{ kpi.valor }}
            </p>
            <p class="text-xs font-medium text-slate-custom leading-snug">
              {{ kpi.label }}
            </p>
            <p v-if="kpi.unidad" class="text-[10px] text-ink-muted mt-0.5">
              {{ kpi.unidad }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Qué es -->
    <section ref="aboutSection" class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle
          title="¿Qué es el observatorio?"
          subtitle="Una plataforma integral para el monitoreo, análisis y visualización de humedales artificiales en la Ciudad de México."
          :centered="true"
          tag="Acerca de"
        />
        <div class="stagger-children grid grid-cols-1 gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="feature in features"
            :key="feature.title"
            :to="feature.to"
            class="card-interactive p-6 reveal group text-center"
          >
            <div
              :class="[
                'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                feature.bg,
              ]"
            >
              <Icon :name="feature.icon" size="24" :class="feature.iconColor" />
            </div>
            <h3 class="text-base font-bold text-ink">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">
              {{ feature.description }}
            </p>
            <span
              class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
            >
              Explorar
              <Icon name="lucide:arrow-right" size="14" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section ref="stepsSection" class="bg-white py-20">
      <div class="container-wide">
        <CommonSectionTitle
          title="Cómo funciona"
          subtitle="Un flujo de trabajo que integra datos geoespaciales, caracterización técnica y análisis de servicios ecosistémicos."
          :centered="true"
          tag="Proceso"
        />
        <div class="relative">
          <div
            class="absolute left-1/2 top-12 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-primary/20 via-primary/40 to-eco/20 lg:block"
          />
          <div
            class="stagger-children grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            <div
              v-for="(step, index) in steps"
              :key="step.title"
              class="relative text-center reveal"
            >
              <div
                class="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-lg font-bold text-white shadow-lg shadow-primary/20"
              >
                {{ index + 1 }}
              </div>
              <h4 class="text-base font-bold text-ink">{{ step.title }}</h4>
              <p class="mt-2 text-sm text-slate-custom leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tipologías -->
    <section ref="typesSection" class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle
          title="Tipologías de humedales artificiales"
          subtitle="Tres categorías principales identificadas en el inventario de la Ciudad de México."
          :centered="true"
          tag="Clasificación"
        />
        <div class="stagger-children grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            v-for="tipo in tipologias"
            :key="tipo.title"
            class="card p-6 reveal text-center"
          >
            <span :class="['badge mb-3 inline-block', tipo.badgeClass]">{{
              tipo.badge
            }}</span>
            <h3 class="text-base font-bold text-ink">{{ tipo.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-custom">
              {{ tipo.description }}
            </p>
            <p class="mt-4 text-xs text-ink-muted">
              <span class="font-semibold">Ejemplos:</span> {{ tipo.examples }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios ecosistémicos -->
    <section ref="servicesSection" class="bg-white py-20">
      <div class="container-wide">
        <CommonSectionTitle
          title="Servicios ecosistémicos"
          subtitle="Principales beneficios ambientales que proveen los humedales artificiales de la CDMX."
          :centered="true"
          tag="Beneficios"
        />
        <div
          class="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          <div
            v-for="srv in servicios"
            :key="srv.title"
            class="card-flat p-4 text-center reveal group hover:border-primary/20 transition-colors cursor-pointer"
          >
            <div
              class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon :name="srv.icon" size="22" class="text-primary" />
            </div>
            <h4 class="text-xs font-bold text-ink leading-snug">
              {{ srv.title }}
            </h4>
          </div>
        </div>
      </div>
    </section>

    <!-- ODS Teaser -->
    <section class="bg-surface py-20">
      <div class="container-wide">
        <CommonSectionTitle
          title="Alineación con la Agenda 2030"
          subtitle="Los humedales artificiales contribuyen directamente a cuatro Objetivos de Desarrollo Sostenible."
          :centered="true"
          tag="ODS"
        />
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <NuxtLink
            v-for="ods in odsTeaser"
            :key="ods.numero"
            to="/sobre#ods"
            class="card-interactive p-5 text-center group"
          >
            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white text-lg font-bold shadow-lg transition-transform duration-300 group-hover:scale-110"
              :style="{
                backgroundColor: ods.color,
                boxShadow: `0 8px 24px ${ods.color}30`,
              }"
            >
              {{ ods.numero }}
            </div>
            <p class="mt-4 text-sm font-bold text-ink">{{ ods.nombre }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Map Teaser -->
    <section class="bg-white py-20">
      <div class="container-wide">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <CommonSectionTitle
              title="Explora la ubicación de los humedales artificiales"
              subtitle="Visualiza los 8 humedales artificiales inventariados en un mapa interactivo con datos técnicos detallados."
              tag="Mapa"
            />
            <NuxtLink to="/mapa" class="btn-primary">
              <Icon name="lucide:map" size="16" />
              Ver mapa completo
            </NuxtLink>
          </div>
          <div
            class="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 via-secondary/10 to-eco/10 border border-primary/10"
          >
            <Icon name="lucide:map" size="64" class="text-primary/20" />
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="bg-surface py-10">
      <div class="container-narrow">
        <div
          class="rounded-2xl border border-accent/20 bg-accent/5 p-5 text-center"
        >
          <p class="text-sm text-ink-muted">
            <strong class="text-accent-dark">Fuente de datos:</strong>
            Inventario de humedales artificiales en la Ciudad de México, Fase 1.
            Elaboración: M. en C. Diego Domínguez Solís — Instituto Politécnico
            Nacional.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { kpis } from "~/data/kpis";

const { kpiIconBg, kpiIconColor } = useFormatters();

const kpiIcons: Record<string, string> = {
  primary: "lucide:droplets",
  eco: "lucide:leaf",
  secondary: "lucide:map-pin",
  accent: "lucide:layers",
};

function kpiLink(color: string): string {
  const map: Record<string, string> = {
    primary: "/inventario",
    eco: "/analisis/indicadores",
    secondary: "/analisis/brecha",
    accent: "/analisis/indicadores",
  };
  return map[color] || "/inventario";
}

const odsTeaser = [
  { numero: 6, nombre: "Agua limpia", color: "#26BDE2" },
  { numero: 11, nombre: "Ciudades sostenibles", color: "#FD9D24" },
  { numero: 13, nombre: "Acción por el clima", color: "#3F7E44" },
  { numero: 15, nombre: "Vida de ecosistemas", color: "#56C02B" },
];

// ── Humedalito animation system (adapted from Bolillo pattern) ──
const isBlinking = ref(false);
const showSpeech = ref(false);
const isPetted = ref(false);
const petCount = ref(0);
let lastPetTime = 0;

let blinkTimer: ReturnType<typeof setTimeout> | null = null;
let petResetTimer: ReturnType<typeof setTimeout> | null = null;
let petEndTimer: ReturnType<typeof setTimeout> | null = null;
let speechHideTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  // Blink: randomized 3-5s interval, 150ms squish (like Bolillo)
  const scheduleBlink = () => {
    blinkTimer = setTimeout(() => {
      isBlinking.value = true;
      setTimeout(() => {
        isBlinking.value = false;
      }, 150);
      scheduleBlink();
    }, 2600);
  };
  scheduleBlink();
});

onUnmounted(() => {
  if (blinkTimer) clearTimeout(blinkTimer);
  if (petResetTimer) clearTimeout(petResetTimer);
  if (petEndTimer) clearTimeout(petEndTimer);
  if (speechHideTimer) clearTimeout(speechHideTimer);
});

// Mobile: tap toggles speech, auto-hide after 2.5s
function toggleSpeechMobile() {
  showSpeech.value = !showSpeech.value;
  if (speechHideTimer) clearTimeout(speechHideTimer);
  if (showSpeech.value) {
    speechHideTimer = setTimeout(() => {
      showSpeech.value = false;
    }, 2500);
  }
}

// Pet easter egg: tap 5 times in 3s → hearts + wiggle (like Bolillo)
function petHumedalito() {
  if (isPetted.value) return;
  const now = Date.now();
  if (now - lastPetTime < 100) return;
  lastPetTime = now;
  petCount.value++;

  if (petResetTimer) clearTimeout(petResetTimer);
  petResetTimer = setTimeout(() => {
    petCount.value = 0;
  }, 3000);

  if (petCount.value >= 5) {
    isPetted.value = true;
    petCount.value = 0;
    if (petEndTimer) clearTimeout(petEndTimer);
    petEndTimer = setTimeout(() => {
      isPetted.value = false;
    }, 3000);
  }
}

const { revealRef: kpiSection } = useScrollReveal({ stagger: true });
const { revealRef: aboutSection } = useScrollReveal({ stagger: true });
const { revealRef: stepsSection } = useScrollReveal({ stagger: true });
const { revealRef: typesSection } = useScrollReveal({ stagger: true });
const { revealRef: servicesSection } = useScrollReveal({ stagger: true });

const { items: features } = useCmsContent("home", "features");
const { items: steps } = useCmsContent("home", "steps");
const { items: tipologias } = useCmsContent("home", "tipologias");
const { items: servicios } = useCmsContent("home", "servicios");
</script>

<style scoped>
.text-gradient-hero {
  background: linear-gradient(135deg, #4fc3f7 0%, #43a047 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═══════════════════════════════════════
   Lava lamp hero background
   Adapted from cercu-frontend pattern
   Colors: teal (#0D6B7E), eco (#43A047), secondary (#4FC3F7), accent (#F2A81D)
   ═══════════════════════════════════════ */
.hero-section {
  background: linear-gradient(
    160deg,
    #094e5c 0%,
    #0d6b7e 35%,
    #1088a0 70%,
    #0d6b7e 100%
  );
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  background: radial-gradient(
      ellipse 60% 50% at 20% 50%,
      rgba(13, 107, 126, 0.3) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 50% 60% at 80% 30%,
      rgba(16, 136, 160, 0.2) 0%,
      transparent 70%
    );
}

.lava-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(26px);
  transform: translate3d(0, 0, 0);
  will-change: transform;
  mix-blend-mode: screen;
  opacity: 0.9;
}

/* Teal orbs (primary) */
.orb--t1 {
  width: 700px;
  height: 700px;
  top: -200px;
  left: -150px;
  background: radial-gradient(
    circle,
    rgba(13, 107, 126, 0.85) 0%,
    rgba(13, 107, 126, 0) 70%
  );
  animation: lavaA 10s ease-in-out infinite;
}
.orb--t2 {
  width: 620px;
  height: 620px;
  top: -80px;
  right: -120px;
  background: radial-gradient(
    circle,
    rgba(16, 136, 160, 0.8) 0%,
    rgba(16, 136, 160, 0) 70%
  );
  animation: lavaB 13s ease-in-out infinite;
}
.orb--t3 {
  width: 800px;
  height: 800px;
  bottom: -200px;
  left: 10%;
  background: radial-gradient(
    circle,
    rgba(9, 78, 92, 0.88) 0%,
    rgba(9, 78, 92, 0) 70%
  );
  animation: lavaC 16s ease-in-out infinite;
}
.orb--t4 {
  width: 560px;
  height: 560px;
  bottom: -120px;
  right: 5%;
  background: radial-gradient(
    circle,
    rgba(13, 107, 126, 0.6) 0%,
    rgba(13, 107, 126, 0) 70%
  );
  animation: lavaD 12s ease-in-out infinite;
}

/* Accent orbs (eco green + secondary blue) */
.orb--a1 {
  width: 450px;
  height: 450px;
  top: 20%;
  left: 35%;
  background: radial-gradient(
    circle,
    rgba(67, 160, 71, 0.55) 0%,
    rgba(67, 160, 71, 0) 70%
  );
  animation: lavaE 11s ease-in-out infinite;
  opacity: 0.5;
}
.orb--a2 {
  width: 400px;
  height: 400px;
  bottom: 10%;
  right: 25%;
  background: radial-gradient(
    circle,
    rgba(79, 195, 247, 0.45) 0%,
    rgba(79, 195, 247, 0) 70%
  );
  animation: lavaF 14s ease-in-out infinite;
  mix-blend-mode: overlay;
  opacity: 0.38;
}

@keyframes lavaA {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(60px, 30px, 0) scale(1.08);
  }
  50% {
    transform: translate3d(20px, 70px, 0) scale(0.95);
  }
  75% {
    transform: translate3d(-40px, 40px, 0) scale(1.05);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes lavaB {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(-50px, 40px, 0) scale(1.06);
  }
  50% {
    transform: translate3d(-80px, 10px, 0) scale(0.92);
  }
  75% {
    transform: translate3d(-20px, -30px, 0) scale(1.04);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes lavaC {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(40px, -50px, 0) scale(1.1);
  }
  50% {
    transform: translate3d(90px, -20px, 0) scale(0.9);
  }
  75% {
    transform: translate3d(30px, -60px, 0) scale(1.06);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes lavaD {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(-30px, -40px, 0) scale(1.05);
  }
  50% {
    transform: translate3d(-70px, -10px, 0) scale(0.93);
  }
  75% {
    transform: translate3d(-20px, 20px, 0) scale(1.08);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes lavaE {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  33% {
    transform: translate3d(25px, -20px, 0) scale(1.06);
  }
  66% {
    transform: translate3d(-15px, 25px, 0) scale(0.96);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes lavaF {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  33% {
    transform: translate3d(-20px, -15px, 0) scale(1.04);
  }
  66% {
    transform: translate3d(15px, 10px, 0) scale(0.97);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/* ═══════════════════════════════════════
   Humedalito animation system
   Adapted from Bolillo (guardianes-del-barrio-verde)
   ═══════════════════════════════════════ */

/* ── Wrapper: idle breathing + float ── */
.humedalito-wrap {
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  animation: humedalitoFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

@keyframes humedalitoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ── Idle breathing on the img ── */
.humedalito-img {
  animation: humedalitoBreathe 3s ease-in-out infinite;
}

@keyframes humedalitoBreathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.015);
  }
}

/* Blink is now handled by CommonHumedalitoBlink component (SVG eyelid overlay) */

/* ── Speaking: gentle bounce when speech bubble visible ── */
.humedalito--speaking {
  animation: humedalitoSpeak 0.4s ease-in-out infinite alternate !important;
}

@keyframes humedalitoSpeak {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-3px) scale(1.02);
  }
}

/* ── Petted easter egg: wiggle ── */
.humedalito--petted .humedalito-img {
  animation: humedalitoPetBounce 0.3s ease-in-out infinite alternate !important;
}

@keyframes humedalitoPetBounce {
  0% {
    transform: translateY(0) rotate(-3deg);
  }
  100% {
    transform: translateY(-5px) rotate(3deg);
  }
}

/* ── Hearts (pet reaction) ── */
.humedalito-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.humedalito-heart {
  position: absolute;
  top: 5%;
  font-size: 18px;
  animation: heartFloat 1s ease-out forwards;
  pointer-events: none;
}

@keyframes heartFloat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-24px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-48px) scale(0.8);
  }
}

/* ── Speech bubble — diagonal top-right ── */
.speech-bubble {
  position: absolute;
  top: 0;
  right: -16px;
  transform: translate(50%, -100%) scale(0.7);
  background: white;
  padding: 6px 14px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  z-index: 20;
  transition: opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid white;
}
.speech-visible {
  opacity: 1;
  transform: translate(50%, -100%) scale(1);
}

/* ═══ KPI hover ═══ */
.kpi-card {
  text-decoration: none;
}

/* ═══ Reduced motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .humedalito-wrap,
  .humedalito-img,
  .lava-orb {
    animation: none;
  }
  .humedalito--speaking,
  .humedalito--petted .humedalito-img {
    animation: none !important;
  }
  .speech-bubble {
    transition: none;
  }
}
</style>
