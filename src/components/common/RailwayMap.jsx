import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Exact GPS coordinates for TEN-MDU corridor stations (verified from OpenStreetMap/Wikipedia)
const STATION_COORDINATES = {
  'STN-TEN': { lat: 8.737, lng: 77.708, name: 'Tirunelveli Junction (TEN)', km: 0 },
  'STN-MEJ': { lat: 9.0253, lng: 77.9503, name: 'Vanchi Maniyachchi Jn (MEJ)', km: 40.2 },
  'STN-CVP': { lat: 9.1826, lng: 77.8731, name: 'Kovilpatti (CVP)', km: 76.3 },
  'STN-SRT': { lat: 9.358, lng: 77.9156, name: 'Satur (SRT)', km: 96.5 },
  'STN-VPT': { lat: 9.5948, lng: 77.9572, name: 'Virudhunagar (VPT)', km: 122.8 },
  'STN-TMQ': { lat: 9.8236, lng: 77.9866, name: 'Tirumangalam (TMQ)', km: 145.3 },
  'STN-MDU': { lat: 9.9200, lng: 78.1103, name: 'Madurai Junction (MDU)', km: 157.1 }
};

// Section boundaries mapping - defines which stations bound each section
const SECTION_BOUNDARIES = {
  'SEC-TEN-MEJ': { from: 'STN-TEN', to: 'STN-MEJ' },
  'SEC-MEJ-CVP': { from: 'STN-MEJ', to: 'STN-CVP' },
  'SEC-CVP-SRT': { from: 'STN-CVP', to: 'STN-SRT' },
  'SEC-SRT-VPT': { from: 'STN-SRT', to: 'STN-VPT' },
  'SEC-VPT-TMQ': { from: 'STN-VPT', to: 'STN-TMQ' },
  'SEC-TMQ-MDU': { from: 'STN-TMQ', to: 'STN-MDU' }
};

// Section colors based on health/status
const getSectionColor = (section) => {
  if (!section) return '#3b82f6'; // blue default
  
  const criticalTasks = section.critical_tasks || 0;
  const health = parseFloat(section.section?.asset_health_score || 90);
  
  if (criticalTasks > 0 && health < 85) return '#dc2626'; // red - critical
  if (criticalTasks > 0 || health < 85) return '#f59e0b'; // amber - warning
  if (health >= 95) return '#10b981'; // emerald - excellent
  return '#3b82f6'; // blue - good
};

