'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Grid, CheckCircle2, Lock, Edit3, Landmark, Loader2, Wifi, Contact, Receipt, Building2, CheckCircle } from 'lucide-react';

export default function PagoTasaMunicipal() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('2412 - 7512 - 3412 - 3456');
  const [cvv, setCvv] = useState('327');
  const [expiryMonth, setExpiryMonth] = useState('09');
  const [expiryYear, setExpiryYear] = useState('22');
  const [password, setPassword] = useState('••••••••');
  const [cardHolder, setCardHolder] = useState('Jonathan Michael');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ncf, setNcf] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');

  // Formatear el número de tarjeta con guiones/espacios
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' - ';
      }
      formattedValue += value[i];
    }
    setCardNumber(formattedValue);
  };

  const getLast4Digits = () => {
    const digitsOnly = cardNumber.replace(/[^0-9]/g, '');
    return digitsOnly.length >= 4 ? digitsOnly.slice(-4) : '3456';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular llamada a pasarela de pagos
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Generar NCF Mock (ej: B0100000012)
      setNcf(`B010000${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`);

      // Redirigir al dashboard después de mostrar el éxito
      setTimeout(() => {
        router.push('/');
      }, 3500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500 border border-slate-100">
          <div className="mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Pago Autorizado</h2>
          <p className="text-slate-500">Su transacción se ha procesado con éxito.</p>
          <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-sm font-medium">Comprobante (NCF)</span>
              <span className="font-bold text-slate-800">{ncf}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-sm font-medium">Referencia</span>
              <span className="font-bold text-slate-800">1266201</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 border-dashed">
              <span className="text-slate-600 font-semibold">Total Pagado</span>
              <span className="font-black text-xl text-blue-600">RD$ 17,110.00</span>
            </div>
          </div>
          <div className="flex justify-center pt-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirigiendo al inicio...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Decorative background blur for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-[1100px] w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 backdrop-blur-xl bg-white/95">

        {/* Left Column: Payment Form */}
        <div className="w-full md:w-[60%] p-8 md:p-12 lg:p-16">

          {/* Header */}
          <div className="flex justify-between items-center mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Landmark size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">DistritoPay</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="bg-[#051429] text-white w-9 h-12 rounded-md flex items-center justify-center font-bold text-lg shadow-sm">{hours[0]}</div>
              <div className="bg-[#051429] text-white w-9 h-12 rounded-md flex items-center justify-center font-bold text-lg shadow-sm">{hours[1]}</div>
              <div className="flex items-center justify-center font-bold text-xl px-1 text-slate-700 pb-1">:</div>
              <div className="bg-[#051429] text-white w-9 h-12 rounded-md flex items-center justify-center font-bold text-lg shadow-sm">{minutes[0]}</div>
              <div className="bg-[#051429] text-white w-9 h-12 rounded-md flex items-center justify-center font-bold text-lg shadow-sm">{minutes[1]}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card Number */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-[17px]">Número de Tarjeta</h3>
                  <p className="text-slate-400 text-sm font-medium mt-0.5">Ingrese los 16 dígitos de su tarjeta</p>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                  <Edit3 size={16} strokeWidth={2.5} />
                  <span>Editar</span>
                </button>
              </div>
              <div className="relative flex items-center bg-[#f8fafc] border border-slate-200/80 rounded-xl px-5 h-[72px] transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 shadow-sm">
                <div className="w-10 h-6 flex items-center justify-center mr-4">
                  {/* Mastercard Logo Mock */}
                  <div className="relative flex w-9 h-5">
                    <div className="absolute left-0 w-[22px] h-[22px] bg-[#eb001b] rounded-full mix-blend-multiply opacity-90"></div>
                    <div className="absolute right-0 w-[22px] h-[22px] bg-[#f79e1b] rounded-full mix-blend-multiply opacity-90"></div>
                  </div>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={25}
                  className="bg-transparent w-full outline-none text-slate-700 font-semibold text-[17px] tracking-wider placeholder-slate-300"
                  placeholder="2412 - 7512 - 3412 - 3456"
                />
                <CheckCircle2 className="text-[#0ea5e9] ml-3" size={26} strokeWidth={2.5} fill="#e0f2fe" />
              </div>
            </div>

            {/* CVV & Expiry (Responsive layout might stack them, but we follow the image structure where possible. The image has them as separate rows, let's keep separate rows as image shows) */}

            {/* CVV */}
            <div>
              <div className="mb-3">
                <h3 className="font-bold text-slate-800 text-[17px]">Código CVV</h3>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Ingrese los 3 o 4 dígitos de seguridad</p>
              </div>
              <div className="relative flex items-center w-full md:w-1/2 bg-white border border-slate-200/80 rounded-xl px-5 h-[72px] transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 shadow-sm">
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={4}
                  className="bg-transparent w-full outline-none text-slate-800 font-bold text-center text-xl tracking-widest placeholder-slate-300"
                  placeholder="327"
                />
                <Grid className="text-slate-300 absolute right-5" size={24} />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <div className="mb-3">
                <h3 className="font-bold text-slate-800 text-[17px]">Fecha de Expiración</h3>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Ingrese la fecha de expiración de la tarjeta</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center w-[110px] bg-white border border-slate-200/80 rounded-xl px-3 h-[72px] transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 shadow-sm">
                  <input
                    type="text"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={2}
                    className="bg-transparent w-full outline-none text-slate-800 font-bold text-center text-xl placeholder-slate-300"
                    placeholder="09"
                  />
                </div>
                <span className="text-slate-400 font-bold text-2xl">/</span>
                <div className="relative flex items-center w-[110px] bg-[#eff6ff] border-2 border-blue-500 rounded-xl px-3 h-[72px] transition-all shadow-sm shadow-blue-100">
                  <input
                    type="text"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={2}
                    className="bg-transparent w-full outline-none text-blue-700 font-bold text-center text-xl placeholder-blue-300"
                    placeholder="22"
                  />
                </div>
              </div>
            </div>

            {/* Card Holder */}
            <div>
              <div className="mb-2.5">
                <h3 className="font-bold text-slate-800 text-[17px]">Nombre del Titular</h3>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Ingrese el nombre del titular</p>
              </div>
              <div className="relative flex items-center w-full md:w-[48%] bg-[#f8fafc] border border-slate-200/80 rounded-xl px-5 h-[64px] transition-all focus-within:ring-2 focus-within:ring-[#B8902F]/40 focus-within:border-[#B8902F] shadow-sm">
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="bg-transparent w-full outline-none text-slate-800 font-bold text-[17px] uppercase tracking-wide placeholder-slate-300"
                  placeholder="JONATHAN MICHAEL"
                />
                <Grid className="text-slate-300 absolute right-5" size={24} />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-[17px] h-[72px] rounded-xl transition-all shadow-[0_8px_20px_rgb(13,110,253,0.3)] hover:shadow-[0_12px_25px_rgb(13,110,253,0.4)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Procesando Pago...</span>
                  </>
                ) : (
                  'Pagar Tasa Municipal'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Receipt Panel */}
        <div className="w-full md:w-[40%] bg-[#f4f7fa] p-8 md:p-12 relative flex flex-col justify-end pt-48 md:pt-16 items-center">

          {/* Central Line for aesthetic (optional, sometimes behind ticket) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-200/50 -translate-x-1/2 pointer-events-none"></div>

          {/* The main receipt ticket background */}
          <div className="w-full max-w-[340px] bg-[#eef2f6] rounded-t-3xl pt-36 pb-8 px-8 relative mt-16 md:mt-24 shadow-sm">

            {/* Hanging Card Element */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[115%] max-w-[320px] aspect-[1.58/1] bg-white rounded-[1.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-7 flex flex-col justify-between z-20 overflow-hidden group border border-slate-100">

              {/* Texture/Noise overlay for premium feel */}
              <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              {/* Card Notch/Clip (The blue holding clip) */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#0d6efd] rounded-b-md shadow-sm"></div>

              <div className="flex justify-between items-start relative z-10">
                {/* Chip SVG */}
                <svg width="42" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="32" rx="6" fill="#f4f4f5" />
                  <path d="M12 0V32M28 0V32M0 16H40M12 8H0M12 24H0M40 8H28M40 24H28" stroke="#d4d4d8" strokeWidth="1.5" />
                  <rect x="15" y="10" width="10" height="12" rx="2" fill="#e4e4e7" />
                </svg>
                <Wifi className="text-slate-700" size={26} strokeWidth={2} />
              </div>

              <div className="mt-6 space-y-5 relative z-10">
                <div>
                  <p className="text-slate-500 text-[13px] font-medium mb-1.5">{cardHolder || 'Nombre del Titular'}</p>
                  <div className="flex items-center gap-3 text-slate-800 text-xl font-bold tracking-widest">
                    <span className="tracking-[0.2em] text-slate-800/80">••••</span>
                    <span className="text-slate-800">{getLast4Digits()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-slate-800 font-bold text-[15px]">{expiryMonth || '09'}/{expiryYear || '22'}</p>
                  {/* Mastercard Logo Mock */}
                  <div className="relative flex w-10 h-6">
                    <div className="absolute left-0 w-[24px] h-[24px] bg-[#eb001b] rounded-full mix-blend-multiply opacity-95"></div>
                    <div className="absolute right-0 w-[24px] h-[24px] bg-[#f79e1b] rounded-full mix-blend-multiply opacity-95"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-4 px-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[15px]">Institución</span>
                <span className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
                  <Building2 size={16} className="text-slate-600" /> Alcaldía D.N.
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[15px]">No. Solicitud</span>
                <span className="font-bold text-slate-800 text-[15px]">1266201</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[15px]">Concepto</span>
                <span className="font-bold text-slate-800 text-right w-40 truncate text-[15px]" title="Tasa Licencia Construcción">
                  Tasa Lic. Construcción
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[15px]">Moneda</span>
                <span className="font-bold text-slate-800 text-[15px]">RD$ (Pesos)</span>
              </div>
            </div>
          </div>

          {/* Ticket bottom half (perforated separation) */}
          <div className="w-full max-w-[340px] bg-[#eef2f6] rounded-b-3xl pb-10 px-8 relative shadow-sm">
            {/* Dashed line and holes */}
            <div className="flex items-center justify-between w-full relative h-8 -mt-4">
              {/* Left hole */}
              <div className="absolute -left-12 w-8 h-8 bg-[#f4f7fa] rounded-full shadow-inner"></div>
              {/* Dashed line */}
              <div className="w-full border-t-[2.5px] border-dashed border-slate-300/80 mx-1"></div>
              {/* Right hole */}
              <div className="absolute -right-12 w-8 h-8 bg-[#f4f7fa] rounded-full shadow-inner"></div>
            </div>

            <div className="flex justify-between items-end mt-8 px-1">
              <div>
                <p className="text-slate-500 text-sm mb-1.5 font-medium">Total a Pagar</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[34px] font-black text-slate-800 tracking-tight">14,500</span>
                  <span className="text-xl font-bold text-slate-800">.00</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">RD$</span>
                </div>
              </div>
              <Receipt size={32} className="text-slate-800 mb-2" strokeWidth={1.5} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
