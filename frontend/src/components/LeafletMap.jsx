import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LeafletMap({ center, hospitals = [], selectedHospital, onSelectHospital }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const userLat = center?.latitude || 37.7749;
  const userLng = center?.longitude || -122.4194;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map Instance if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLat, userLng], 13);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add User Current Location Marker (Cyan Pulse Icon)
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background: #14b8a6;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 15px #14b8a6;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: #2dd4bf; font-size: 13px;">📍 You Are Here</strong>
          <p style="margin: 2px 0 0; font-size: 11px; color: #cbd5e1;">Live Geolocation Coordinates</p>
        </div>
      `);
    markersRef.current.push(userMarker);

    // Add Hospital Pins
    hospitals.forEach((hosp) => {
      const hLat = hosp.coordinates?.latitude || hosp.lat;
      const hLng = hosp.coordinates?.longitude || hosp.lng;
      if (!hLat || !hLng) return;

      const isEmergency = hosp.type === 'emergency' || hosp.emergencyServices;
      const isSelected = selectedHospital && (selectedHospital.name === hosp.name || selectedHospital.osmId === hosp.osmId);

      const color = isEmergency ? '#ef4444' : hosp.type === 'pharmacy' ? '#3b82f6' : '#10b981';
      const symbol = isEmergency ? '🚨' : hosp.type === 'pharmacy' ? '💊' : '🏥';

      const hospIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `<div style="
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          background: ${color};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s;
        ">${symbol}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([hLat, hLng], { icon: hospIcon })
        .addTo(map)
        .bindPopup(`
          <div style="max-width: 220px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 13px; color: #38bdf8; margin-bottom: 2px;">
              ${hosp.name}
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 4px;">
              ${hosp.address}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; font-weight: 500;">
              <span>⭐ ${hosp.rating || 4.5}</span>
              <span style="color: #2dd4bf; font-weight: bold;">${hosp.distanceKm ? hosp.distanceKm + ' km' : ''}</span>
            </div>
            ${hosp.phone ? `<div style="font-size: 10px; color: #a7f3d0; margin-top: 4px;">📞 ${hosp.phone}</div>` : ''}
          </div>
        `);

      marker.on('click', () => {
        if (onSelectHospital) onSelectHospital(hosp);
      });

      markersRef.current.push(marker);
    });

  }, [userLat, userLng, hospitals, selectedHospital]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
    </div>
  );
}
