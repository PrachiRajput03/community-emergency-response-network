import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
  const defaultCenter = [28.6139, 77.2090] // Delhi

  const emergenciesWithCoords = emergencies.filter(
    (e) => e.latitude && e.longitude
  )

  return (
    <div className="card p-0 overflow-hidden h-[420px]">
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

        {emergenciesWithCoords.map((emergency) => (
          <Marker
            key={emergency.id}
            position={[emergency.latitude, emergency.longitude]}
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