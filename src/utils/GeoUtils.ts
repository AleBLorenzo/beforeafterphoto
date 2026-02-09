import { GPSCoordinates } from '../models/BeforeAfterRecord';

export class GeoUtils {
  /**
   * Calcula la distancia entre dos coordenadas GPS usando la fórmula de Haversine
   * @returns Distancia en metros
   */
  static calculateDistance(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Calcula el bearing (ángulo) entre dos coordenadas
   * @returns Ángulo en grados (0-360°, donde 0° = Norte)
   */
  static calculateBearing(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return ((θ * 180) / Math.PI + 360) % 360; // Normalizar a 0-360°
  }

  /**
   * Normaliza un ángulo a rango 0-360°
   */
  static normalizeAngle(angle: number): number {
    return ((angle % 360) + 360) % 360;
  }

  /**
   * Calcula la diferencia angular más corta entre dos ángulos
   * @returns Diferencia en grados (-180 a +180)
   */
  static angleDifference(angle1: number, angle2: number): number {
    const diff = ((angle2 - angle1 + 180) % 360) - 180;
    return diff < -180 ? diff + 360 : diff;
  }

  /**
   * Formatea coordenadas GPS para mostrar
   */
  static formatCoordinates(coord: GPSCoordinates): string {
    return `${coord.lat.toFixed(6)}, ${coord.lon.toFixed(6)}`;
  }
}