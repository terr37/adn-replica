'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../core/components/Toast';
import { ArrowLeft, Building2, FileCheck, Tent, Store, Recycle, Loader2, CheckCircle2, ShoppingCart, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../../core/presentation/CartContext';
import { PaymentModal } from '../../../features/payments/presentation/components/PaymentModal';

const TIPOS_TRAMITE = [
  { value: 'permiso_construccion', label: 'Permiso de Construcción', icon: <Building2 className="w-4 h-4" /> },
  { value: 'uso_suelo', label: 'Certificación de Uso de Suelo', icon: <FileCheck className="w-4 h-4" /> },
  { value: 'espacio_publico', label: 'Uso de Espacio Público', icon: <Tent className="w-4 h-4" /> },
  { value: 'registro_comercial', label: 'Registro Comercial / Patente', icon: <Store className="w-4 h-4" /> },
  { value: 'recoleccion_especial', label: 'Recolección Especial', icon: <Recycle className="w-4 h-4" /> },
];

export default function NuevoTramitePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Estados locales para simulación (Modo Mock) para evitar llamadas al backend real
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addItem } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    solicitante: '',
    tipoTramite: 'permiso_construccion',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.solicitante) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tipoLabel = TIPOS_TRAMITE.find(t => t.value === formData.tipoTramite)?.label || 'Trámite';

      // Simulando procesamiento asíncrono premium de 1.2 segundos
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Desplegamos el Toast de éxito y cambiamos estado
      showToast(`¡${tipoLabel} registrado exitosamente!`, 'success');
      setIsSuccess(true);
    } catch (err) {
      setError('Error al registrar la solicitud. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedTipo = TIPOS_TRAMITE.find(t => t.value === formData.tipoTramite);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-12">
        <div className="max-w-xl mx-auto w-full px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#051429] mb-2">Trámite Registrado</h2>
            <p className="text-gray-500 mb-8">Su solicitud ha sido recibida con éxito y se encuentra pendiente de pago para iniciar revisión.</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-[#051429] hover:bg-[#081F5C] text-[#E9D9AE] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(5,20,41,0.2)] hover:-translate-y-0.5"
              >
                <CreditCard className="w-5 h-5" />
                Pagar Ahora (RD$ 2,500.00)
              </button>
              <button
                onClick={() => {
                  addItem({ serviceName: selectedTipo?.label || 'Trámite', price: 2500, reference: 'TRM-' + Math.floor(Math.random() * 1000) });
                  router.push('/');
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 text-[#051429] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <ShoppingCart className="w-5 h-5 text-slate-400" />
                Agregar al Carrito
              </button>
              <button
                onClick={() => router.push('/')}
                className="mt-4 text-sm font-semibold text-slate-400 hover:text-[#051429] transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
          monto={2500} 
          concepto={selectedTipo?.label || 'Trámite'} 
          referenciaSolicitud={'TRM-' + Math.floor(Math.random() * 1000)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-12">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-navy mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#051429] rounded-xl flex items-center justify-center shadow-lg">
              {selectedTipo?.icon ? React.cloneElement(selectedTipo.icon as React.ReactElement, { className: 'w-6 h-6 text-[#E9D9AE]' }) : <Building2 className="w-6 h-6 text-[#E9D9AE]" />}
            </div>
            <div>
              <h1 className="text-3xl font-sans font-black tracking-tight text-[#051429]">
                Iniciar Nuevo Trámite
              </h1>
              <p className="text-gray-500 mt-1">
                {selectedTipo?.label || 'Seleccione un tipo de trámite'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">

              {/* Tipo de trámite selector */}
              <div>
                <label htmlFor="tipoTramite" className="block text-sm font-bold text-navy mb-2">
                  Tipo de Trámite
                </label>
                <select
                  id="tipoTramite"
                  name="tipoTramite"
                  value={formData.tipoTramite}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#B8902F] focus:border-transparent outline-none transition-all text-gray-800 bg-white appearance-none cursor-pointer"
                >
                  {TIPOS_TRAMITE.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título del Proyecto */}
              <div>
                <label htmlFor="titulo" className="block text-sm font-bold text-navy mb-2">
                  Título del Proyecto / Obra
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej. Torre Residencial Piantini"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#B8902F] focus:border-transparent outline-none transition-all text-gray-800"
                />
              </div>

              {/* Solicitante */}
              <div>
                <label htmlFor="solicitante" className="block text-sm font-bold text-navy mb-2">
                  Entidad Solicitante o Propietario
                </label>
                <input
                  type="text"
                  id="solicitante"
                  name="solicitante"
                  required
                  value={formData.solicitante}
                  onChange={handleChange}
                  placeholder="Ej. Constructora Alfa SRL"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#B8902F] focus:border-transparent outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Al enviar esta solicitud, acepta los términos institucionales del ADN.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#051429] hover:bg-[#0a2244] text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E9D9AE]" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>Registrar Solicitud</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}