import { IPermisoUrbanoService } from '../domain/PermisoConstruccionEntity';
import { UrbanismoApiService } from './UrbanismoApiService';
import { UrbanismoMockService } from './UrbanismoMockService';

export const getUrbanismoService = (): IPermisoUrbanoService => {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  return isMockMode ? new UrbanismoMockService() : new UrbanismoApiService();
};
