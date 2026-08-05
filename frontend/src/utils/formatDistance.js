export function formatDistance(distanceKm) {
  if (!distanceKm && distanceKm !== 0) return '';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} meters`;
  }
  return `${distanceKm} km`;
}
