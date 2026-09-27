import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { maharashtraGeoJSON } from '../../data/maharashtraGeoJSON';
import { districtCentroids } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { MapLegend } from './MapLegend';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Radio, 
  Eye, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function MaharashtraMap({ 
  height = '500px', 
  compact = false,
  filterDisease = 'all',
  filterRisk = 'all',
  onSelectAlert = null,
  focusedDistrict = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const zonesLayerGroupRef = useRef(null);

  const { alerts, navigateToCase, setActivePage } = useApp();

  // State for layer toggles & inspector popup
  const [showZones, setShowZones] = useState(true);
  const [showBorders, setShowBorders] = useState(true);
  const [activeInspectorAlert, setActiveInspectorAlert] = useState(null);

  // Maharashtra center & bounds
  const MH_CENTER = [19.45, 76.15];
  const MH_DEFAULT_ZOOM = compact ? 6.4 : 7.1;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: MH_CENTER,
      zoom: MH_DEFAULT_ZOOM,
      zoomControl: false,
      minZoom: 6,
      maxZoom: 14,
      attributionControl: false,
      scrollWheelZoom: !compact,
    });

    mapInstanceRef.current = map;

    // GIS Light Tile Layer (CartoDB Positron - clean clinical aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Layer Groups
    zonesLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    // Add Maharashtra GeoJSON layer
    if (maharashtraGeoJSON && maharashtraGeoJSON.features) {
      geojsonLayerRef.current = L.geoJSON(maharashtraGeoJSON, {
        style: (feature) => {
          const districtName = feature.properties.district || feature.properties.District || '';
          const hasAlert = alerts.some(a => a.district.toLowerCase() === districtName.toLowerCase());
          const hasHighAlert = alerts.some(a => a.district.toLowerCase() === districtName.toLowerCase() && a.riskSeverity === 'high');

          return {
            fillColor: hasHighAlert ? '#fecaca' : hasAlert ? '#fef3c7' : '#eaf3ee',
            weight: 1.2,
            opacity: 0.9,
            color: '#216d53',
            dashArray: '2',
            fillOpacity: hasHighAlert ? 0.35 : hasAlert ? 0.25 : 0.12
          };
        },
        onEachFeature: (feature, layer) => {
          const districtName = feature.properties.district || feature.properties.District || 'Maharashtra District';
          const relatedAlert = alerts.find(a => a.district.toLowerCase() === districtName.toLowerCase());

          let tooltipContent = `<div class="p-1 font-sans text-xs">
            <div class="font-bold text-stone-900">${districtName}</div>
            ${relatedAlert 
              ? `<div class="text-[11px] font-semibold text-red-600">${relatedAlert.disease}</div>
                 <div class="text-[10px] text-stone-500">${relatedAlert.activeCases} active cases</div>`
              : `<div class="text-[10px] text-emerald-700">Surveillance: Normal</div>`
            }
          </div>`;

          layer.bindTooltip(tooltipContent, {
            sticky: true,
            className: 'bg-white rounded-lg shadow-md border border-stone-200'
          });

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                weight: 2.2,
                color: '#164e3b',
                fillOpacity: 0.45
              });
            },
            mouseout: (e) => {
              geojsonLayerRef.current.resetStyle(e.target);
            },
            click: () => {
              if (relatedAlert) {
                setActiveInspectorAlert(relatedAlert);
                if (onSelectAlert) onSelectAlert(relatedAlert);
              }
            }
          });
        }
      }).addTo(map);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Alert Zones when alerts or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerGroupRef.current || !zonesLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();
    zonesLayerGroupRef.current.clearLayers();

    // Filter alerts
    const filteredAlerts = alerts.filter(a => {
      const matchDisease = filterDisease === 'all' || a.disease.toLowerCase().includes(filterDisease.toLowerCase());
      const matchRisk = filterRisk === 'all' || a.riskSeverity.toLowerCase() === filterRisk.toLowerCase();
      return matchDisease && matchRisk;
    });

    filteredAlerts.forEach((alert) => {
      const [lat, lng] = alert.coordinates;
      const isHigh = alert.riskSeverity === 'high';
      const isMedium = alert.riskSeverity === 'medium';

      // 1. Translucent Circular Alert Zone
      if (showZones) {
        const zoneColor = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981';
        const zoneRadius = (alert.radiusKm || 20) * 1000;

        const circle = L.circle([lat, lng], {
          radius: zoneRadius,
          color: zoneColor,
          weight: 1.5,
          opacity: 0.7,
          fillColor: zoneColor,
          fillOpacity: isHigh ? 0.18 : 0.12,
          dashArray: isHigh ? '4, 4' : null
        });

        circle.on('click', () => {
          setActiveInspectorAlert(alert);
          if (onSelectAlert) onSelectAlert(alert);
        });

        zonesLayerGroupRef.current.addLayer(circle);
      }

      // 2. Custom Animated SVG Radar Pulse DivIcon
      let markerHtml = '';

      if (isHigh) {
        // High Risk: Glowing red core with animated concentric expanding radar rings
        markerHtml = `
          <div class="relative flex items-center justify-center" style="width: 48px; height: 48px; margin-top: -24px; margin-left: -24px;">
            <div class="radar-ring-1 absolute w-12 h-12 rounded-full bg-red-500/35 border border-red-500/60 pointer-events-none"></div>
            <div class="radar-ring-2 absolute w-9 h-9 rounded-full bg-red-500/40 border border-red-500/70 pointer-events-none"></div>
            <div class="radar-ring-3 absolute w-6 h-6 rounded-full bg-red-500/50 pointer-events-none"></div>
            <div class="relative w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg marker-pulse-urgent flex items-center justify-center cursor-pointer">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute -bottom-5 bg-red-700/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap pointer-events-none border border-red-500/40">
              ${alert.district}
            </div>
          </div>
        `;
      } else if (isMedium) {
        // Medium Risk: Amber pulse marker
        markerHtml = `
          <div class="relative flex items-center justify-center" style="width: 36px; height: 36px; margin-top: -18px; margin-left: -18px;">
            <div class="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping pointer-events-none"></div>
            <div class="relative w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-md marker-pulse-attention flex items-center justify-center cursor-pointer">
              <div class="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div class="absolute -bottom-4 bg-amber-700/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap pointer-events-none">
              ${alert.district}
            </div>
          </div>
        `;
      } else {
        // Low Risk: Emerald pulse marker
        markerHtml = `
          <div class="relative flex items-center justify-center" style="width: 28px; height: 28px; margin-top: -14px; margin-left: -14px;">
            <div class="relative w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs cursor-pointer"></div>
            <div class="absolute -bottom-4 bg-emerald-800/80 text-white font-semibold text-[8px] px-1 py-0.2 rounded-xs whitespace-nowrap pointer-events-none">
              ${alert.district}
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-disease-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveInspectorAlert(alert);
        if (onSelectAlert) onSelectAlert(alert);
      });

      markersLayerGroupRef.current.addLayer(marker);
    });
  }, [alerts, filterDisease, filterRisk, showZones]);

  // Toggle district borders
  useEffect(() => {
    if (!geojsonLayerRef.current) return;
    if (showBorders) {
      geojsonLayerRef.current.setStyle({ opacity: 0.9, fillOpacity: 0.15 });
    } else {
      geojsonLayerRef.current.setStyle({ opacity: 0, fillOpacity: 0 });
    }
  }, [showBorders]);

  // Handle auto-focus on district
  useEffect(() => {
    if (!focusedDistrict || !mapInstanceRef.current) return;
    const coords = districtCentroids[focusedDistrict];
    if (coords) {
      mapInstanceRef.current.flyTo(coords, 9.5, { duration: 1.2 });
      const foundAlert = alerts.find(a => a.district.toLowerCase() === focusedDistrict.toLowerCase());
      if (foundAlert) setActiveInspectorAlert(foundAlert);
    }
  }, [focusedDistrict, alerts]);

  // Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => {
    mapInstanceRef.current?.flyTo(MH_CENTER, MH_DEFAULT_ZOOM, { duration: 1 });
    setActiveInspectorAlert(null);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-[#fbf9f4]" style={{ height }}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs border border-stone-200 shadow-md text-stone-700 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs border border-stone-200 shadow-md text-stone-700 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs border border-stone-200 shadow-md text-stone-700 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center transition-all"
          title="Reset Maharashtra View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Layer Toggles */}
      {!compact && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 shadow-md flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowZones(!showZones)}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${showZones ? 'text-[#216d53]' : 'text-stone-400'}`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Risk Zones</span>
            </button>
            <span className="w-px h-3.5 bg-stone-200" />
            <button
              onClick={() => setShowBorders(!showBorders)}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${showBorders ? 'text-[#216d53]' : 'text-stone-400'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Districts</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Severity Legend */}
      {!compact && (
        <div className="absolute bottom-4 left-4 z-20 hidden md:block">
          <MapLegend />
        </div>
      )}

      {/* Selected Disease Cluster Inspector Card */}
      {activeInspectorAlert && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl p-4 animate-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between pb-2.5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-stone-900 text-sm">
                  {activeInspectorAlert.district} District
                </h4>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  activeInspectorAlert.riskSeverity === 'high' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : activeInspectorAlert.riskSeverity === 'medium'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeInspectorAlert.riskLevel}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#216d53] mt-0.5">
                {activeInspectorAlert.disease}
              </div>
            </div>
            <button 
              onClick={() => setActiveInspectorAlert(null)}
              className="text-stone-400 hover:text-stone-600 text-sm p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2.5">
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] uppercase font-bold text-stone-400">Active Cases</div>
              <div className="text-base font-extrabold text-stone-900">{activeInspectorAlert.activeCases}</div>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] uppercase font-bold text-stone-400">Livestock at Risk</div>
              <div className="text-base font-extrabold text-stone-900">{activeInspectorAlert.affectedAnimals}</div>
            </div>
          </div>

          <div className="text-[11px] text-stone-600 mb-3 line-clamp-2">
            <span className="font-semibold text-stone-700">Talukas affected:</span> {activeInspectorAlert.talukas?.join(', ')}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => {
                setActivePage('caseQueue');
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#216d53] text-white font-bold text-xs hover:bg-[#164e3b] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaharashtraMap;
