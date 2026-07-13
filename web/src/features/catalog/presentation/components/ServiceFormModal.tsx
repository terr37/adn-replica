'use client';

import React, { useState } from 'react';
import { X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../../../core/presentation/CartContext';
import { TaxEntity } from '../../domain/TaxEntity';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: TaxEntity | null;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, service }) => {
  const { addItem, setIsCartOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    proyecto: '',
    solicitante: '',
    documento: '',
  });

  if (!isOpen || !service) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      
      const reference = `TRM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Add to cart with reference
      addItem({
        serviceName: service.title,
        price: service.price,
        reference: reference,
      });

      // Reset form and close
      setFormData({
        proyecto: '',
        solicitante: '',
        documento: '',
      });
      onClose();
      setIsCartOpen(true);
      
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#051429]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#051429] rounded-xl flex items-center justify-center text-[#E9D9AE] shadow-sm">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">Completar Solicitud</h3>
              <p className="text-xs text-slate-500">{service.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="proyecto" className="block text-sm font-bold text-slate-700 mb-1.5">
                Nombre del Proyecto / Obra / Negocio
              </label>
              <input
                type="text"
                id="proyecto"
                name="proyecto"
                required
                value={formData.proyecto}
                onChange={handleChange}
                placeholder="Ej. Construcción Torre Norte"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B8902F]/40 focus:border-[#B8902F] outline-none transition-all text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="solicitante" className="block text-sm font-bold text-slate-700 mb-1.5">
                Nombre del Solicitante / Propietario
              </label>
              <input
                type="text"
                id="solicitante"
                name="solicitante"
                required
                value={formData.solicitante}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B8902F]/40 focus:border-[#B8902F] outline-none transition-all text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="documento" className="block text-sm font-bold text-slate-700 mb-1.5">
                Documento de Identidad (Cédula o RNC)
              </label>
              <input
                type="text"
                id="documento"
                name="documento"
                required
                value={formData.documento}
                onChange={handleChange}
                placeholder="Ej. 001-XXXXXXX-X"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B8902F]/40 focus:border-[#B8902F] outline-none transition-all text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#051429] hover:bg-[#081F5C] text-[#E9D9AE] font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(5,20,41,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#E9D9AE]" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmar y Agregar al Carrito
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
