'use client';

import React from 'react';
import { X, CheckCircle2, Download, Building2, Receipt } from 'lucide-react';

interface PagoHistorial {
  id: string;
  servicio: string;
  fecha: string;
  monto: number;
  ncf: string;
  estado: 'Aprobado';
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pago: PagoHistorial | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, pago }) => {
  if (!isOpen || !pago) return null;

  const fechaFormateada = new Date(pago.fecha + 'T12:00:00').toLocaleDateString('es-DO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#051429]/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md z-20"
      >
        <X size={24} />
      </button>

      {/* Receipt ticket */}
      <div className="w-full max-w-[420px] animate-in zoom-in-95 duration-300">

        {/* Top ticket half */}
        <div className="bg-white rounded-t-3xl pt-10 px-8 pb-6 relative shadow-lg">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#051429] rounded-xl flex items-center justify-center text-[#E9D9AE] shadow-md">
                <Building2 size={22} />
              </div>
              <div>
                <p className="font-black text-[#051429] text-lg leading-tight">Alcaldía DN</p>
                <p className="text-[11px] text-slate-400 font-semibold tracking-wide">COMPROBANTE DE PAGO</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">Aprobado</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">Referencia</span>
              <span className="font-bold text-slate-800 font-mono text-sm">{pago.id}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">Servicio</span>
              <span className="font-bold text-slate-800 text-sm text-right max-w-[220px]">{pago.servicio}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">Fecha</span>
              <span className="font-semibold text-slate-700 text-sm capitalize">{fechaFormateada}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">NCF</span>
              <span className="font-bold text-slate-800 font-mono text-sm">{pago.ncf}</span>
            </div>
          </div>
        </div>

        {/* Perforated line */}
        <div className="relative bg-white">
          <div className="flex items-center justify-between w-full relative h-0">
            <div className="absolute -left-4 w-8 h-8 bg-[#051429]/60 rounded-full" style={{ backdropFilter: 'blur(8px)' }}></div>
            <div className="w-full border-t-[2.5px] border-dashed border-slate-200 mx-5"></div>
            <div className="absolute -right-4 w-8 h-8 bg-[#051429]/60 rounded-full" style={{ backdropFilter: 'blur(8px)' }}></div>
          </div>
        </div>

        {/* Bottom ticket half */}
        <div className="bg-white rounded-b-3xl pt-8 pb-8 px-8 shadow-lg">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1.5">Total Pagado</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-[#B8902F]">RD$</span>
                <span className="text-[36px] font-black text-[#051429] tracking-tight">{pago.monto.toLocaleString('es-DO')}</span>
                <span className="text-xl font-bold text-[#051429]">.00</span>
              </div>
            </div>
            <Receipt size={32} className="text-slate-300 mb-2" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              Cerrar
            </button>
            <button
              className="flex-1 bg-[#051429] hover:bg-[#081F5C] text-[#E9D9AE] font-bold py-3.5 rounded-xl transition-all shadow-[0_6px_16px_rgba(5,20,41,0.25)] flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5"
            >
              <Download size={16} />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
