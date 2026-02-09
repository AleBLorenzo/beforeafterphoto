export const AppConstants = {
  // Umbrales GPS
  GPS_ACCURACY_THRESHOLD: 15, // metros
  GPS_TIMEOUT: 5000,          // 5 segundos
  GPS_MAX_AGE: 10000,         // 10 segundos
  
  // Umbrales de validación ANTES/DESPUÉS
  MAX_DISTANCE_METERS: 5,     // Máxima distancia entre capturas
  MAX_HEADING_DIFF: 15,       // Máxima diferencia de ángulo (grados)
  MAX_PITCH_DIFF: 10,         // Máxima diferencia de inclinación
  
  // Storage
  STORAGE_KEY: '@before_after_records',
  
  // Mensajes
  MSG_GPS_WEAK: 'Señal GPS débil. Sal al exterior o acércate a una ventana.',
  MSG_GPS_WAITING: 'Esperando mejor señal GPS...',
  MSG_GPS_GOOD: 'GPS listo',
  MSG_CAPTURE_SUCCESS: '✅ Foto guardada correctamente',
  MSG_VALIDATION_DISTANCE: '⚠️ Te has movido demasiado de la posición original',
  MSG_VALIDATION_HEADING: '⚠️ El ángulo de la cámara es muy diferente',
};