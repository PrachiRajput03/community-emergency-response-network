import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function EmergencyMap({ emergencies = [] }) {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const defaultCenter = [28.6139, 77.2090]

  const emergenciesWithCoords = emergencies.filter(
    (e) => e.latitude && e.longitude
  )

  const heatmapPoints = emergenciesWithCoords.map((e) => ({
    lat: Number(e.latitude),
    lng: Number(e.longitude),
    intensity:
      e.severity === 'CRITICAL'
        ? 1
        : e.severity === 'HIGH'
          ? 0.8
          : e.severity === 'MEDIUM'
            ? 0.5
            : 0.3,
  }))

  return (
    <div className="card p-0 overflow-hidden h-[420px] relative">
      <button
        onClick={() => setShowHeatmap((prev) => !prev)}
        className="absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-lg bg-bg2 border border-line text-xs text-ink hover:border-brand-red transition-colors"
      >
        {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
      </button>

      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showHeatmap && heatmapPoints.length > 0 && (
          <HeatmapLayer
            points={heatmapPoints}
            longitudeExtractor={(point) => point.lng}
            latitudeExtractor={(point) => point.lat}
            intensityExtractor={(point) => point.intensity}
            radius={30}
            blur={20}
            max={1}
          />
        )}

        {emergenciesWithCoords.map((emergency) => (
          <Marker
            key={emergency.id}
            position={[
              Number(emergency.latitude),
              Number(emergency.longitude),
            ]}
          >
            <Popup>
              <strong>{emergency.title || 'Emergency'}</strong>
              <br />
              {emergency.location || 'No location'}
              <br />
              Status: {emergency.status}
              <br />
              Severity: {emergency.severity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}