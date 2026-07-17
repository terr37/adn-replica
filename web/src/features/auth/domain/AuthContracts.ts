export interface UserSession {
  id: string;
  name: string;
  email: string;
  cedula: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  cedula: string;
  email: string;
  password?: string;
}
