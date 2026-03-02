import { useState } from 'react';
import { AlignmentService } from '../services/AlignmentService';

export const useImageAlignment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAlignment = async (beforeUri: string, afterUri: string) => {
    setIsProcessing(true);
    try {
      const result = await AlignmentService.alignImages(beforeUri, afterUri);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processAlignment, isProcessing };
};