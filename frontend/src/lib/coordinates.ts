export interface LngLat {
  longitude: number;
  latitude: number;
}

/**
 * Validates a coordinate pair to ensure it is geographically valid and finite.
 */
export function isValidCoordinate(point: LngLat | null | undefined): boolean {
  if (!point) return false;
  
  const { longitude, latitude } = point;
  
  if (typeof longitude !== 'number' || typeof latitude !== 'number') return false;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return false;
  
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;
  
  return true;
}

/**
 * Formats a coordinate for Ola Maps SDK / MapLibre (GeoJSON format).
 * ALWAYS [longitude, latitude]
 */
export function toMapLngLat(point: LngLat): [number, number] {
  if (!isValidCoordinate(point)) {
    throw new Error(`Invalid coordinate: ${JSON.stringify(point)}`);
  }
  return [point.longitude, point.latitude];
}

/**
 * Formats a coordinate for Ola Maps Directions API queries.
 * ALWAYS "latitude,longitude"
 */
export function toDirectionsLatLng(point: LngLat): string {
  if (!isValidCoordinate(point)) {
    throw new Error(`Invalid coordinate: ${JSON.stringify(point)}`);
  }
  return `${point.latitude},${point.longitude}`;
}
