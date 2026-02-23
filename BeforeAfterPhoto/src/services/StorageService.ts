import AsyncStorage from '@react-native-async-storage/async-storage';
import { BeforeAfterRecord, CaptureStatus } from '../models/BeforeAfterRecord';
import { AppConstants } from '../constants/AppConstants';
import { GeoUtils } from '../utils/GeoUtils';

export const StorageService = {
  /**
   * Guarda un nuevo registro ANTES
   */
  saveBeforeRecord: async (record: BeforeAfterRecord): Promise<void> => {
    try {
      const existing = await StorageService.getAllRecords();
      const updated = [...existing, record];
      await AsyncStorage.setItem(AppConstants.STORAGE_KEY, JSON.stringify(updated));
      console.log('✅ Registro ANTES guardado:', record.id);
    } catch (e) {
      console.error('❌ Error guardando registro ANTES:', e);
      throw e;
    }
  },

  /**
   * Actualiza un registro existente añadiendo la foto DESPUÉS
   */
  saveAfterPhoto: async (
    recordId: string,
    afterData: {
      photoUri: string;
      thumbnailUri: string;
      timestamp: number;
      gps: any;
      heading: number;
      pitch: number;
      roll: number;
    }
  ): Promise<BeforeAfterRecord> => {
    try {
      const records = await StorageService.getAllRecords();
      const index = records.findIndex((r) => r.id === recordId);

      if (index === -1) {
        throw new Error('Registro no encontrado');
      }

      const beforeRecord = records[index];

      // Calcular validaciones
      const distance = GeoUtils.calculateDistance(beforeRecord.gps, afterData.gps);
      const headingDiff = Math.abs(
        GeoUtils.angleDifference(beforeRecord.heading, afterData.heading)
      );

      const validationErrors: string[] = [];
      if (distance > AppConstants.MAX_DISTANCE_METERS) {
        validationErrors.push(
          `Distancia: ${distance.toFixed(1)}m (máx: ${AppConstants.MAX_DISTANCE_METERS}m)`
        );
      }
      if (headingDiff > AppConstants.MAX_HEADING_DIFF) {
        validationErrors.push(
          `Ángulo: ${headingDiff.toFixed(1)}° (máx: ${AppConstants.MAX_HEADING_DIFF}°)`
        );
      }

      // Actualizar registro
      const updatedRecord: BeforeAfterRecord = {
        ...beforeRecord,
        status: CaptureStatus.COMPLETE,
        afterPhotoUri: afterData.photoUri,
        afterThumbnailUri: afterData.thumbnailUri,
        afterTimestamp: afterData.timestamp,
        afterGps: afterData.gps,
        afterHeading: afterData.heading,
        afterPitch: afterData.pitch,
        afterRoll: afterData.roll,
        distanceMeters: distance,
        headingDiffDegrees: headingDiff,
        isValid: validationErrors.length === 0,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      };

      records[index] = updatedRecord;
      await AsyncStorage.setItem(AppConstants.STORAGE_KEY, JSON.stringify(records));
      console.log('✅ Foto DESPUÉS guardada:', recordId);

      return updatedRecord;
    } catch (e) {
      console.error('❌ Error guardando foto DESPUÉS:', e);
      throw e;
    }
  },

  /**
   * Obtiene todos los registros
   */
  getAllRecords: async (): Promise<BeforeAfterRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(AppConstants.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('❌ Error obteniendo registros:', e);
      return [];
    }
  },

  /**
   * Obtiene un registro específico por ID
   */
  getRecordById: async (id: string): Promise<BeforeAfterRecord | null> => {
    try {
      const records = await StorageService.getAllRecords();
      return records.find((r) => r.id === id) || null;
    } catch (e) {
      console.error('❌ Error obteniendo registro:', e);
      return null;
    }
  },

  /**
   * Elimina un registro
   */
  deleteRecord: async (id: string): Promise<void> => {
    try {
      const records = await StorageService.getAllRecords();
      const filtered = records.filter((r) => r.id !== id);
      await AsyncStorage.setItem(AppConstants.STORAGE_KEY, JSON.stringify(filtered));
      console.log('✅ Registro eliminado:', id);
    } catch (e) {
      console.error('❌ Error eliminando registro:', e);
      throw e;
    }
  },

  /**
   * Limpia todos los registros (útil para testing)
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AppConstants.STORAGE_KEY);
      console.log('✅ Todos los registros eliminados');
    } catch (e) {
      console.error('❌ Error limpiando registros:', e);
      throw e;
    }
  },
};