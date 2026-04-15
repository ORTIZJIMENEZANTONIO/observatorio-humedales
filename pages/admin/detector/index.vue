<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })
// Detector merged into /admin/prospectos — redirect
navigateTo('/admin/prospectos', { redirectCode: 301 })
</script>

<template>
  <div class="flex items-center justify-center p-12 text-sm text-gray-400">
    Redirigiendo a prospectos...
  </div>
</template>
