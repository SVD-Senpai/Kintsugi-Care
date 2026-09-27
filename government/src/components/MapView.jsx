import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RiskBadge from "./RiskBadge";

const RISK_COLOR = { LOW: "#4C7A50", MEDIUM: "#D9A441", HIGH: "#A63D40" };

export default function MapView({ cases, clusters, onSelectCase, center }) {
  const mapCenter = center || (cases[0] ? [cases[0].lat, cases[0].lng] : [28.6139, 77.209]);

  return (
    <div className="map-shell">
      <MapContainer center={mapCenter} zoom={10} scrollWheelZoom className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clusters.map((cluster) => (
          <Circle
            key={cluster.id}
            center={[cluster.center.lat, cluster.center.lng]}
            radius={8000}
            pathOptions={{ color: "#A63D40", fillColor: "#A63D40", fillOpacity: 0.12, weight: 1.5, dashArray: "6 4" }}
          />
        ))}

        {cases.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={9}
            pathOptions={{
              color: RISK_COLOR[c.riskLevel],
              fillColor: RISK_COLOR[c.riskLevel],
              fillOpacity: 0.85,
              weight: 2,
            }}
            eventHandlers={{ click: () => onSelectCase?.(c) }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong>{c.village || "Unknown village"}</strong>
                <div style={{ margin: "4px 0" }}>
                  <RiskBadge level={c.riskLevel} size="sm" />
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  {c.animalType} · {c.status} · {new Date(c.reportedAt).toLocaleDateString()}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}