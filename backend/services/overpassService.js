const axios = require('axios');

// Calculate Haversine distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  return Math.round(distanceKm * 10) / 10; // Round to 1 decimal place
}

// Regional sample fallback if network timeouts occur
function getFallbackHospitals(lat, lng) {
  const userLat = parseFloat(lat) || 31.224;
  const userLng = parseFloat(lng) || 75.771;

  const offsets = [
    { name: '[Sample Data] Regional General Hospital', type: 'hospital', latOff: 0.008, lngOff: 0.006, emergency: true, timings: '24/7 Emergency' },
    { name: '[Sample Data] City Multispeciality Center', type: 'hospital', latOff: -0.012, lngOff: 0.009, emergency: true, timings: '24/7 Emergency & ICU' },
    { name: '[Sample Data] Local Pharmacy & Wellness', type: 'pharmacy', latOff: -0.004, lngOff: -0.005, emergency: false, timings: 'Standard Hours' },
    { name: '[Sample Data] Community Care Clinic', type: 'clinic', latOff: 0.006, lngOff: -0.011, emergency: false, timings: '8:00 AM - 8:00 PM' },
    { name: '[Sample Data] Emergency Trauma Unit', type: 'emergency', latOff: 0.015, lngOff: -0.018, emergency: true, timings: '24/7 Critical Care' }
  ];

  return offsets.map((item, idx) => {
    const hLat = userLat + item.latOff;
    const hLng = userLng + item.lngOff;
    const dist = calculateDistance(userLat, userLng, hLat, hLng);
    return {
      osmId: `sample_loc_${idx + 1}`,
      name: item.name,
      address: `Unverified Sample Location - Search maps app for direct details`,
      coordinates: { latitude: hLat, longitude: hLng },
      type: item.type,
      phone: 'N/A - Direct contact unavailable (Use Google Maps / 112)',
      rating: null,
      timings: item.timings,
      emergencyServices: item.emergency,
      distanceKm: dist,
      distanceMiles: Math.round(dist * 0.621371 * 10) / 10,
      isUnverifiedSample: true,
      unverifiedNotice: 'Live OSM lookup unavailable. Please search directly via Google Maps or your local maps app for actual facility phone numbers.'
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

async function fetchNearbyHospitalsFromOSM(lat, lng, radiusMeters = 10000) {
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return getFallbackHospitals(31.224, 75.771);
  }

  // Method 1: Try OpenStreetMap Nominatim API (Search for real hospitals near user lat/lng)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&lat=${userLat}&lon=${userLng}&limit=12&addressdetails=1`;
    const nomRes = await axios.get(nominatimUrl, {
      headers: { 'User-Agent': 'MediAI-Healthcare-App/1.0' },
      timeout: 5000
    });

    if (nomRes.data && nomRes.data.length > 0) {
      const realHospitals = nomRes.data.map((item, idx) => {
        const itemLat = parseFloat(item.lat);
        const itemLng = parseFloat(item.lon);
        const dist = calculateDistance(userLat, userLng, itemLat, itemLng);
        const addr = item.address || {};

        let type = 'hospital';
        if (item.display_name.toLowerCase().includes('pharmacy')) type = 'pharmacy';
        if (item.display_name.toLowerCase().includes('clinic')) type = 'clinic';

        return {
          osmId: `nom_${item.place_id || idx}`,
          name: item.name || item.display_name.split(',')[0] || 'Medical Facility',
          address: item.display_name || `${addr.road || ''}, ${addr.city || addr.town || addr.county || ''}`,
          coordinates: { latitude: itemLat, longitude: itemLng },
          type: type,
          phone: addr.phone || 'N/A - Direct contact unavailable',
          rating: null,
          timings: 'Open 24 Hours',
          emergencyServices: true,
          distanceKm: dist,
          distanceMiles: Math.round(dist * 0.621371 * 10) / 10,
          isUnverifiedSample: false
        };
      }).filter(h => h.distanceKm <= 35);

      if (realHospitals.length > 0) {
        return realHospitals.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }
  } catch (err) {
    console.warn(`[Nominatim OSM Search] ${err.message}`);
  }

  // Method 2: Overpass QL query fallback
  const overpassQuery = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng});
      node["amenity"="clinic"](around:${radiusMeters},${userLat},${userLng});
      node["amenity"="pharmacy"](around:${radiusMeters},${userLat},${userLng});
      way["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng});
    );
    out center 15;
  `;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(overpassQuery)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 8000 }
    );

    const elements = response.data?.elements || [];
    if (elements.length > 0) {
      const results = elements.map((item) => {
        const itemLat = item.lat || item.center?.lat;
        const itemLng = item.lon || item.center?.lon;
        const tags = item.tags || {};

        let type = 'hospital';
        if (tags.amenity === 'clinic') type = 'clinic';
        if (tags.amenity === 'pharmacy') type = 'pharmacy';

        const dist = calculateDistance(userLat, userLng, itemLat, itemLng);

        return {
          osmId: `osm_${item.id}`,
          name: tags.name || tags['name:en'] || `${type.toUpperCase()} Healthcare Center`,
          address: tags['addr:full'] || tags['addr:street']
            ? `${tags['addr:housenumber'] || ''} ${tags['addr:street'] || ''}, ${tags['addr:city'] || ''}`.trim()
            : `${dist} km from current location`,
          coordinates: { latitude: itemLat, longitude: itemLng },
          type: type,
          phone: tags.phone || tags['contact:phone'] || 'N/A - Direct contact unavailable',
          rating: null,
          timings: tags.opening_hours || '24/7 Open',
          emergencyServices: tags.emergency === 'yes' || type === 'hospital',
          distanceKm: dist,
          distanceMiles: Math.round(dist * 0.621371 * 10) / 10,
          isUnverifiedSample: false
        };
      }).filter(h => h.coordinates.latitude && h.coordinates.longitude);

      if (results.length > 0) {
        return results.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }
  } catch (err) {
    console.warn(`[Overpass OSM Query] ${err.message}`);
  }

  return getFallbackHospitals(userLat, userLng);
}

module.exports = { fetchNearbyHospitalsFromOSM, calculateDistance, getFallbackHospitals };

