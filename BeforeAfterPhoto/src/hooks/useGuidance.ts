import { useState, useEffect, useMemo } from 'react';
import { BeforeAfterRecord, GPSCoordinates } from '../models/BeforeAfterRecord';
import { GeoUtils } from '../utils/GeoUtils';
import { AppConstants } from '../constants/AppConstants';

export interface CurrentSensorData {
  gps: GPSCoordinates;
  heading: number;
  pitch: number;
  roll: number;
}

export const useGuidance = (beforeRecord: BeforeAfterRecord, current: CurrentSensorData) => {
  // 1. Cálculos de desviaciones
  const diffs = useMemo(() => {
    const dist = GeoUtils.calculateDistance(beforeRecord.gps, current.gps);
    const headDiff = Math.abs(GeoUtils.angleDifference(beforeRecord.heading, current.heading));
    const pitchDiff = Math.abs(beforeRecord.pitch - current.pitch);
    const rollDiff = Math.abs(beforeRecord.roll - current.roll);

    return { dist, headDiff, pitchDiff, rollDiff };
  }, [beforeRecord, current]);

  // 2. Evaluación de los 4 criterios (Semáforo)
  const checks = [
    diffs.dist <= AppConstants.MAX_DISTANCE_METERS,
    diffs.headDiff <= AppConstants.MAX_HEADING_DIFF,
    diffs.pitchDiff <= AppConstants.MAX_PITCH_DIFF,
    diffs.rollDiff <= AppConstants.MAX_PITCH_DIFF, // Usamos pitch diff como referencia para roll
  ];

  const criteriaMet = checks.filter(Boolean).length;

  const alignmentStatus = useMemo(() => {
    if (criteriaMet >= 3) return 'GREEN';
    if (criteriaMet >= 2) return 'YELLOW';
    return 'RED';
  }, [criteriaMet]);

  // 3. Priorización de Instrucciones (Hito 3.2)
  const instruction = useMemo(() => {
    if (diffs.dist > AppConstants.MAX_DISTANCE_METERS) {
      return `Camina hacia el punto (faltan ${diffs.dist.toFixed(1)}m)`;
    }
    if (diffs.headDiff > AppConstants.MAX_HEADING_DIFF) {
      return "Gira el dispositivo hacia el objetivo";
    }
    if (diffs.pitchDiff > AppConstants.MAX_PITCH_DIFF || diffs.rollDiff > 10) {
      return "Ajusta la inclinación de la cámara";
    }
    return "¡Posición perfecta! Captura ahora";
  }, [diffs]);

  return {
    alignmentStatus,
    criteriaMet,
    instruction,
    diffs,
    canCapture: alignmentStatus !== 'RED'
  };
};