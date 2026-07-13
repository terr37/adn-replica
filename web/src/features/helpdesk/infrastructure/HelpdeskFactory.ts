import { IHelpdeskService } from '../domain/TicketEntity';
import { HelpdeskApiService } from './HelpdeskApiService';
import { HelpdeskMockService } from './HelpdeskMockService';

export const getHelpdeskService = (): IHelpdeskService => {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  return isMockMode ? new HelpdeskMockService() : new HelpdeskApiService();
};
