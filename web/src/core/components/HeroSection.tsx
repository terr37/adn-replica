import React, { useState } from 'react';
import { ArrowRight, X, Clock } from 'lucide-react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  const [showHours, setShowHours] = useState(false);
  return (
    /* 
      Cambiamos a h-[calc(100vh-80px)] para que ocupe EXACTAMENTE el alto restante 
      de la pantalla debajo de tu navbar (asumiendo un navbar estándar de ~80px).
      Agregamos min-h-[600px] para que no se colapse en pantallas muy bajas.
    */
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[100vh] bg-[#051429] flex items-center overflow-hidden">

      {/* Image Layer - Absolute and covering 100% of the viewport width/height */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Ayuntamiento_DN_RD.jpg"
          alt="Palacio Consistorial - Ayuntamiento del Distrito Nacional"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Asymmetrical Gradient Overlay (The Shield) */}
      {/* Suave degradado vertical en móviles y un barrido profundo de izquierda a derecha en pantallas grandes */}
      <div className="z-10 absolute inset-0 bg-gradient-to-b from-[#051429]/95 via-[#051429]/80 to-transparent lg:bg-gradient-to-r lg:from-[#051429] lg:via-[#051429]/90 lg:to-transparent" />

      {/* Content Layer - Constrained globally but floating over the full-bleed background */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-16 flex items-center h-full">
        <div className="w-full lg:w-1/2 flex flex-col justify-center">

          {/* Eyebrow Institucional */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-0.5 bg-[#B8902F]"></div>
            <span className="text-xs font-bold text-[#E9D9AE] tracking-widest uppercase">
              Portal Ciudadano
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight text-white mb-6 leading-[1.15]">
            Servicios digitales de su ciudad, <span className="text-[#E9D9AE]">simplificados.</span>
          </h1>

          {/* Subtexto descriptivo */}
          <p className="text-gray-300 text-base md:text-lg mb-10 max-w-md leading-relaxed">
            Gestione trámites, consulte pagos y reporte incidencias con una experiencia diseñada para la claridad y la eficiencia institucional.
          </p>

          {/* Acciones principales */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Botón Principal: "Explorar Servicios" con Efecto Glow Estilo Fintech */}
            <Link href="/servicios" className="group bg-[#B8902F] hover:bg-[#CBA23E] text-[#051429] px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[#B8902F]/20 transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(184,144,47,0.55)]">
              Explorar Servicios
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>

            {/* Botón Secundario: "Horarios de Atención" */}
            <button 
              onClick={() => setShowHours(!showHours)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all active:scale-[0.98] backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Horarios de Atención
            </button>

          </div>

        </div>
      </div>

      {/* Hours Modal */}
      {showHours && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in scale-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#051429]">Horarios de Atención</h3>
                <p className="text-sm text-slate-500 mt-1">Palacio Municipal</p>
              </div>
              <button 
                onClick={() => setShowHours(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-[#051429]/5 rounded-lg">
                <span className="font-semibold text-[#051429]">Lunes - Viernes</span>
                <span className="text-[#B8902F] font-bold">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                <span className="font-semibold text-slate-600">Sábado</span>
                <span className="text-slate-500">Cerrado</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                <span className="font-semibold text-slate-600">Domingo</span>
                <span className="text-slate-500">Cerrado</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 p-4 bg-yellow-50/50 rounded-lg border border-[#B8902F]/20">
              Para acceder a nuestros servicios, diríjase presencialmente a nuestras ventanillas durante los horarios indicados. Llevar la documentación requerida.
            </p>

            <button 
              onClick={() => setShowHours(false)}
              className="w-full bg-[#B8902F] hover:bg-[#CBA23E] text-[#051429] px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};