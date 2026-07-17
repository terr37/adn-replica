import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// 1. FORMATO DE ERRORES ESTÁNDAR (SDP-ADN-REP-2026-001)
// ============================================================================
export interface SdpApiError {
  timestamp: string;
  status_code: number;
  error_code: string;
  message: string;
  details?: string;
  errors?: Record<string, string>;
}

// ============================================================================
// 2. CONTRATOS DE DATOS (INTERFACES DE MÓDULOS)
// ============================================================================

// --- MÓDULO DE AUTENTICACIÓN ---
export interface RegisterRequest {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    usuario_id: string;
    nombre: string;
    email: string;
    fecha_registro: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  data: {
    usuario_id: string;
    nombre: string;
    rol: string;
  };
}

// --- MÓDULO DE CATÁLOGO Y DEUDAS ---
export interface ServicioCatalogResponse {
  id: string;
  nombre: string;
  descripcion: string;
  monto_base: number;
  categoria: string;
}

export interface DeudaContribuyenteResponse {
  deuda_id: string;
  servicio: string;
  monto: number;
  fecha_vencimiento: string;
}

// --- MÓDULO DE PAGOS Y TRANSPARENCIA ---
export interface TasaPendienteResponse {
  referenciaId: string;
  nombreContribuyente: string;
  tipoPago: string;
  montoPendiente: number;
  estado: string;
}

export interface RegistrarPagoRequest {
  referenciaId: string;
  nombreContribuyente: string;
  tipoPago: string;
  montoPagado: number;
  gatewayTransaccionId: string;
}

export interface RegistrarPagoResponse {
  exito: boolean;
  mensaje: string;
  ncf: string;
  transaccionId: string;
}

export interface TokenizarTarjetaRequest {
  card_token: string;
  titular: string;
  ultimos_cuatro: string;
  marca: string;
  mes_expiracion: string;
  anio_expiracion: string;
}

export interface TokenizarTarjetaResponse {
  status: string;
  message: string;
  data: {
    metodo_pago_id: string;
    marca: string;
    ultimos_cuatro: string;
    activo: boolean;
  };
}

export interface FacturaRequest {
  metodo_pago_id: string;
  deuda_id: string;
  monto: number;
  impuestos: number;
  concepto: string;
}

export interface FacturaResponse {
  status: string;
  message: string;
  data: {
    factura_id: string;
    pago_id: string;
    monto_total: number;
    estado: string;
    fecha_emision: string;
  };
}

export interface HistorialPagoItem {
  id: string;
  concept: string;
  date: string;
  reference: string;
  ncf: string;
  amount: number;
  status: 'PENDIENTE' | 'COMPLETADO' | 'RECHAZADO';
}

export interface ExportarPdfResponse {
  status: string;
  pdf_url: string;
}

// --- MÓDULO DE MAPA E INCIDENTES ---
export interface RegistrarIncidenteRequest {
  categoria: string;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagen_url?: string;
}

export interface RegistrarIncidenteResponse {
  status: string;
  message: string;
  data: {
    incidente_id: string;
    estado: string;
    fecha_creacion: string;
  };
}

export interface IncidenteMapaItem {
  incidente_id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  estado: string;
  fecha_creacion: string;
}


// ============================================================================
// 3. MOCK/REAL TOGGLE ENGINE
// ============================================================================
const USE_MOCKS: boolean =
  process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

const mockDelay = (ms = 700): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 4. MOCK DATA BLOCKS
// ============================================================================

