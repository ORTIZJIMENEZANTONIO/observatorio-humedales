<script setup lang="ts">
defineProps<{
  compact?: boolean
}>()
</script>

<template>
  <section class="hero-section relative overflow-hidden flex items-center" :class="compact ? 'py-10 md:py-12' : 'py-12 md:py-16'">
    <div class="hero-bg" aria-hidden="true">
      <span class="lava-orb orb--t1" />
      <span class="lava-orb orb--t2" />
      <span class="lava-orb orb--t3" />
      <span class="lava-orb orb--a1" />
    </div>
    <div class="container-wide relative z-10">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(160deg, #094E5C 0%, #0D6B7E 35%, #1088A0 70%, #0D6B7E 100%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
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

.orb--t1 {
  width: 600px; height: 600px;
  top: -180px; left: -120px;
  background: radial-gradient(circle, rgba(13, 107, 126, 0.85) 0%, rgba(13, 107, 126, 0) 70%);
  animation: lavaA 10s ease-in-out infinite;
}
.orb--t2 {
  width: 500px; height: 500px;
  top: -60px; right: -100px;
  background: radial-gradient(circle, rgba(16, 136, 160, 0.75) 0%, rgba(16, 136, 160, 0) 70%);
  animation: lavaB 13s ease-in-out infinite;
}
.orb--t3 {
  width: 650px; height: 650px;
  bottom: -180px; left: 20%;
  background: radial-gradient(circle, rgba(9, 78, 92, 0.80) 0%, rgba(9, 78, 92, 0) 70%);
  animation: lavaC 16s ease-in-out infinite;
}
.orb--a1 {
  width: 380px; height: 380px;
  top: 30%; right: 20%;
  background: radial-gradient(circle, rgba(67, 160, 71, 0.45) 0%, rgba(67, 160, 71, 0) 70%);
  animation: lavaD 11s ease-in-out infinite;
  opacity: 0.45;
}

@keyframes lavaA {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(50px, 20px, 0) scale(1.06); }
  50%  { transform: translate3d(15px, 50px, 0) scale(0.95); }
  75%  { transform: translate3d(-30px, 30px, 0) scale(1.04); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes lavaB {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(-40px, 30px, 0) scale(1.05); }
  50%  { transform: translate3d(-60px, 8px, 0) scale(0.93); }
  75%  { transform: translate3d(-15px, -20px, 0) scale(1.03); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes lavaC {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(30px, -40px, 0) scale(1.08); }
  50%  { transform: translate3d(70px, -15px, 0) scale(0.92); }
  75%  { transform: translate3d(20px, -45px, 0) scale(1.05); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes lavaD {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  33%  { transform: translate3d(20px, -15px, 0) scale(1.05); }
  66%  { transform: translate3d(-12px, 18px, 0) scale(0.97); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .lava-orb { animation: none; }
}
</style>
