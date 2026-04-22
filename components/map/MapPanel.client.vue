<template>
  <div ref="mapContainer" class="h-full w-full cursor-pointer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useHumedalesStore } from '~/stores/humedales'
import { useMapConfig } from '~/composables/useMapConfig'
import { useFormatters } from '~/composables/useFormatters'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

const store = useHumedalesStore()
const { defaultCenter, defaultZoom, tileUrl, tileAttribution, humedalMarkerStyle } = useMapConfig()
const { formatTipoHumedal, formatArea } = useFormatters()

function buildPopup(h: any): string {
  const superficie = h.superficie ? formatArea(h.superficie) : 'No especificada'
  const servicios = h.serviciosDescripcion.slice(0, 3).join(', ')
  return `
    <div style="padding: 16px; font-family: Inter, system-ui, sans-serif;">
      <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1F2937;">${h.nombre}</h3>
      <p style="margin: 0 0 8px; font-size: 11px; color: #6B7280;">${h.alcaldia} · ${h.anioImplementacion}</p>
      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #374151;">
        <div><strong>Tipo:</strong> ${formatTipoHumedal(h.tipoHumedal)}</div>
        <div><strong>Superficie:</strong> ${superficie}</div>
        <div><strong>Función:</strong> ${h.funcionPrincipal}</div>
        <div><strong>Servicios:</strong> ${servicios}</div>
      </div>
    </div>
  `
}

onMounted(() => {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value, { center: defaultCenter, zoom: defaultZoom, zoomControl: true })
  L.tileLayer(tileUrl, { attribution: tileAttribution }).addTo(map)
  for (const h of store.filtered) {
    L.circleMarker([h.lat, h.lng], humedalMarkerStyle)
      .bindPopup(buildPopup(h), { maxWidth: 320 })
      .addTo(map)
  }
})

onUnmounted(() => { if (map) { map.remove(); map = null } })
</script>
