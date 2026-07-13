import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// SDP Error Format Interface (SDP-ADN-REP-2026-001)
// ============================================================================
export interface SdpApiError {
  timestamp: string;
  status_code: number;
  error_code: string;
  message: string;
}

// ============================================================================
// Axios Configuration
// ============================================================================
export const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080/api/v1';

  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 15000,
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Logic for auth tokens could go here if needed in the future
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Parse the standard SDP Error format
      let formattedError: SdpApiError;

      if (error.response && error.response.data) {
        // Assume the backend followed the contract
        const data = error.response.data as Partial<SdpApiError>;
        formattedError = {
          timestamp: data.timestamp || new Date().toISOString(),
          status_code: data.status_code || error.response.status || 500,
          error_code: data.error_code || 'UNKNOWN_ERROR',
          message: data.message || 'Error inesperado en el servidor.',
        };
      } else if (error.request) {
        // Network error / Offline
        formattedError = {
          timestamp: new Date().toISOString(),
          status_code: 0,
          error_code: 'NETWORK_ERROR',
          message: 'Error de conectividad. Verifique su conexión de red.',
        };
      } else {
        // Something else
        formattedError = {
          timestamp: new Date().toISOString(),
          status_code: 500,
          error_code: 'INTERNAL_CLIENT_ERROR',
          message: error.message,
        };
      }

      // We reject with our structured error to be handled by the UI
      return Promise.reject(formattedError);
    }
  );

  return client;
};

// Expose a singleton instance for real API calls
export const apiClient = createApiClient();
