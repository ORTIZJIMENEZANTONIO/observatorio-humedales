<script setup lang="ts">
defineProps<{
  blinking: boolean
}>()
</script>

<template>
  <div class="humedalito-blink-wrap">
    <slot />
    <!--
      Eyelid overlay — two skin-colored ellipses that expand from 0 height
      to cover each eye completely during blink.
      Coordinates from SVG analysis (viewBox 0 0 582 672):
        Left eye area:  cx≈240, cy≈405, spans y374-447 (oval ~70px tall)
        Right eye area: cx≈375, cy≈405, spans y370-447 (oval ~77px tall)
    -->
    <svg
      class="humedalito-eyelids"
      viewBox="0 0 582 672"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <!-- Left eyelid: closes from top down over the entire eye -->
      <ellipse
        cx="240" cy="405"
        rx="35" ry="0"
        class="eyelid"
        :class="{ 'eyelid--closed': blinking }"
        fill="#874120"
      />
      <!-- Right eyelid -->
      <ellipse
        cx="375" cy="405"
        rx="38" ry="0"
        class="eyelid"
        :class="{ 'eyelid--closed': blinking }"
        fill="#874120"
      />
    </svg>
  </div>
</template>

<style scoped>
.humedalito-blink-wrap {
  position: relative;
  display: inline-block;
}

.humedalito-eyelids {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* Eyelid: ry transitions from 0 (open) to full cover (closed) */
.eyelid {
  transition: ry 70ms ease-in;
}

.eyelid--closed {
  ry: 42;
  transition: ry 70ms ease-out;
}
</style>
