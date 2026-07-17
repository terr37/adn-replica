'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentRepository } from '@/features/payments/data/paymentRepository';
import { PaymentHistoryEntry } from '@/features/payments/domain/PaymentContracts';
import { useAppRefresh } from '@/core/context/AppRefreshContext';
import {
  Printer,
  Filter,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export const PaymentHistoryModal = () => {
  const router = useRouter();
  const { paymentVersion } = useAppRefresh();

  const [payments, setPayments] = useState<PaymentHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'TODOS' | 'COMPLETADO' | 'PENDIENTE' | 'RECHAZADO'>('TODOS');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistoryEntry | null>(null);

  // ── Prevent body scroll while modal is open ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Fetch history. Re-runs whenever paymentVersion increments (new payment). ──
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentRepository.getPaymentHistory('usr_123');
      setPayments(data);
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ?? 'Error cargando el historial de pagos.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    // paymentVersion in the dep-array means: re-fetch whenever CheckoutModal
    // succeeds and calls invalidatePayments() — no F5 needed.
  }, [fetchPayments, paymentVersion]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredPayments =
    filter === 'TODOS' ? payments : payments.filter((p) => p.status === filter);

  // ── Badge helper ──────────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completado
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'RECHAZADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <AlertCircle className="w-3.5 h-3.5" /> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  const handlePrint = (payment: PaymentHistoryEntry) => {
    setSelectedReceipt(payment);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const closeModal = () => {
    router.push('/');
  };

  // ── Table body content ────────────────────────────────────────────────────
  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="py-4 px-6">
            <div className="h-3.5 bg-slate-200 rounded w-36 mb-1.5" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </td>
          <td className="py-4 px-6">
            <div className="h-3.5 bg-slate-200 rounded w-20" />
          </td>
          <td className="py-4 px-6">
            <div className="h-3.5 bg-slate-200 rounded w-16" />
          </td>
          <td className="py-4 px-6">
            <div className="h-6 bg-slate-100 rounded-full w-24" />
          </td>
          <td className="py-4 px-6 text-right">
            <div className="h-7 bg-slate-100 rounded-lg w-20 ml-auto" />
          </td>
        </tr>
      ));
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-500 font-medium">{error}</p>
              <button
                onClick={fetchPayments}
                className="flex items-center gap-1.5 text-xs font-bold text-[#051429] border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar
              </button>
            </div>
          </td>
        </tr>
      );
    }

    if (filteredPayments.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
            No se encontraron registros para este filtro.
          </td>
        </tr>
      );
    }

    return filteredPayments.map((payment) => (
      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
        <td className="py-4 px-6">
          <p className="text-sm font-bold text-[#051429]">{payment.concept}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(payment.date).toLocaleDateString('es-DO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </td>
        <td className="py-4 px-6">
          <p className="text-sm text-slate-700 font-mono">{payment.reference}</p>
          {payment.ncf !== '-' && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">NCF: {payment.ncf}</p>
          )}
        </td>
        <td className="py-4 px-6">
          <p className="text-sm font-black text-[#051429]">
            RD$ {payment.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
        </td>
        <td className="py-4 px-6">{getStatusBadge(payment.status)}</td>
        <td className="py-4 px-6 text-right">
          {payment.status === 'COMPLETADO' ? (
            <button
              onClick={() => handlePrint(payment)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-[#051429] hover:text-white hover:border-[#051429] transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
          ) : payment.status === 'PENDIENTE' ? (
            <span className="text-xs font-semibold text-slate-400 italic">En revisión por Caja</span>
          ) : (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
              Trámite Rechazado
            </span>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:p-0 print:block">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#051429]/60 backdrop-blur-md transition-opacity print:hidden"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 print:hidden">

        {/* Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-sans font-black text-[#051429]">Historial de Pagos</h2>
            <p className="text-slate-500 text-xs mt-0.5">Consulte sus comprobantes y estados de cuenta.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Manual refresh button */}
            <button
              onClick={fetchPayments}
              disabled={isLoading}
              title="Actualizar historial"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Filter bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Filter className="w-4 h-4 text-slate-400" />
                Filtrar:
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {(['TODOS', 'COMPLETADO', 'PENDIENTE', 'RECHAZADO'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      filter === status
                        ? 'bg-white text-[#051429] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading banner for subsequent fetches (paymentVersion increments) */}
            {isLoading && payments.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Actualizando historial…
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Concepto / Fecha
                    </th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{renderTableBody()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Wrapper */}
      {selectedReceipt && (
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 font-sans">
          <div className="max-w-2xl mx-auto border-2 border-slate-800 p-8">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <Landmark className="w-12 h-12 text-slate-800" />
                <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    ALCALDÍA DISTRITO NACIONAL
                  </h1>
                  <p className="text-sm text-slate-600 font-bold uppercase">Recibo Oficial de Ingreso</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500">Fecha de Emisión</p>
                <p className="text-base font-bold text-slate-800">
                  {new Date(selectedReceipt.date).toLocaleDateString('es-DO')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Datos del Contribuyente
                </p>
                <p className="text-base font-bold text-slate-800">Ciudadano Ejemplo</p>
                <p className="text-sm text-slate-600">ID: usr_123</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Detalles del Comprobante
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-bold">Referencia:</span> {selectedReceipt.reference}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-bold">NCF:</span> {selectedReceipt.ncf}
                </p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-2 text-sm font-black text-slate-800">Concepto del Pago</th>
                  <th className="py-2 text-sm font-black text-slate-800 text-right">Monto (RD$)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 text-base font-medium text-slate-800">{selectedReceipt.concept}</td>
                  <td className="py-4 text-base font-bold text-slate-800 text-right">
                    {selectedReceipt.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-4 text-lg font-black text-slate-800 text-right">TOTAL PAGADO</td>
                  <td className="py-4 text-xl font-black text-slate-800 text-right">
                    RD$ {selectedReceipt.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="border-t border-slate-200 pt-6 mt-16 flex justify-between items-end">
              <p className="text-xs text-slate-500">
                Este recibo es válido como comprobante de pago oficial de la Alcaldía del Distrito
                Nacional.
                <br />
                Para validación, visite el portal de transparencia con el número de NCF provisto.
              </p>
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-2" />
                <p className="text-xs font-bold text-slate-800">Firma Autorizada</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};