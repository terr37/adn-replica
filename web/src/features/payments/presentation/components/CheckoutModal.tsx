'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { paymentRepository } from '@/features/payments/data/paymentRepository';
import {
  obtenerDeudasPendientes,
  DeudaContribuyenteResponse,
  SdpApiError,
} from '@/core/infrastructure/apiClient';
import { useAppRefresh } from '@/core/context/AppRefreshContext';
import {
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  X,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

export const CheckoutModal = () => {
  const router = useRouter();
  const { invalidatePayments } = useAppRefresh();

  // ── Debts loading state ──────────────────────────────────────────────────
  const [debts, setDebts] = useState<DeudaContribuyenteResponse[]>([]);
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [isLoadingDebts, setIsLoadingDebts] = useState(true);
  const [debtsError, setDebtsError] = useState<string | null>(null);

  // ── Payment form state ───────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // ── Prevent body scroll while modal is open ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Fetch pending debts on mount ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchDebts = async () => {
      setIsLoadingDebts(true);
      setDebtsError(null);
      try {
        const data = await obtenerDeudasPendientes();
        if (!cancelled) {
          setDebts(data);
          if (data.length > 0) setSelectedDebtId(data[0].deuda_id);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            (err as SdpApiError)?.message ??
            (err instanceof Error ? err.message : 'Error cargando las deudas pendientes.');
          setDebtsError(msg);
        }
      } finally {
        if (!cancelled) setIsLoadingDebts(false);
      }
    };

    fetchDebts();
    return () => { cancelled = true; };
  }, []);

  const selectedDebt = debts.find((d) => d.deuda_id === selectedDebtId) ?? debts[0];

  // ── Form handlers ────────────────────────────────────────────────────────
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;

    setError('');
    setIsSubmitting(true);

    try {
      await paymentRepository.processPayment({
        ...formData,
        conceptId: selectedDebt.deuda_id,
        amount: selectedDebt.monto,
      });

      // Notify all subscribers (e.g. PaymentHistoryModal) to refetch
      invalidatePayments();

      // Navigate to history modal so user sees the new PENDIENTE record immediately
      router.push('/?modal=history');
    } catch (err: unknown) {
      const msg =
        (err as SdpApiError)?.message ??
        (err instanceof Error ? err.message : 'Error procesando el pago. Intente de nuevo.');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    router.push('/');
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderOrderSummary = () => {
    if (isLoadingDebts) {
      return (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-6 bg-white/10 rounded w-full mt-4" />
        </div>
      );
    }

    if (debtsError) {
      return (
        <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{debtsError}</p>
        </div>
      );
    }

    if (!selectedDebt) {
      return <p className="text-xs text-slate-400 italic">No hay deudas pendientes.</p>;
    }

    return (
      <div className="space-y-4 text-sm">
        {/* Debt selector — only shown if there are multiple debts */}
        {debts.length > 1 && (
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Seleccionar deuda
            </label>
            <div className="relative">
              <select
                value={selectedDebtId}
                onChange={(e) => setSelectedDebtId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-[#B8902F]/50 pr-8"
              >
                {debts.map((d) => (
                  <option key={d.deuda_id} value={d.deuda_id} className="bg-[#0a2040] text-white">
                    {d.servicio} — RD$ {d.monto.toLocaleString('es-DO')}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-slate-300">Concepto</span>
          <span className="font-bold text-right max-w-[140px] leading-tight">{selectedDebt.servicio}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Referencia</span>
          <span className="font-bold font-mono">{selectedDebt.deuda_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Vencimiento</span>
          <span className="font-bold text-amber-400 text-xs">
            {new Date(selectedDebt.fecha_vencimiento).toLocaleDateString('es-DO')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#051429]/60 backdrop-blur-md transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-sans font-black text-[#051429]">Caja Virtual</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Plataforma de pagos segura de la Alcaldía del Distrito Nacional.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Payment Form ── */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 text-[#051429]">
                <CreditCard className="w-5 h-5 text-[#B8902F]" />
                <h2 className="text-lg font-bold">Datos de Tarjeta</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Nombre en la tarjeta
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#051429]/20 focus:border-[#051429] transition-all"
                    placeholder="EJ. JUAN PEREZ"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={16}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#051429]/20 focus:border-[#051429] transition-all font-mono"
                    placeholder="0000 0000 0000 0000"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Expiración (MM/AA)
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      maxLength={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#051429]/20 focus:border-[#051429] transition-all font-mono"
                      placeholder="MM/AA"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#051429]/20 focus:border-[#051429] transition-all font-mono tracking-widest"
                      placeholder="•••"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingDebts || !selectedDebt}
                  className="w-full bg-[#051429] hover:bg-[#0a2347] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#051429]/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#B8902F]" />
                      <span>Procesando pago seguro...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#B8902F]" />
                      Pagar RD${' '}
                      {selectedDebt
                        ? selectedDebt.monto.toLocaleString('es-DO', { minimumFractionDigits: 2 })
                        : '—'}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-[#051429] rounded-2xl p-6 text-white sticky top-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <Landmark className="text-[#B8902F] w-6 h-6" />
                  <h3 className="font-bold text-lg">Resumen de Pago</h3>
                </div>

                <div className="mb-6">{renderOrderSummary()}</div>

                {selectedDebt && !isLoadingDebts && (
                  <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                    <span className="text-slate-300 font-medium">Total a Pagar</span>
                    <span className="text-2xl font-black text-[#B8902F]">
                      RD$ {selectedDebt.monto.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="mt-8 flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Transacción cifrada con grado bancario. La Alcaldía del Distrito Nacional no
                    almacena los datos de su tarjeta.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
