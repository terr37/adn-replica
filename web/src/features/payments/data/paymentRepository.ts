import {
  obtenerHistorialPagos,
  procesarFacturaPago,
  HistorialPagoItem,
  SdpApiError,
} from '@/core/infrastructure/apiClient';
import { PaymentHistoryEntry, PaymentCheckoutData } from '../domain/PaymentContracts';

// ============================================================================
// Shape mapper: HistorialPagoItem (API) → PaymentHistoryEntry (UI domain)
// The fields are already aligned 1-to-1 since PaymentContracts was modeled
// after the API contract. We keep the explicit mapper for safety.
// ============================================================================
const mapHistorialItem = (item: HistorialPagoItem): PaymentHistoryEntry => ({
  id: item.id,
  ncf: item.ncf,
  reference: item.reference,
  concept: item.concept,
  amount: item.amount,
  date: item.date,
  status: item.status,
});

// ============================================================================
// Repository
// ============================================================================
export const paymentRepository = {
  /**
   * Fetches the full payment history for the authenticated user.
   * The USE_MOCKS toggle in apiClient determines whether this hits a mock
   * or the real backend.
   */
  getPaymentHistory: async (_userId: string): Promise<PaymentHistoryEntry[]> => {
    const raw = await obtenerHistorialPagos();
    return raw.map(mapHistorialItem);
  },

  /**
   * Processes a payment using the core API.
   * Requires a `deuda_id` (from `obtenerDeudasPendientes`) and card data.
   * Returns a simplified success envelope for the UI.
   */
  processPayment: async (
    data: PaymentCheckoutData
  ): Promise<{ success: boolean; ncf: string; reference: string }> => {
    // Build the FacturaRequest. metodo_pago_id is derived from the card last 4 + holder
    // for mock purposes; in production it comes from tokenizarTarjeta().
    const result = await procesarFacturaPago({
      metodo_pago_id: `mock_card_${data.cardNumber.slice(-4)}`,
      deuda_id: data.conceptId ?? 'deu-001',
      monto: data.amount,
      impuestos: 0,
      concepto: `Pago: ${data.cardHolder}`,
    });

    if (result.status !== 'success') {
      const err: SdpApiError = {
        timestamp: new Date().toISOString(),
        status_code: 500,
        error_code: 'PAYMENT_FAILED',
        message: result.message,
      };
      return Promise.reject(err);
    }

    return {
      success: true,
      ncf: result.data.factura_id,
      reference: result.data.pago_id,
    };
  },
};