const MOCK_CATALOGO: ServicioCatalogResponse[] = [
  {
    id: 'svc-001',
    nombre: 'Permisos de Construcción',
    descripcion: 'Autorización para inicio de obras y modificaciones estructurales mayores en su propiedad.',
    monto_base: 2500,
    categoria: 'construccion',
  },
  {
    id: 'svc-002',
    nombre: 'Recolección Especial',
    descripcion: 'Servicio programado para retiro de escombros o residuos voluminosos del hogar.',
    monto_base: 800,
    categoria: 'ambiental',
  },
  {
    id: 'svc-003',
    nombre: 'Uso de Espacio Público',
    descripcion: 'Permisos temporales para eventos, ferias o actividades comerciales en espacios municipales.',
    monto_base: 1200,
    categoria: 'comercial',
  },
  {
    id: 'svc-004',
    nombre: 'Registro Comercial',
    descripcion: 'Inscripción y renovación de patentes municipales para negocios formales.',
    monto_base: 5000,
    categoria: 'comercial',
  },
  {
    id: 'svc-005',
    nombre: 'Certificación de No Objeción',
    descripcion: 'Documento habilitante para operaciones comerciales y trámites bancarios.',
    monto_base: 1500,
    categoria: 'documentos',
  },
  {
    id: 'svc-006',
    nombre: 'Solicitud de Poda',
    descripcion: 'Gestión municipal para mantenimiento y poda de árboles en vía pública.',
    monto_base: 300,
    categoria: 'ambiental',
  },
  {
    id: 'svc-007',
    nombre: 'Placa de Numeración',
    descripcion: 'Solicitud oficial de numeración de inmuebles residenciales y comerciales.',
    monto_base: 450,
    categoria: 'documentos',
  },
  {
    id: 'svc-008',
    nombre: 'Publicidad Exterior',
    descripcion: 'Permisos para instalación de letreros, vallas y pantallas publicitarias.',
    monto_base: 3000,
    categoria: 'comercial',
  },
];

const MOCK_DEUDAS: DeudaContribuyenteResponse[] = [
  {
    deuda_id: 'deu-001',
    servicio: 'Tasa Licencia de Construcción',
    monto: 14500.0,
    fecha_vencimiento: '2026-08-01T00:00:00Z',
  },
  {
    deuda_id: 'deu-002',
    servicio: 'Recolección de Desechos — Q3 2026',
    monto: 2500.0,
    fecha_vencimiento: '2026-07-31T00:00:00Z',
  },
];

const MOCK_HISTORIAL: HistorialPagoItem[] = [
  {
    id: 'pay_001',
    concept: 'Tasa Lic. Construcción',
    date: '2026-07-10T10:30:00Z',
    reference: '1266201',
    ncf: 'B0100001234',
    amount: 14500.0,
    status: 'COMPLETADO',
  },
  {
    id: 'pay_002',
    concept: 'Recolección de Desechos - Q3',
    date: '2026-07-01T14:15:00Z',
    reference: '1266305',
    ncf: 'B0100001288',
    amount: 2500.0,
    status: 'COMPLETADO',
  },
  {
    id: 'pay_003',
    concept: 'Permiso Uso Espacio Público',
    date: '2026-07-12T09:00:00Z',
    reference: '1266450',
    ncf: '-',
    amount: 5000.0,
    status: 'PENDIENTE',
  },
  {
    id: 'pay_004',
    concept: 'Registro Comercial 2025',
    date: '2025-12-05T11:00:00Z',
    reference: '1259881',
    ncf: '-',
    amount: 5000.0,
    status: 'RECHAZADO',
  },
];

const MOCK_INCIDENTES: IncidenteMapaItem[] = [
  {
    incidente_id: 'inc-001',
    categoria: 'BASURA',
    titulo: 'Vertedero improvisado en acera',
    descripcion: 'Vertedero improvisado acumulando desechos en la acera principal.',
    latitud: 18.489,
    longitud: -69.935,
    estado: 'ACTIVO',
    fecha_creacion: '2026-07-14T08:00:00Z',
  },
  {
    incidente_id: 'inc-002',
    categoria: 'ARBOL',
    titulo: 'Rama obstruyendo carril',
    descripcion: 'Rama grande obstruyendo el carril derecho de la vía.',
    latitud: 18.482,
    longitud: -69.92,
    estado: 'ACTIVO',
    fecha_creacion: '2026-07-15T12:30:00Z',
  },
  {
    incidente_id: 'inc-003',
    categoria: 'AVERIA',
    titulo: 'Bache profundo en Av. Luperón',
    descripcion: 'Bache de gran tamaño en el carril izquierdo representa riesgo para vehículos.',
    latitud: 18.4775,
    longitud: -69.958,
    estado: 'ACTIVO',
    fecha_creacion: '2026-07-13T16:00:00Z',
  },
];

