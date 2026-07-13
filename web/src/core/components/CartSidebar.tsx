'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../presentation/CartContext';
import { PaymentModal } from '../../features/payments/presentation/components/PaymentModal';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export const CartSidebar: React.FC = () => {
  const { items, removeItem, clearCart, getTotal, isCartOpen, setIsCartOpen } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const total = getTotal();

  // Escuchar evento de pago exitoso para vaciar el carrito
  useEffect(() => {
    const handlePagoExitoso = () => {
      clearCart();
      setIsPaymentOpen(false);
      setIsCartOpen(false);
    };
    window.addEventListener('pago_realizado', handlePagoExitoso);
    return () => window.removeEventListener('pago_realizado', handlePagoExitoso);
  }, [clearCart, setIsCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn("fixed inset-0 bg-[#051429]/40 backdrop-blur-sm z-[100] transition-opacity duration-300", isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar Panel */}
      <div className={cn("fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-100", isCartOpen ? "translate-x-0" : "translate-x-full")}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#051429] rounded-xl flex items-center justify-center text-[#B8902F] shadow-sm">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#051429]">Su Solicitud</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-400">
              <ShoppingBag size={48} className="opacity-20 mb-2" />
              <p className="font-medium text-slate-500">No hay servicios en su carrito.</p>
              <p className="text-sm">Agregue trámites desde el catálogo o tabla de solicitudes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-start p-4 bg-white border border-slate-200 rounded-2xl group shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-[15px] mb-1 leading-tight">{item.serviceName}</h4>
                    <p className="text-xs text-slate-400 font-mono mb-3">Ref: {item.reference}</p>
                    <p className="font-black text-[#051429]">RD$ {item.price.toLocaleString('es-DO')}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-slate-500 font-medium mb-1">Total a Pagar</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-[#B8902F] mr-0.5">RD$</span>
                <span className="text-[28px] font-black text-[#051429] tracking-tight">{total.toLocaleString('es-DO')}</span>
                <span className="text-lg font-bold text-[#051429]">.00</span>
              </div>
            </div>
            <button 
              onClick={() => setIsPaymentOpen(true)}
              className="w-full bg-[#051429] hover:bg-[#081F5C] text-[#E9D9AE] font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(5,20,41,0.3)] hover:shadow-[0_12px_25px_rgba(5,20,41,0.4)] flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5"
            >
              Procesar Pago
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        monto={total}
        concepto={`Pago Conjunto (${items.length} ${items.length === 1 ? 'servicio' : 'servicios'})`}
        referenciaSolicitud={`CART-${Math.floor(Math.random()*100000)}`}
      />
    </>
  );
};
