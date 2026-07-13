'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, ArrowRight, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../../../../core/presentation/CartContext';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { cn } from '../../../../core/utils';
import { usePermisosUrbano } from '../../../urbanismo/presentation/hooks/usePermisosUrbano';
import { PermisoEstado } from '../../../urbanismo/domain/PermisoConstruccionEntity';

interface PagoHistorial {
  id: string;
  servicio: string;
  fecha: string;
  monto: number;
  ncf: string;
  estado: 'Aprobado';
}

const MOCK_HISTORIAL: PagoHistorial[] = [
  { id: 'PAG-001', servicio: 'Permiso de Construcción', fecha: '2026-05-28', monto: 2500, ncf: 'B0100000142', estado: 'Aprobado' },
  { id: 'PAG-002', servicio: 'Recolección Especial', fecha: '2026-05-15', monto: 800, ncf: 'B0100000138', estado: 'Aprobado' },
  { id: 'PAG-003', servicio: 'Registro Comercial', fecha: '2026-04-22', monto: 5000, ncf: 'B0100000125', estado: 'Aprobado' },
  { id: 'PAG-004', servicio: 'Uso de Espacio Público', fecha: '2026-04-10', monto: 1200, ncf: 'B0100000119', estado: 'Aprobado' },
  { id: 'PAG-005', servicio: 'Publicidad Exterior', fecha: '2026-03-18', monto: 3000, ncf: 'B0100000108', estado: 'Aprobado' },
];

