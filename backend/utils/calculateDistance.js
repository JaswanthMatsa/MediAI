// Calculate Haversine distance between two coordinates in kilometers & miles
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { distanceKm: 0, distanceMiles: 0 };
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round((R * c) * 10) / 10;
  const distanceMiles = Math.round((distanceKm * 0.621371) * 10) / 10;
  return { distanceKm, distanceMiles };
}

module.exports = calculateDistance;
