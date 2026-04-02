export function useMapConfig() {
  const defaultCenter: [number, number] = [19.39, -99.10]
  const defaultZoom = 11

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  const humedalMarkerStyle = {
    radius: 10,
    fillColor: '#0D6B7E',
    color: '#094E5C',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  }

  return {
    defaultCenter,
    defaultZoom,
    tileUrl,
    tileAttribution,
    humedalMarkerStyle,
  }
}
