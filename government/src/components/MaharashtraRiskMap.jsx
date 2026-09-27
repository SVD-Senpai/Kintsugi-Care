import { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RISK_COLORS = {
  CRITICAL: "#A63D40",
  HIGH: "#D97706",
  MODERATE: "#D9A441",
  LOW: "#4C7A50",
};

// Component to dynamically re-center map when a district is selected
function MapRecenter({ center, zoom }) {
  const map = useMap();
  if (center) {
    map.setView(center, zoom || map.getZoom());
  }
  return null;
}

export default function MaharashtraRiskMap({
  districts,
  selectedDistrict,
  onSelectDistrict,
  activeDisease,
  _onDrillDownCase,
}) {
  const [mapError, setMapError] = useState(false);

  // Maharashtra Geographic Center
  const defaultCenter = [19.2, 75.8];
  const defaultZoom = 7;

  // Compute cluster circles (e.g., Sinnar cluster in Nashik)
  const clusters = useMemo(() => {
    return [
      {
        id: "cluster-sinnar-hs",
        districtId: "nashik",
        name: "Sinnar HS Outbreak Cluster",
        lat: 19.845,
        lng: 73.998,
        radiusMeters: 14000,
        cases: 8,
        deaths: 3,
        disease: "Haemorrhagic Septicaemia",
        severity: "CRITICAL",
      },
      {
        id: "cluster-sangamner-fmd",
        districtId: "ahmednagar",
        name: "Sangamner Border Cluster",
        lat: 19.574,
        lng: 74.208,
        radiusMeters: 12000,
        cases: 5,
        deaths: 1,
        disease: "Foot & Mouth Disease",
        severity: "HIGH",
      },
    ];
  }, []);

  if (mapError) {
    return (
      <div className="map-error-fallback">
        <div className="map-error-content">
          <span>⚠️</span>
          <strong>Geographic Layer Temporary Fallback</strong>
          <p>Unable to load raster tile tileset. District telemetry is fully accessible via the Attention List.</p>
          <button className="btn btn--outline btn--sm" onClick={() => setMapError(false)}>
            Retry Map Render
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gov-map-shell">
      <div className="gov-map-header">
        <div className="gov-map-header__title">
          <span>MAHARASHTRA DISTRICT RISK MAP</span>
          <span className="gov-map-header__subtitle">
            {activeDisease === "ALL" ? "All Scheduled Diseases" : `${activeDisease} Risk Layer`}
          </span>
        </div>

        {/* Risk Legend */}
        <div className="gov-map-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: RISK_COLORS.CRITICAL }} />
            Critical (&gt;80)
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: RISK_COLORS.HIGH }} />
            High (65–79)
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: RISK_COLORS.MODERATE }} />
            Moderate (40–64)
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: RISK_COLORS.LOW }} />
            Low (&lt;40)
          </span>
        </div>
      </div>

      <div className="gov-map-viewport">
        <MapContainer
          center={selectedDistrict ? [selectedDistrict.lat, selectedDistrict.lng] : defaultCenter}
          zoom={selectedDistrict ? 9 : defaultZoom}
          scrollWheelZoom={true}
          className="gov-leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedDistrict && (
            <MapRecenter center={[selectedDistrict.lat, selectedDistrict.lng]} zoom={8} />
          )}

          {/* Active Outbreak Cluster Rings */}
          {clusters.map((cl) => (
            <Circle
              key={cl.id}
              center={[cl.lat, cl.lng]}
              radius={cl.radiusMeters}
              pathOptions={{
                color: RISK_COLORS[cl.severity],
                fillColor: RISK_COLORS[cl.severity],
                fillOpacity: 0.18,
                weight: 2,
                dashArray: "6 6",
              }}
            >
              <Popup>
                <div className="map-popup-card">
                  <div className="map-popup-badge" style={{ background: RISK_COLORS[cl.severity] }}>
                    ⚠ ACTIVE CLUSTER
                  </div>
                  <h4 className="map-popup-title">{cl.name}</h4>
                  <div className="map-popup-meta">
                    <div><strong>Disease:</strong> {cl.disease}</div>
                    <div><strong>Cases:</strong> {cl.cases} ({cl.deaths} deaths)</div>
                    <div><strong>Radius:</strong> 14 km contiguous buffer</div>
                  </div>
                  <div className="map-popup-action">
                    <small>High animal density · Immediate barrier vaccination recommended</small>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* District Risk Nodes */}
          {districts.map((d) => {
            const isSelected = selectedDistrict?.id === d.id;
            const color = RISK_COLORS[d.riskLevel] || RISK_COLORS.LOW;

            return (
              <div key={d.id}>
                {/* Outer halo for high/critical districts */}
                {(d.riskLevel === "CRITICAL" || d.riskLevel === "HIGH" || isSelected) && (
                  <Circle
                    center={[d.lat, d.lng]}
                    radius={isSelected ? 22000 : 16000}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: isSelected ? 0.25 : 0.12,
                      weight: isSelected ? 2.5 : 1,
                    }}
                  />
                )}

                {/* Core District Marker */}
                <CircleMarker
                  center={[d.lat, d.lng]}
                  radius={isSelected ? 16 : 13}
                  pathOptions={{
                    color: isSelected ? "#1f2a1f" : "#fff",
                    fillColor: color,
                    fillOpacity: 0.95,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => onSelectDistrict(d),
                  }}
                >
                  <Popup>
                    <div className="map-popup-card">
                      <div className="map-popup-header">
                        <span className="map-popup-district">{d.name} District</span>
                        <span className="map-popup-score" style={{ background: color }}>
                          Risk: {d.riskScore}/100
                        </span>
                      </div>
                      <div className="map-popup-meta">
                        <div><strong>Status:</strong> {d.administrativeStatus}</div>
                        <div><strong>Active Cases:</strong> {d.activeCases} ({d.deaths} deaths)</div>
                        <div><strong>7-Day Velocity:</strong> {d.weeklyGrowth}</div>
                        <div><strong>Primary Concern:</strong> {d.dominantDisease}</div>
                        <div><strong>Weather:</strong> {d.weatherRisk.rainfall}</div>
                      </div>
                      <button
                        className="btn btn--primary btn--sm"
                        style={{ width: "100%", marginTop: "8px" }}
                        onClick={() => onSelectDistrict(d)}
                      >
                        Inspect District Command Panel →
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </div>
            );
          })}
        </MapContainer>
      </div>

      <div className="gov-map-footer">
        <span>Click any district marker or cluster ring to inspect operational capacity &amp; response status.</span>
        <span>Projection: WGS 84 · Real-time GIS feed simulation</span>
      </div>
    </div>
  );
}
