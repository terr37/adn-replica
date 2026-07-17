import { LoginCredentials, RegisterData, UserSession } from '../domain/AuthContracts';

export const authRepository = {
  login: async (credentials: LoginCredentials): Promise<UserSession> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({
            id: 'usr_123',
            name: 'Ciudadano Ejemplo',
            email: credentials.email,
            cedula: '001-1234567-8',
            token: 'mock-jwt-token-xyz',
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  },

  register: async (data: RegisterData): Promise<UserSession> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'usr_124',
          name: data.name,
          email: data.email,
          cedula: data.cedula,
          token: 'mock-jwt-token-new',
        });
      }, 1500);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};
