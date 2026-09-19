import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icons in modern bundlers
const customStartIcon = L.divIcon({
  className: 'yaathri-start-marker',
  html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const customEndIcon = L.divIcon({
  className: 'yaathri-end-marker',
  html: `<div style="background-color: #ef4444; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const customStopIcon = L.divIcon({
  className: 'yaathri-stop-marker',
  html: `<div style="background-color: #0284c7; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -7],
});

// Component to smoothly fit map bounds to route
function MapBoundsUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      } catch (e) {
        console.warn('Unable to fit bounds:', e);
      }
    }
  }, [bounds, map]);
  return null;
}

// Well-known coordinates for Kerala transit hubs
export const KERALA_LOCATIONS = {
  'Thrissur Central': [10.5276, 76.2144],
  'Thrissur Central Stand': [10.5276, 76.2144],
  'Thrissur': [10.5276, 76.2144],
  'Pudukad': [10.4283, 76.2522],
  'Pudukad Junction': [10.4283, 76.2522],
  'Irinjalakuda': [10.3547, 76.2081],
  'Irinjalakuda Stand': [10.3547, 76.2081],
  'Chalakudy': [10.3070, 76.3335],
  'Chalakudy Bus Terminal': [10.3070, 76.3335],
  'Angamaly': [10.1960, 76.3860],
  'Angamaly KSRTC': [10.1960, 76.3860],
  'Aluva': [10.1076, 76.3516],
  'Aluva Metro Interchange': [10.1076, 76.3516],
  'Kalamassery': [10.0543, 76.3180],
  'Edappally': [10.0236, 76.3083],
  'Kaloor': [9.9988, 76.2927],
  'Kaloor Metro Station': [9.9988, 76.2927],
  'Ernakulam South': [9.9676, 76.2917],
  'Ernakulam South Station': [9.9676, 76.2917],
  'Ernakulam': [9.9676, 76.2917],
  'MG Road': [9.9723, 76.2829],
  'Kunnamkulam': [10.6507, 76.0734],
  'Kunnamkulam Stand': [10.6507, 76.0734],
  'Guruvayur': [10.5946, 76.0416],
  'Palakkad': [10.7867, 76.6548],
  'Kozhikode': [11.2588, 75.7804],
  'Kochi Metro Line 1': [9.9988, 76.2927],
};

export function resolveCoords(name, fallback = [10.5276, 76.2144]) {
  if (!name) return fallback;
  const match = Object.keys(KERALA_LOCATIONS).find(
    (k) => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
  );
  return match ? KERALA_LOCATIONS[match] : fallback;
}

export default function RouteMap({
  startPoint,
  startingPoint,
  endPoint,
  destination,
  stops = [],
  height = '320px',
  className = '',
}) {
  const actualStart = startPoint || startingPoint || 'Thrissur Central';
  const actualEnd = endPoint || destination || 'Ernakulam South';
  const startCoords = resolveCoords(actualStart, [10.5276, 76.2144]);
  const endCoords = resolveCoords(actualEnd, [9.9676, 76.2917]);

  // Intermediate waypoints or standard stops along the corridor
  const resolvedStops =
    stops && stops.length > 0
      ? stops.map((s) => ({
          name: typeof s === 'string' ? s : s.stop_name || s.name,
          coords: typeof s === 'object' && s.lat && s.lng ? [s.lat, s.lng] : resolveCoords(typeof s === 'string' ? s : s.stop_name || s.name),
        }))
      : [
          { name: 'Pudukad Junction', coords: [10.4283, 76.2522] },
          { name: 'Chalakudy Bus Terminal', coords: [10.3070, 76.3335] },
          { name: 'Angamaly KSRTC', coords: [10.1960, 76.3860] },
          { name: 'Aluva Metro Interchange', coords: [10.1076, 76.3516] },
          { name: 'Kaloor Metro Station', coords: [9.9988, 76.2927] },
        ];

  // Full polyline track: Start -> Intermediate Stops -> End
  const polylineCoords = [startCoords, ...resolvedStops.map((s) => s.coords), endCoords];
  const bounds = [startCoords, endCoords, ...resolvedStops.map((s) => s.coords)];

  // Center on middle point
  const centerLat = (startCoords[0] + endCoords[0]) / 2;
  const centerLng = (startCoords[1] + endCoords[1]) / 2;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={9}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
      >
        {/* Real OpenStreetMap Tile Layer (Free, no API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Dynamic Bounds Fitting */}
        <MapBoundsUpdater bounds={bounds} />

        {/* Route Corridor Polyline */}
        <Polyline
          positions={polylineCoords}
          pathOptions={{
            color: '#0284c7',
            weight: 5,
            opacity: 0.85,
            dashArray: '1, 8',
            lineJoin: 'round',
          }}
        />
        <Polyline
          positions={polylineCoords}
          pathOptions={{
            color: '#38bdf8',
            weight: 3,
            opacity: 0.9,
            lineJoin: 'round',
          }}
        />

        {/* Origin / Start Marker (Green) */}
        <Marker position={startCoords} icon={customStartIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <span className="font-bold text-emerald-600 block">ORIGIN / START</span>
              <span className="font-semibold text-slate-800">{actualStart}</span>
            </div>
          </Popup>
        </Marker>

        {/* Intermediate Transit Stops */}
        {resolvedStops.map((stop, idx) => (
          <Marker key={idx} position={stop.coords} icon={customStopIcon}>
            <Popup>
              <div className="text-xs font-sans">
                <span className="text-sky-600 font-bold block">TRANSIT STOP #{idx + 1}</span>
                <span className="text-slate-800">{stop.name}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination Marker (Red) */}
        <Marker position={endCoords} icon={customEndIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <span className="font-bold text-rose-600 block">DESTINATION</span>
              <span className="font-semibold text-slate-800">{actualEnd}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Transit Corridor Badge Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs font-mono flex items-center space-x-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-slate-200">{actualStart}</span>
        <span className="text-slate-400">⇄</span>
        <span className="font-bold text-slate-200">{actualEnd}</span>
      </div>
    </div>
  );
}
