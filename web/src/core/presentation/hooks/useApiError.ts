import { useState, useCallback } from 'react';
import { SdpApiError } from '../../infrastructure/apiClient';

export const useApiError = () => {
  const [error, setError] = useState<SdpApiError | null>(null);

  const handleError = useCallback((err: any) => {
    // Check if it matches our SdpApiError format
    if (err && typeof err === 'object' && 'status_code' in err && 'message' in err) {
      setError(err as SdpApiError);
    } else {
      // Fallback
      setError({
        timestamp: new Date().toISOString(),
        status_code: 500,
        error_code: 'UNKNOWN_ERROR',
        message: err.message || 'Ha ocurrido un error inesperado.',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