const MOCK_FACTURA_RESPONSE: FacturaResponse = {
  status: 'success',
  message: 'Pago procesado exitosamente.',
  data: {
    factura_id: `fac_${Date.now()}`,
    pago_id: `pay_${Date.now()}`,
    monto_total: 14500.0,
    estado: 'PENDIENTE',
    fecha_emision: new Date().toISOString(),
  },
};

// ============================================================================
// 5. CONFIGURACIÓN Y CLIENTE AXIOS
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

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      let formattedError: SdpApiError;

      if (error.response && error.response.data) {
        const data = error.response.data as Record<string, unknown>;
        formattedError = {
          timestamp: (data.timestamp as string) || new Date().toISOString(),
          status_code: error.response.status || 500,
          error_code: (data.code as string) || 'UNKNOWN_ERROR',
          message: (data.message as string) || 'Error inesperado en el servidor.',
          details: (data.details as string) || undefined,
          errors: (data.errors as Record<string, string>) || undefined,
        };
      } else if (error.request) {
        formattedError = {
          timestamp: new Date().toISOString(),
          status_code: 0,
          error_code: 'NETWORK_ERROR',
          message: 'Error de conectividad. Verifique su conexión de red.',
        };
      } else {
        formattedError = {
          timestamp: new Date().toISOString(),
          status_code: 500,
          error_code: 'INTERNAL_CLIENT_ERROR',
          message: error.message,
        };
      }

      return Promise.reject(formattedError);
    }
  );

  return client;
};

export const apiClient = createApiClient();


// ============================================================================
// 6. OPERACIONES DE DATOS DE LA APLICACIÓN (DATA SOURCES)
// ============================================================================

export async function registrarUsuario(datos: RegisterRequest): Promise<RegisterResponse> {
  if (USE_MOCKS) {
    await mockDelay(800);
    return {
      status: 'success',
      message: 'Usuario registrado exitosamente (Mock Offline)',
      data: {
        usuario_id: `usr_${Date.now()}`,
        nombre: datos.nombre,
        email: datos.email,
        fecha_registro: new Date().toISOString(),
      },
    };
  }
  const response = await apiClient.post<RegisterResponse>('/auth/register', datos);
  return response.data;
}

export async function iniciarSesion(datos: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCKS) {
    await mockDelay(800);

    // Trigger de prueba: si el usuario escribe este correo, simula un fallo de credenciales
    if (datos.email === 'error@adn.gob.do') {
      const error: SdpApiError = {
        timestamp: new Date().toISOString(),
        status_code: 401,
        error_code: 'INVALID_CREDENTIALS',
        message: 'Las credenciales proporcionadas son incorrectas (Mock).',
      };
      return Promise.reject(error);
    }

    // Login exitoso offline (puedes usar cualquier clave)
    return {
      status: 'success',
      token: 'mock-jwt-token-adn-2026-xyz',
      data: {
        usuario_id: 'usr_mock_101',
        nombre: datos.email.split('@')[0].toUpperCase(), // Usa la primera parte del email como nombre de prueba
        rol: 'CONTRIBUYENTE',
      },
    };
  }
  const response = await apiClient.post<LoginResponse>('/auth/login', datos);
  return response.data;
}

export async function obtenerCatalogoServicios(): Promise<ServicioCatalogResponse[]> {
  if (USE_MOCKS) {
    await mockDelay(650);
    return MOCK_CATALOGO;
  }
  const response = await apiClient.get<{ data: ServicioCatalogResponse[] }>('/servicios');
  return response.data.data;
}

