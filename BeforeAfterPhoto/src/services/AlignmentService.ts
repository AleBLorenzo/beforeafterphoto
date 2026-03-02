import { Platform } from 'react-native';

export class AlignmentService {
  /**
   * Intenta alinear la imagen DESPUÉS con la imagen ANTES usando OpenCV
   * Implementa lógica de Fallback (Hito 3.3)
   */
  static async alignImages(
    beforeUri: string,
    afterUri: string
  ): Promise<{ alignedUri: string; confidence: number; usedOriginal: boolean }> {
    try {
      // 1. Aquí se llama al Bridge de OpenCV nativo (C++/Java/Swift)
      // const result = await OpenCVModule.align(beforeUri, afterUri);

      console.log("Procesando alineación en dispositivo...");

      // Simulación de lógica de confianza (Feature Matching)
      const featureMatchConfidence = 0.85;

      if (featureMatchConfidence < 0.5) {
        throw new Error("Pocos puntos de coincidencia");
      }

      return {
        alignedUri: afterUri, // En prod: result.uri
        confidence: featureMatchConfidence,
        usedOriginal: false
      };
    } catch (error) {
      console.warn("Alineación fallida, usando original:", error);
      return {
        alignedUri: afterUri,
        confidence: 0,
        usedOriginal: true
      };
    }
  }
}