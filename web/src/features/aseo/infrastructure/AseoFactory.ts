import { IAseoService } from '../domain/AseoEntities';
import { AseoApiService } from './AseoApiService';
import { AseoMockService } from './AseoMockService';

export const getAseoService = (): IAseoService => {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  return isMockMode ? new AseoMockService() : new AseoApiService();
};
