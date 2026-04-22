<template>
  <div ref="mapContainer" class="h-full w-full cursor-pointer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { AlcaldiaCDMX } from '~/types'
import { useMapConfig } from '~/composables/useMapConfig'

const props = defineProps<{
  alcaldias: AlcaldiaCDMX[]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
const { defaultCenter, defaultZoom, tileUrl, tileAttribution } = useMapConfig()

function getMarkerStyle(a: AlcaldiaCDMX) {
  const base = a.tieneHumedal
    ? { fillColor: '#0D6B7E', color: '#094E5C' }
    : { fillColor: '#D9363E', color: '#A12A30' }
  return {
    ...base,
    radius: a.tieneHumedal ? 10 : 6 + (a.indiceNecesidad || 0) * 1.5,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.75,
  }
}

function buildPopup(a: AlcaldiaCDMX): string {
  const idx = a.indiceNecesidad?.toFixed(1) || '—'
  const estado = a.tieneHumedal
    ? '<span style="color:#0D6B7E;font-weight:600;">Con humedal</span>'
    : '<span style="color:#D9363E;font-weight:600;">Sin humedal</span>'
  return `
    <div style="padding:12px;font-family:Inter,system-ui,sans-serif;min-width:180px;">
      <h3 style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1F2937;">${a.nombre}</h3>
      <p style="margin:0 0 8px;font-size:11px;">${estado}</p>
      <div style="display:flex;flex-direction:column;gap:3px;font-size:12px;color:#374151;">
        <div><strong>Población:</strong> ${a.poblacion.toLocaleString('es-MX')}</div>
        <div><strong>Densidad:</strong> ${a.densidadPoblacional.toLocaleString('es-MX')} hab/km²</div>
        <div><strong>Índice de necesidad:</strong> ${idx}</div>
        <div><strong>Inundación:</strong> ${a.zonasInundacion}/5 · <strong>Calor:</strong> ${a.islasCalor}/5</div>
      </div>
    </div>
  `
}

onMounted(() => {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value, { center: defaultCenter, zoom: defaultZoom, zoomControl: true })
  L.tileLayer(tileUrl, { attribution: tileAttribution }).addTo(map)
  for (const a of props.alcaldias) {
    L.circleMarker([a.lat, a.lng], getMarkerStyle(a))
      .bindPopup(buildPopup(a), { maxWidth: 300 })
      .addTo(map)
  }
})

onUnmounted(() => { if (map) { map.remove(); map = null } })
</script>
