'use client';

import React, { useState } from 'react';
import { ArrowLeft, Building2, TreeDeciduous, Users, BarChart3, TrendingUp, Target, X, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Proyecto {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  indicators: { label: string; value: string; trend: string }[];
  impacto: string;
}

const PROYECTOS: Proyecto[] = [
  {
    id: 'planificacion',
    icon: <Building2 className="w-6 h-6" />,
    title: 'Planificación Urbana',
    subtitle: 'Reordenamiento territorial',
    description: 'Reordenamiento del territorio, recuperación de espacios públicos y desarrollo de infraestructuras sostenibles que priorizan al peatón y la movilidad activa.',
    color: 'text-[#051429]',
    bgColor: 'bg-[#051429]',
    indicators: [
      { label: 'Obras en ejecución', value: '47', trend: '+12% vs. 2025' },
      { label: 'Km de aceras reconstruidas', value: '28.5', trend: '+8.2 km' },
      { label: 'Espacios recuperados', value: '15', trend: '+5 este trimestre' },
    ],
    impacto: 'Se prevé que la inversión en infraestructura peatonal reduzca la congestión vehicular en un 18% en las zonas intervenidas, beneficiando a más de 120,000 residentes del polígono central del Distrito Nacional.',
  },
  {
    id: 'ambiental',
    icon: <TreeDeciduous className="w-6 h-6" />,
    title: 'Gestión Ambiental',
    subtitle: 'Ciudad verde y sostenible',
    description: 'Modernización del sistema de recolección, programas de reciclaje comunitario y educación ciudadana para una ciudad más limpia, verde y resiliente al cambio climático.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-600',
    indicators: [
      { label: 'Toneladas recicladas/mes', value: '2,340', trend: '+340 ton' },
      { label: 'Árboles plantados (2026)', value: '8,200', trend: 'Meta: 10,000' },
      { label: 'Puntos verdes activos', value: '32', trend: '+7 nuevos' },
    ],
    impacto: 'El programa de arborización ha incrementado la cobertura de sombra urbana en un 12%, reduciendo la temperatura superficial promedio en 2.1°C en las principales avenidas intervenidas.',
  },
  {
    id: 'social',
    icon: <Users className="w-6 h-6" />,
    title: 'Desarrollo Social',
    subtitle: 'Inclusión y bienestar',
    description: 'Programas de inclusión, apoyo a sectores vulnerables, fomento del deporte y la cultura en los barrios del Distrito Nacional con enfoque comunitario.',
    color: 'text-violet-700',
    bgColor: 'bg-violet-600',
    indicators: [
      { label: 'Familias beneficiadas', value: '14,500', trend: '+2,100 familias' },
      { label: 'Centros comunitarios activos', value: '23', trend: '+4 nuevos' },
      { label: 'Eventos culturales (2026)', value: '186', trend: '+45 vs. 2025' },
    ],
    impacto: 'Los programas de apoyo social han reducido la tasa de deserción escolar en los barrios intervenidos en un 22%, mientras que las actividades deportivas y culturales han incrementado la participación juvenil en un 35%.',
  },
  {
    id: 'transparencia',
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Transparencia y Datos Abiertos',
    subtitle: 'Gestión de puertas abiertas',
    description: 'Acceso total a la información sobre presupuestos, licitaciones, nómina y ejecución de obras públicas con rendición de cuentas permanente.',
    color: 'text-[#B8902F]',
    bgColor: 'bg-[#B8902F]',
    indicators: [
      { label: 'Datasets publicados', value: '142', trend: '+28 este año' },
      { label: 'Consultas ciudadanas respondidas', value: '3,890', trend: '98.2% resueltas' },
      { label: 'Ejecución presupuestaria', value: '87.4%', trend: 'Objetivo: 95%' },
    ],
    impacto: 'La plataforma de datos abiertos ha registrado más de 45,000 consultas ciudadanas desde su lanzamiento, posicionando al ADN como la municipalidad más transparente del país según el índice IDOPPRIL 2026.',
  },
];

export default function ProyectosPage() {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429] mb-3">
            Ejes Estratégicos de Gestión
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl">
            Nuestro plan de trabajo se estructura en pilares fundamentales diseñados para transformar la ciudad, 
            mejorando la calidad de vida de todos los capitaleños mediante acciones concretas y sostenibles.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {PROYECTOS.map(proyecto => (
            <div
              key={proyecto.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className={`${proyecto.bgColor} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                  {proyecto.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{proyecto.title}</h3>
                  <p className="text-white/70 text-sm">{proyecto.subtitle}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {proyecto.description}
                </p>

                {/* Quick Indicators */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {proyecto.indicators.map((ind, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-[#051429]">{ind.value}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{ind.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProyecto(proyecto)}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-[#051429] text-slate-600 hover:text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 group-hover:bg-[#051429] group-hover:text-white"
                >
                  Ver indicadores completos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedProyecto && (
        <div className="fixed inset-0 bg-[#051429]/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setSelectedProyecto(null)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`${selectedProyecto.bgColor} p-8 relative`}>
              <button onClick={() => setSelectedProyecto(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                  {selectedProyecto.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedProyecto.title}</h2>
                  <p className="text-white/70 text-sm">{selectedProyecto.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <p className="text-gray-600 mb-8 leading-relaxed">{selectedProyecto.description}</p>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Indicadores Clave de Rendimiento</h4>
              <div className="space-y-4 mb-8">
                {selectedProyecto.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-[#051429]">{ind.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> {ind.trend}
                      </p>
                    </div>
                    <span className="text-2xl font-black text-[#051429]">{ind.value}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Análisis de Impacto</h4>
              <div className="p-4 bg-[#051429]/5 rounded-xl border border-[#051429]/10">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[#B8902F] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProyecto.impacto}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProyecto(null)}
                className="w-full mt-8 py-3.5 bg-[#051429] text-white rounded-xl font-bold text-sm hover:bg-[#051429]/90 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E9D9AE]" />
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
