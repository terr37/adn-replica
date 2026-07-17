'use client';

import React, { useState } from 'react';
import { ArrowLeft, Building2, TreeDeciduous, Users, LayoutDashboard, Target, X, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Componente utilitario interno para renderizar iconos de manera segura sin JSX serializado
const IconMapper = ({ name }: { name: string }) => {
  const iconProps = { className: "w-6 h-6" };
  switch (name) {
    case 'building':
      return <Building2 {...iconProps} />;
    case 'tree':
      return <TreeDeciduous {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    default:
      return <Building2 {...iconProps} />;
  }
};

interface Indicator {
  id: string;
  label: string;
  value: string;
  trend: string;
}

interface Proyecto {
  id: string;
  iconName: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  indicators: Indicator[];
  impacto: string;
}

const PROYECTOS: Proyecto[] = [
  {
    id: 'planificacion',
    iconName: 'building',
    title: 'Ordenamiento y Planificación Urbana',
    subtitle: 'Plan de Ordenamiento Territorial (POT)',
    description: 'Regulación del uso de suelo, recuperación del espacio público e inversión en infraestructura vial sostenible. Diseñado para priorizar la accesibilidad universal, la movilidad activa y el rescate de las áreas peatonales del Distrito Nacional.',
    color: 'text-[#B8902F]',
    bgColor: 'bg-[#051429]',
    indicators: [
      { id: 'ind-pot-reg', label: 'Marco Regulatorio', value: 'POT-2030', trend: 'Alineado a la Estrategia Nacional' },
      { id: 'ind-pot-alc', label: 'Alcance Territorial', value: '3 Regiones', trend: 'Distrito Norte, Centro y Sur' },
      { id: 'ind-pot-enf', label: 'Enfoque Principal', value: '100%', trend: 'Accesibilidad y movilidad peatonal' },
    ],
    impacto: 'Establece directrices técnicas rigurosas para el crecimiento vertical organizado y la descentralización comercial, asegurando que las futuras infraestructuras mitiguen el impacto ambiental y optimicen el flujo vehicular.',
  },
  {
    id: 'ambiental',
    iconName: 'tree',
    title: 'Gestión Ambiental y Resiliencia',
    subtitle: 'Ciudad Verde y Sostenible',
    description: 'Modernización integral del sistema de manejo de residuos sólidos, normativas de mitigación frente al cambio climático y desarrollo del arbolado urbano para reducir los efectos de las islas de calor en las principales avenidas.',
    color: 'text-[#B8902F]',
    bgColor: 'bg-[#051429]',
    indicators: [
      { id: 'ind-amb-est', label: 'Estrategia Central', value: 'Basura Cero', trend: 'Clasificación y reciclaje comunitario' },
      { id: 'ind-amb-pro', label: 'Protección Forestal', value: 'Arborización', trend: 'Introducción de especies nativas' },
      { id: 'ind-amb-sup', label: 'Supervisión', value: 'Mensual', trend: 'Monitoreo de calidad ambiental' },
    ],
    impacto: 'Garantiza un marco normativo estricto para los sectores comerciales e industriales del Distrito, promoviendo la transición hacia energías limpias y penalizando de forma efectiva la disposición inadecuada de desechos.',
  },
  {
    id: 'social',
    iconName: 'users',
    title: 'Desarrollo Social y Comunitario',
    subtitle: 'Inclusión y Bienestar Ciudadano',
    description: 'Fortalecimiento del tejido social a través de la adecuación de centros comunitarios, fomento de actividades culturales y el mantenimiento preventivo de parques recreativos municipales con un enfoque de seguridad y cohesión vecinal.',
    color: 'text-[#B8902F]',
    bgColor: 'bg-[#051429]',
    indicators: [
      { id: 'ind-soc-foc', label: 'Foco Operativo', value: 'Barrios', trend: 'Intervención integral comunitaria' },
      { id: 'ind-soc-inf', label: 'Infraestructura', value: 'Parques', trend: 'Mantenimiento y espacios seguros' },
      { id: 'ind-soc-par', label: 'Participación', value: 'PPM', trend: 'Presupuesto Participativo Municipal' },
    ],
    impacto: 'Permite que las comunidades prioricen democráticamente las obras de menor escala a través del Presupuesto Participativo, asegurando que la inversión municipal responda directamente a las necesidades reales de los sectores vulnerables.',
  },
  {
    id: 'modernizacion',
    iconName: 'dashboard',
    title: 'Modernización e Innovación Tecnológica',
    subtitle: 'Eficiencia Administrativa Digital',
    description: 'Digitalización y optimización de los servicios internos de la administración pública local. Centrado en automatizar la gestión de trámites ciudadanos, el control interno de operaciones y el reporte inmediato de incidencias urbanas.',
    color: 'text-[#B8902F]',
    bgColor: 'bg-[#051429]',
    indicators: [
      { id: 'ind-mod-arq', label: 'Arquitectura', value: 'Modular', trend: 'Desacoplamiento e interoperabilidad' },
      { id: 'ind-mod-can', label: 'Canal Principal', value: 'Digital', trend: 'Trámites en línea y reportes web' },
      { id: 'ind-mod-dis', label: 'Disponibilidad', value: '24/7', trend: 'Sistemas de autogestión ciudadana' },
    ],
    impacto: 'Elimina la burocracia física mediante procesos transparentes, permitiendo una fiscalización interna óptima de los tiempos de respuesta institucional ante los reportes de averías o solicitudes de los ciudadanos.',
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
            Pilares fundamentales del Plan Estratégico Municipal, orientados a la transformación estructural del Distrito Nacional mediante políticas sostenibles y medibles a largo plazo.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {PROYECTOS.map(proyecto => (
            <div
              key={proyecto.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className={`${proyecto.bgColor} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                  <IconMapper name={proyecto.iconName} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{proyecto.title}</h3>
                  <p className="text-white/70 text-sm">{proyecto.subtitle}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {proyecto.description}
                </p>

                {/* Quick Indicators */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {proyecto.indicators.map((ind) => (
                    <div key={ind.id} className="bg-slate-50 rounded-xl p-3 text-center flex flex-col justify-center items-center">
                      <p className="text-md font-black text-[#051429] tracking-tight">{ind.value}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tight text-center">{ind.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() => setSelectedProyecto(proyecto)}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-[#051429] text-slate-600 hover:text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 group-hover:bg-[#051429] group-hover:text-white mb-4"
                  >
                    Ver enfoque estratégico
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-slate-400 text-center font-medium">
                      Datos correspondientes al cierre del trimestre anterior según Auditoría Interna.
                    </p>
                  </div>
                </div>
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
                  <IconMapper name={selectedProyecto.iconName} />
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

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Nivel de Ejecución Certificado / Indicador POA</h4>
              <div className="space-y-4 mb-8">
                {selectedProyecto.indicators.map((ind) => (
                  <div key={ind.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-[#051429]">{ind.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-[#B8902F]" /> {ind.trend}
                      </p>
                    </div>
                    <span className="text-xl font-black text-[#051429] font-mono">{ind.value}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lineamiento de Impacto</h4>
              <div className="p-4 bg-[#051429]/5 rounded-xl border border-[#051429]/10">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[#B8902F] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{selectedProyecto.impacto}</p>
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