export const AppConstants = {
  // --- Umbrales GPS ---
  GPS_ACCURACY_THRESHOLD: 15, // metros (Hito 1)
  GPS_TIMEOUT: 5000,
  GPS_MAX_AGE: 10000,

  // --- Umbrales de Validación (Hito 3 - El "Semáforo") ---
  // Estos valores definen si el círculo se pone VERDE, AMARILLO o ROJO
  MAX_DISTANCE_METERS: 5,     // Distancia máxima permitida
  MAX_HEADING_DIFF: 15,       // Diferencia de rotación (brújula)
  MAX_PITCH_DIFF: 10,         // Inclinación hacia adelante/atrás
  MAX_ROLL_DIFF: 10,          // Inclinación lateral

  // --- Configuración de UI de Guiado ---
  GHOST_OVERLAY_DEFAULT_OPACITY: 0.4, // 40% de opacidad inicial
  HEADING_FILTER_SAMPLES: 5,          // Para el filtro de media móvil del Hito 2

  // --- OpenCV / Alineación ---
  ALIGNED_CONFIDENCE_THRESHOLD: 0.5,  // Mínimo para aceptar ajuste de OpenCV

  // --- Storage ---
  STORAGE_KEY: '@before_after_records',

  // --- Mensajes de Guiado (Priorizados) ---
  MSG_GUIDE_DISTANCE: '📍 Camina hacia el punto de origen',
  MSG_GUIDE_HEADING: '🔄 Gira el dispositivo hacia el objetivo',
  MSG_GUIDE_LEVEL: '📱 Ajusta la inclinación de la cámara',
  MSG_GUIDE_READY: '✅ ¡Posición perfecta! Captura ahora',

  // --- Mensajes de Estado ---
  MSG_GPS_WEAK: 'Señal GPS débil. Sal al exterior.',
  MSG_GPS_WAITING: 'Esperando mejor señal GPS...',
  MSG_GPS_GOOD: 'GPS listo',
  MSG_CAPTURE_SUCCESS: '✅ Foto guardada correctamente',
  MSG_CALIBRATE_COMPASS: '🧲 Calibra la brújula (mueve el móvil en ∞)',
};