export const PaymentTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tramites' | 'historial'>('tramites');
  const { solicitudes, isLoading } = usePermisosUrbano();
  const { addItem } = useCart();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({ monto: 0, concepto: '', referenciaSolicitud: '' });
  
  const [selectedPago, setSelectedPago] = useState<PagoHistorial | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  const [historialPagos, setHistorialPagos] = useState<PagoHistorial[]>(MOCK_HISTORIAL);

  useEffect(() => {
    if (activeTab === 'historial') {
      const cargarHistorial = () => {
        try {
          const stored = localStorage.getItem('historial_pagos_mock');
          if (stored) {
            const parsedPagos = JSON.parse(stored) as PagoHistorial[];
            // Fusionamos los pagos nuevos del modal con los mockeados iniciales
            setHistorialPagos([...parsedPagos, ...MOCK_HISTORIAL]);
          } else {
            setHistorialPagos(MOCK_HISTORIAL);
          }
        } catch (error) {
          console.error('Error parseando historial de pagos:', error);
          setHistorialPagos(MOCK_HISTORIAL);
        }
      };

      cargarHistorial();

      // Escuchar evento personalizado del PaymentModal para refrescar en tiempo real
      window.addEventListener('pago_realizado', cargarHistorial);
      return () => window.removeEventListener('pago_realizado', cargarHistorial);
    }
  }, [activeTab]);

  // Refinamiento de insignias (Estados institucionales limpios con micro-bordes)
  const getStatusColor = (status: PermisoEstado) => {
    switch (status) {
      case 'EN_REVISION':
        return 'bg-amber-50 text-amber-800 border border-amber-200/60';
      case 'PENDIENTE_PAGO':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'RECHAZADO':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60 font-bold animate-pulse';
      case 'COMPLETADO':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'CREADO':
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  // Íconos vitaminados con colores de la marca ADN
  const getIcon = () => {
    // For now we assume all urbanismo permits are documents
    return <FileText className="w-5 h-5 text-[#051429]" />;
  };

  // Sincronización del color de la barra de progreso con el estado real
  const getProgressColor = (status: PermisoEstado) => {
    switch (status) {
      case 'EN_REVISION':
        return 'bg-gradient-to-r from-[#B8902F]/60 to-[#B8902F]';
      case 'PENDIENTE_PAGO':
        return 'bg-[#051429]/40';
      case 'RECHAZADO':
        return 'bg-rose-500';
      case 'COMPLETADO':
        return 'bg-emerald-500';
      case 'CREADO':
      default:
        return 'bg-slate-300';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_12px_40px_rgba(5,20,41,0.02)] p-6 md:p-8">

      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-sans font-black tracking-tight text-[#051429]">
            Actividad Reciente
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Monitoreo en tiempo real de sus solicitudes del Distrito Nacional.
          </p>
        </div>

        {/* Selector de pestañas premium (Estilo cápsula unificada) */}
        <div className="bg-slate-100/80 p-1 rounded-xl flex items-center self-start sm:self-auto">
          <button
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200",
              activeTab === 'tramites'
                ? "bg-white text-[#051429] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
            onClick={() => setActiveTab('tramites')}
          >
            Trámites en Curso
          </button>
          <button
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200",
              activeTab === 'historial'
                ? "bg-white text-[#051429] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
            onClick={() => setActiveTab('historial')}
          >
            Historial de Pagos
          </button>
        </div>
      </div>

      {/* ===== TAB: TRÁMITES EN CURSO ===== */}
      {activeTab === 'tramites' && (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[768px]">

            {/* Encabezados de la Tabla */}
            <div className="grid grid-cols-12 gap-4 pb-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4">
              <div className="col-span-5">Referencia / Trámite</div>
              <div className="col-span-3">Fecha Ingreso</div>
              <div className="col-span-2">Progreso</div>
              <div className="col-span-2 text-right">Estado</div>
            </div>

            {/* Cuerpo de la Tabla */}
            <div className="divide-y divide-slate-100/70 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                  <span className="text-sm text-slate-500">Cargando trámites...</span>
                </div>
              )}
              {solicitudes?.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="grid grid-cols-12 gap-4 py-4 items-center px-4 rounded-xl transition-all duration-200 hover:bg-slate-50/70 group cursor-pointer"
                >
                  {/* Info Principal */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shadow-sm",
                      "bg-slate-50 border border-slate-100"
                    )}>
                      {getIcon()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#051429] text-sm group-hover:text-[#B8902F] transition-colors">
                        {solicitud.titulo}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 font-medium">
                        Sol: {solicitud.solicitante}
                      </p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="col-span-3 text-sm font-medium text-slate-500">
                    {solicitud.fecha}
                  </div>

                  {/* Barra de Progreso Minimalista */}
                  <div className="col-span-2 flex flex-col gap-1.5 justify-center">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[120px] overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500 ease-out", getProgressColor(solicitud.status))}
                        style={{ width: `${solicitud.progreso}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-400">
                      {solicitud.progreso}%
                    </span>
                  </div>

                  {/* Estado / Acciones */}
                  <div className="col-span-2 flex justify-end">
                    {solicitud.status === 'PENDIENTE_PAGO' ? (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem({ serviceName: solicitud.titulo, price: 1500, reference: solicitud.id });
                          }}
                          className="p-2 text-slate-400 hover:text-[#B8902F] hover:bg-[#B8902F]/10 rounded-lg transition-colors border border-transparent hover:border-[#B8902F]/20"
                          title="Agregar al carrito"
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentData({ monto: 1500, concepto: solicitud.titulo, referenciaSolicitud: solicitud.id });
                            setIsPaymentModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#051429] hover:bg-[#081F5C] text-[#E9D9AE] text-[11px] font-bold rounded-lg transition-all shadow-sm"
                        >
                          <CreditCard size={14} /> Pagar
                        </button>
                      </div>
                    ) : (
                      <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-2xs", getStatusColor(solicitud.status))}>
                        {solicitud.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ===== TAB: HISTORIAL DE PAGOS ===== */}
      {activeTab === 'historial' && (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[768px]">

            {/* Encabezados de la Tabla de Historial */}
            <div className="grid grid-cols-12 gap-4 pb-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4">
              <div className="col-span-4">Servicio Pagado</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">Monto (RD$)</div>
              <div className="col-span-2">NCF (Comprobante)</div>
              <div className="col-span-2 text-right">Estado</div>
            </div>

            {/* Cuerpo de la Tabla de Historial */}
            <div className="divide-y divide-slate-100/70">
              {historialPagos.map((pago) => (
                <div
                  key={pago.id}
                  onClick={() => { setSelectedPago(pago); setIsReceiptOpen(true); }}
                  className="grid grid-cols-12 gap-4 py-4 items-center px-4 rounded-xl transition-all duration-200 hover:bg-slate-50/70 group cursor-pointer"
                >
                  {/* Servicio */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#051429] text-sm group-hover:text-[#B8902F] transition-colors">
                        {pago.servicio}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 font-medium">
                        Ref: {pago.id}
                      </p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="col-span-2 text-sm font-medium text-slate-500">
                    {pago.fecha}
                  </div>

                  {/* Monto */}
                  <div className="col-span-2">
                    <span className="text-sm font-black font-mono text-[#051429]">
                      RD$ {pago.monto.toLocaleString('es-DO')}
                    </span>
                  </div>

                  {/* NCF */}
                  <div className="col-span-2">
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                      {pago.ncf}
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="col-span-2 flex justify-end">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-2xs bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {pago.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Botón de Cierre de Sección */}
      <div className="mt-4 flex justify-center border-t border-slate-100 pt-6">
        <button className="group text-xs font-bold text-[#051429] hover:text-[#B8902F] flex items-center gap-2 bg-slate-50 hover:bg-[#051429]/5 px-5 py-2.5 rounded-xl transition-all duration-300">
          Ver todas las solicitudes
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        monto={paymentData.monto}
        concepto={paymentData.concepto}
        referenciaSolicitud={paymentData.referenciaSolicitud}
      />
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => { setIsReceiptOpen(false); setSelectedPago(null); }}
        pago={selectedPago}
      />
    </div>
  );
};