export async function obtenerDeudasPendientes(): Promise<DeudaContribuyenteResponse[]> {
  if (USE_MOCKS) {
    await mockDelay(700);
    return MOCK_DEUDAS;
  }
  const response = await apiClient.get<{ data: DeudaContribuyenteResponse[] }>('/contribuyentes/deudas');
  return response.data.data;
}

export async function consultarTasa(referenciaId: string): Promise<TasaPendienteResponse> {
  const response = await apiClient.get<TasaPendienteResponse>('/web/tasas', {
    params: { referenciaId }
  });
  return response.data;
}

export async function registrarPagoWeb(datos: RegistrarPagoRequest): Promise<RegistrarPagoResponse> {
  const payload = {
    ...datos,
    fechaTransaccion: new Date().toISOString()
  };
  const response = await apiClient.post<RegistrarPagoResponse>('/web/tasas/pagar', payload);
  return response.data;
}

export async function tokenizarTarjeta(datos: TokenizarTarjetaRequest): Promise<TokenizarTarjetaResponse> {
  const response = await apiClient.post<TokenizarTarjetaResponse>('/pagos/metodos', datos);
  return response.data;
}

export async function procesarFacturaPago(datos: FacturaRequest): Promise<FacturaResponse> {
  if (USE_MOCKS) {
    await mockDelay(1200);
    if (Math.random() < 0.1) {
      const error: SdpApiError = {
        timestamp: new Date().toISOString(),
        status_code: 402,
        error_code: 'PAYMENT_DECLINED',
        message: 'Pago declinado por la entidad bancaria. Verifique sus datos.',
      };
      return Promise.reject(error);
    }
    return {
      ...MOCK_FACTURA_RESPONSE,
      data: {
        ...MOCK_FACTURA_RESPONSE.data,
        factura_id: `fac_${Date.now()}`,
        pago_id: `pay_${Date.now()}`,
        monto_total: datos.monto,
        concepto: datos.concepto,
        fecha_emision: new Date().toISOString(),
      } as FacturaResponse['data'],
    };
  }
  const response = await apiClient.post<FacturaResponse>('/pagos/factura', datos);
  return response.data;
}

export async function obtenerHistorialPagos(): Promise<HistorialPagoItem[]> {
  if (USE_MOCKS) {
    await mockDelay(800);
    return MOCK_HISTORIAL;
  }
  const response = await apiClient.get<{ data: HistorialPagoItem[] }>('/pagos/historial');
  return response.data.data;
}

export async function exportarHistorialPdf(): Promise<ExportarPdfResponse> {
  const response = await apiClient.get<ExportarPdfResponse>('/pagos/historial/exportar');
  return response.data;
}

// ARREGLADO: El mock ahora inserta activamente los nuevos incidentes en el arreglo global
export async function reportarIncidente(datos: RegistrarIncidenteRequest): Promise<RegistrarIncidenteResponse> {
  if (USE_MOCKS) {
    await mockDelay(900);

    const nuevoIncidente: IncidenteMapaItem = {
      incidente_id: `inc_${Date.now()}`,
      categoria: datos.categoria,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      latitud: datos.latitud,
      longitud: datos.longitud,
      estado: 'ACTIVO',
      fecha_creacion: new Date().toISOString(),
    };

    MOCK_INCIDENTES.push(nuevoIncidente);

    return {
      status: 'success',
      message: 'Incidente registrado correctamente.',
      data: {
        incidente_id: nuevoIncidente.incidente_id,
        estado: nuevoIncidente.estado,
        fecha_creacion: nuevoIncidente.fecha_creacion,
      },
    };
  }
  const response = await apiClient.post<RegistrarIncidenteResponse>('/incidentes', datos);
  return response.data;
}

export async function obtenerIncidentesMapa(): Promise<IncidenteMapaItem[]> {
  if (USE_MOCKS) {
    await mockDelay(600);
    return MOCK_INCIDENTES;
  }
  const response = await apiClient.get<{ data: IncidenteMapaItem[] }>('/incidentes');
  return response.data.data;
}