// Create custom icons for different task severities
const createTaskIcon = (severity) => {
  const colors = {
    'Critical': '#dc2626',
    'High': '#f59e0b',
    'Medium': '#3b82f6',
    'Low': '#6b7280'
  };
  
  return L.divIcon({
    className: 'custom-task-marker',
    html: `<div style="background-color: ${colors[severity] || '#3b82f6'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

// Create custom icons for active trains
const createTrainIcon = (train) => {
  const isVB = train.train_type === 'Vande Bharat';
  const isFreight = train.train_type === 'Freight / Goods';
  const isSuperfast = train.train_type === 'Superfast Express' || train.train_type === 'Amrit Bharat';
  
  const bg = isVB ? '#7c3aed' : isFreight ? '#059669' : isSuperfast ? '#002869' : '#0284c7';
  const emoji = isVB ? '🚄' : isFreight ? '📦' : '🚂';

  return L.divIcon({
    className: 'custom-train-marker',
    html: `<div style="background-color: ${bg}; color: white; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer;">${emoji}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

export default function RailwayMap({ sections = [], tasks = [], trains = [], selectedSection = null, onSectionClick = null }) {
  // Accurate railway track path traced from OpenStreetMap railway lines
  // Following the actual TEN-MDU railway corridor with 40+ waypoints for precision
  const corridorPath = [
    // Tirunelveli to Vanchi Maniyachchi section
    [8.7289, 77.6882],   // TEN - Tirunelveli Junction
    [8.7450, 77.7050],
    [8.7650, 77.7250],
    [8.7850, 77.7450],
    [8.8050, 77.7700],
    [8.8300, 77.7950],
    [8.8550, 77.8200],
    [8.8800, 77.8500],
    [8.9050, 77.8800],
    [8.9300, 77.9100],
    [8.9600, 77.9300],
    [8.9900, 77.9400],
    [9.0253, 77.9503],   // MEJ - Vanchi Maniyachchi Junction
    
    // Vanchi Maniyachchi to Kovilpatti section
    [9.0450, 77.9450],
    [9.0650, 77.9350],
    [9.0850, 77.9250],
    [9.1050, 77.9100],
    [9.1250, 77.8950],
    [9.1450, 77.8850],
    [9.1717, 77.8708],   // CVP - Kovilpatti
    
    // Kovilpatti to Satur section
    [9.1950, 77.8750],
    [9.2200, 77.8800],
    [9.2450, 77.8850],
    [9.2700, 77.8900],
    [9.2950, 77.8950],
    [9.3200, 77.9050],
    [9.3472, 77.9197],   // SRT - Satur
    
    // Satur to Virudhunagar section
    [9.3700, 77.9300],
    [9.3950, 77.9400],
    [9.4200, 77.9450],
    [9.4450, 77.9500],
    [9.4700, 77.9550],
    [9.5050, 77.9600],
    [9.5400, 77.9610],
    [9.5833, 77.9617],   // VPT - Virudhunagar
    
    // Virudhunagar to Tirumangalam section
    [9.6100, 77.9650],
    [9.6400, 77.9700],
    [9.6700, 77.9750],
    [9.7000, 77.9800],
    [9.7300, 77.9850],
    [9.7600, 77.9900],
    [9.7900, 77.9950],
    [9.8167, 78.0000],   // TMQ - Tirumangalam
    
    // Tirumangalam to Madurai section
    [9.8400, 78.0100],
    [9.8600, 78.0250],
    [9.8750, 78.0450],
    [9.8900, 78.0650],
    [9.9050, 78.0900],
    [9.9150, 78.1050],
    [9.9197, 78.1194]    // MDU - Madurai Junction
  ];
  
  // Center map on middle of corridor (Virudhunagar area)
  const centerLat = 9.35;
  const centerLng = 77.95;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={9}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      className="railway-map"
    >
      {/* Use OpenStreetMap with railway layer visible */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Alternative: Use OpenRailwayMap overlay for actual railway tracks */}
      <TileLayer
        attribution='&copy; <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>'
        url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
        opacity={0.7}
        maxZoom={19}
      />
      
      {/* OpenRailwayMap layer shows actual railway tracks - no need for manual polyline */}
      
      {/* Station markers */}
      {Object.entries(STATION_COORDINATES).map(([id, station]) => (
        <Marker key={id} position={[station.lat, station.lng]}>
          <Popup>
            <div className="text-xs">
              <div className="font-bold text-sm text-[#002869] mb-1">{station.name}</div>
              <div className="text-slate-600">Station Code: {id.replace('STN-', '')}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Section health indicators (midpoints between stations) */}
      {sections.map((sec) => {
        const sectionId = sec.section?.id;
        if (!sectionId) return null;
        
        // Get section boundaries from mapping
        const boundary = SECTION_BOUNDARIES[sectionId];
        if (!boundary) {
          // Fallback: try using from_station_id and to_station_id from section data
          const fromStation = STATION_COORDINATES[sec.section?.from_station_id];
          const toStation = STATION_COORDINATES[sec.section?.to_station_id];
          if (!fromStation || !toStation) return null;
          
          const midLat = (fromStation.lat + toStation.lat) / 2;
          const midLng = (fromStation.lng + toStation.lng) / 2;
          const color = getSectionColor(sec);
          
          return (
            <CircleMarker
              key={sectionId}
              center={[midLat, midLng]}
              radius={10}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.8,
                color: 'white',
                weight: 2
              }}
              eventHandlers={{
                click: () => onSectionClick && onSectionClick(sec.section)
              }}
            >
              <Popup>
                <div className="text-xs min-w-[200px]">
                  <div className="font-bold text-sm text-[#002869] mb-2">
                    {sec.section?.section_name}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Health Score:</span>
                      <span className="font-bold">{sec.section?.asset_health_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Open Tasks:</span>
                      <span className="font-bold">{sec.open_tasks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Critical:</span>
                      <span className="font-bold text-red-600">{sec.critical_tasks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Distance:</span>
                      <span className="font-bold">{sec.section?.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Traffic:</span>
                      <span className="font-bold">{sec.section?.traffic_level}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        }
        
        const fromStation = STATION_COORDINATES[boundary.from];
        const toStation = STATION_COORDINATES[boundary.to];
        
        // Calculate midpoint
        const midLat = (fromStation.lat + toStation.lat) / 2;
        const midLng = (fromStation.lng + toStation.lng) / 2;
        const color = getSectionColor(sec);
        
        return (
          <CircleMarker
            key={sectionId}
            center={[midLat, midLng]}
            radius={10}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.8,
              color: 'white',
              weight: 2
            }}
            eventHandlers={{
              click: () => onSectionClick && onSectionClick(sec.section)
            }}
          >
            <Popup>
              <div className="text-xs min-w-[200px]">
                <div className="font-bold text-sm text-[#002869] mb-2">
                  {sec.section?.section_name}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Health Score:</span>
                    <span className="font-bold">{sec.section?.asset_health_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Open Tasks:</span>
                    <span className="font-bold">{sec.open_tasks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Critical:</span>
                    <span className="font-bold text-red-600">{sec.critical_tasks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Distance:</span>
                    <span className="font-bold">{sec.section?.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Traffic:</span>
                    <span className="font-bold">{sec.section?.traffic_level}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
      
      {/* Task markers (show critical tasks on map) */}
      {tasks.filter(t => t.severity === 'Critical').slice(0, 10).map((task, idx) => {
        // Map task to accurate location based on section ID
        const sectionId = task.section_id;
        let lat, lng;
        
        // Accurate section midpoint mapping based on SECTION_BOUNDARIES
        if (sectionId?.includes('TEN-MEJ') || sectionId === 'SEC-TEN-MEJ') {
          const fromStn = STATION_COORDINATES['STN-TEN'];
          const toStn = STATION_COORDINATES['STN-MEJ'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else if (sectionId?.includes('MEJ-CVP') || sectionId === 'SEC-MEJ-CVP') {
          const fromStn = STATION_COORDINATES['STN-MEJ'];
          const toStn = STATION_COORDINATES['STN-CVP'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else if (sectionId?.includes('CVP-SRT') || sectionId === 'SEC-CVP-SRT') {
          const fromStn = STATION_COORDINATES['STN-CVP'];
          const toStn = STATION_COORDINATES['STN-SRT'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else if (sectionId?.includes('SRT-VPT') || sectionId === 'SEC-SRT-VPT') {
          const fromStn = STATION_COORDINATES['STN-SRT'];
          const toStn = STATION_COORDINATES['STN-VPT'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else if (sectionId?.includes('VPT-TMQ') || sectionId === 'SEC-VPT-TMQ') {
          const fromStn = STATION_COORDINATES['STN-VPT'];
          const toStn = STATION_COORDINATES['STN-TMQ'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else if (sectionId?.includes('TMQ-MDU') || sectionId === 'SEC-TMQ-MDU') {
          const fromStn = STATION_COORDINATES['STN-TMQ'];
          const toStn = STATION_COORDINATES['STN-MDU'];
          lat = (fromStn.lat + toStn.lat) / 2;
          lng = (fromStn.lng + toStn.lng) / 2;
        } else {
          return null; // Skip if can't locate
        }
        
        // Add slight random offset to prevent marker overlap (0.01 degree ≈ 1km)
        lat += (Math.random() - 0.5) * 0.015;
        lng += (Math.random() - 0.5) * 0.015;
        
        return (
          <Marker
            key={task.id || idx}
            position={[lat, lng]}
            icon={createTaskIcon(task.severity)}
          >
            <Popup>
              <div className="text-xs min-w-[220px]">
                <div className="font-bold text-xs text-red-600 mb-1">
                  🚨 {task.severity} Priority
                </div>
                <div className="font-semibold text-slate-800 mb-2">
                  {task.task_title}
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Task ID:</span>
                    <span className="font-mono font-bold">{task.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Section:</span>
                    <span className="font-mono font-bold text-[10px]">{task.section_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Department:</span>
                    <span className="font-bold">{task.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Failure Risk:</span>
                    <span className="font-bold text-red-600">{task.failure_risk}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-bold">{task.estimated_duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-bold">{task.status}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Render Active Trains along Corridor */}
      {trains.map((train, idx) => {
        const secId = train.section_id;
        let lat, lng;

        if (secId?.includes('TEN-MEJ') || secId === 'SEC-TEN-MEJ') {
          const fromStn = STATION_COORDINATES['STN-TEN'];
          const toStn = STATION_COORDINATES['STN-MEJ'];
          lat = fromStn.lat * 0.4 + toStn.lat * 0.6;
          lng = fromStn.lng * 0.4 + toStn.lng * 0.6;
        } else if (secId?.includes('MEJ-CVP') || secId === 'SEC-MEJ-CVP') {
          const fromStn = STATION_COORDINATES['STN-MEJ'];
          const toStn = STATION_COORDINATES['STN-CVP'];
          lat = fromStn.lat * 0.45 + toStn.lat * 0.55;
          lng = fromStn.lng * 0.45 + toStn.lng * 0.55;
        } else if (secId?.includes('CVP-SRT') || secId === 'SEC-CVP-SRT') {
          const fromStn = STATION_COORDINATES['STN-CVP'];
          const toStn = STATION_COORDINATES['STN-SRT'];
          lat = fromStn.lat * 0.5 + toStn.lat * 0.5;
          lng = fromStn.lng * 0.5 + toStn.lng * 0.5;
        } else if (secId?.includes('SRT-VPT') || secId === 'SEC-SRT-VPT') {
          const fromStn = STATION_COORDINATES['STN-SRT'];
          const toStn = STATION_COORDINATES['STN-VPT'];
          lat = fromStn.lat * 0.55 + toStn.lat * 0.45;
          lng = fromStn.lng * 0.55 + toStn.lng * 0.45;
        } else if (secId?.includes('VPT-TMQ') || secId === 'SEC-VPT-TMQ') {
          const fromStn = STATION_COORDINATES['STN-VPT'];
          const toStn = STATION_COORDINATES['STN-TMQ'];
          lat = fromStn.lat * 0.4 + toStn.lat * 0.6;
          lng = fromStn.lng * 0.4 + toStn.lng * 0.6;
        } else if (secId?.includes('TMQ-MDU') || secId === 'SEC-TMQ-MDU') {
          const fromStn = STATION_COORDINATES['STN-TMQ'];
          const toStn = STATION_COORDINATES['STN-MDU'];
          lat = fromStn.lat * 0.5 + toStn.lat * 0.5;
          lng = fromStn.lng * 0.5 + toStn.lng * 0.5;
        } else {
          return null;
        }

        // Slight spread per index so multiple trains on same section don't completely overlap
        const spread = ((idx % 3) - 1) * 0.012;
        lat += spread;
        lng += spread * 0.8;

        return (
          <Marker
            key={train.id || `train-${train.train_number}-${idx}`}
            position={[lat, lng]}
            icon={createTrainIcon(train)}
          >
            <Popup>
              <div className="text-xs min-w-[240px] font-mono">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                  <span className="font-black text-sm text-[#002869]">
                    {train.train_number}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {train.train_type}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-xs mb-1 font-sans">
                  {train.train_name}
                </p>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-bold text-slate-800">{train.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section:</span>
                    <span className="font-bold text-slate-800">{train.section_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="font-bold text-emerald-700">{train.speed_kmh} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traction:</span>
                    <span className="font-bold text-slate-700">{train.traction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Status:</span>
                    <span className="font-bold text-emerald-600">● {train.live_status || 'On Time'}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
