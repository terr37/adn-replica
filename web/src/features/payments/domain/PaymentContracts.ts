export interface PaymentHistoryEntry {
  id: string;
  ncf: string;
  reference: string;
  concept: string;
  amount: number;
  date: string;
  status: 'COMPLETADO' | 'PENDIENTE' | 'RECHAZADO';
}

export interface PaymentCheckoutData {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  conceptId?: string;
  amount: number;
}
