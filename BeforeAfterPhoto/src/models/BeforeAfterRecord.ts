export enum CaptureStatus {
  PENDING_BEFORE = 'pending_before',
  PENDING_AFTER = 'pending_after',
  COMPLETE = 'complete'
}

export interface GPSCoordinates {
  lat: number;
  lon: number;
  accuracy: number;
  altitude?: number;
}

export interface CameraMetadata {
  zoom: number;
  mode: 'guided' | 'free';
  fov?: number;
}

export interface BeforeAfterRecord {
  id: string;
  status: CaptureStatus;
  
  // Foto ANTES
  photoUri: string;
  previewThumbnailUri: string;
  timestamp: number;
  gps: GPSCoordinates;
  heading: number;  // 0-360° (norte = 0)
  pitch: number;    // -90 a +90 (horizontal = 0)
  roll: number;     // -180 a +180
  camera: CameraMetadata;
  
  // Foto DESPUÉS (opcional hasta que se capture)
  afterPhotoUri?: string;
  afterThumbnailUri?: string;
  afterTimestamp?: number;
  afterGps?: GPSCoordinates;
  afterHeading?: number;
  afterPitch?: number;
  afterRoll?: number;
  
  // Validaciones automáticas
  distanceMeters?: number;      // Distancia entre ANTES y DESPUÉS
  headingDiffDegrees?: number;  // Diferencia de ángulo
  isValid?: boolean;            // true si pasa todas las validaciones
  validationErrors?: string[];  // Lista de errores si los hay
}

// Constantes de validación
export const GPS_ACCURACY_THRESHOLD = 15; // metros
export const MAX_DISTANCE_THRESHOLD = 5;  // metros
export const MAX_HEADING_DIFF = 15;       // grados
export const MAX_PITCH_DIFF = 10;         // grados