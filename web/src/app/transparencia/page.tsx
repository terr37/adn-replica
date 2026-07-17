'use client';

import React from 'react';
import { ArrowLeft, FileText, Download, ExternalLink, ShieldCheck, HelpCircle, Landmark } from 'lucide-react';
import Link from 'next/link';
import { generarDocumentoOficial } from '@/utils/pdfGenerator';

interface Documento {
  id: string;
  titulo: string;
  tamano: string;
  formato: string;
  fecha: string;
}

interface SeccionDocumento {
  id: string;
  categoria: string;
  descripcion: string;
  documentos: Documento[];
}

interface PortalGubernamental {
  id: string;
  nombre: string;
  entidad: string;
  desc: string;
  url: string;
}

const SECCIONES_DOCUMENTOS: SeccionDocumento[] = [
  {
    id: 'sec-presupuesto',
    categoria: 'Presupuesto y Finanzas',
    descripcion: 'Estados financieros, presupuestos aprobados e informes de ejecución trimestral.',
    documentos: [
      { id: 'doc-presupuesto-2026', titulo: 'Presupuesto General de Ingresos y Egresos 2026', tamano: '4.8 MB', formato: 'PDF', fecha: 'Enero 2026' },
      { id: 'doc-ejecucion-q1-2026', titulo: 'Informe de Ejecución Presupuestaria - Primer Trimestre 2026', tamano: '2.5 MB', formato: 'PDF', fecha: 'Abril 2026' },
      { id: 'doc-poa-2026', titulo: 'Plan Operativo Anual (POA) 2026', tamano: '3.9 MB', formato: 'PDF', fecha: 'Diciembre 2025' },
    ]
  },
  {
    id: 'sec-rrhh',
    categoria: 'Recursos Humanos y Nómina',
    descripcion: 'Distribución del personal del ayuntamiento, escala salarial y nómina mensual.',
    documentos: [
      { id: 'doc-nomina-2026', titulo: 'Nómina General de Empleados - Histórico 2026', tamano: '1.8 MB', formato: 'XLSX', fecha: 'Junio 2026' },
      { id: 'doc-manual-cargos', titulo: 'Estructura Organizacional y Manual de Cargos', tamano: '3.2 MB', formato: 'PDF', fecha: 'Octubre 2025' },
      { id: 'doc-escala-salarial', titulo: 'Tabulador de Sueldos y Escala Salarial Vigente', tamano: '920 KB', formato: 'PDF', fecha: 'Enero 2026' },
    ]
  },
  {
    id: 'sec-planificacion',
    categoria: 'Planificación y Normativas',
    descripcion: 'Planes estratégicos de desarrollo municipal y reglamentos vigentes.',
    documentos: [
      { id: 'doc-pdm-2024-2028', titulo: 'Plan de Desarrollo Municipal del Distrito Nacional 2024-2028', tamano: '14.2 MB', formato: 'PDF', fecha: 'Julio 2024' },
      { id: 'doc-reglamento-ppm', titulo: 'Reglamento Interno de Presupuesto Participativo Municipal', tamano: '1.1 MB', formato: 'PDF', fecha: 'Marzo 2025' },
    ]
  }
];

const PORTALES_GUBERNAMENTALES: PortalGubernamental[] = [
  {
    id: 'portal-dgcp',
    nombre: 'Portal Transaccional DGCP',
    entidad: 'Dirección General de Compras y Contrataciones',
    desc: 'Consulte todos los pliegos de condiciones, convocatorias y adjudicaciones de licitaciones públicas en tiempo real.',
    url: 'https://www.comprasdominicana.gob.do/'
  },
  {
    id: 'portal-saip',
    nombre: 'Sistema SAIP',
    entidad: 'Acceso a la Información Pública',
    desc: 'Ejercite su derecho ciudadano solicitando información pública de manera formal conforme a la Ley 200-04.',
    url: 'https://www.saip.gob.do/'
  },
  {
    id: 'portal-hacienda',
    nombre: 'Portal de Transparencia Fiscal',
    entidad: 'Ministerio de Hacienda',
    desc: 'Consulte la asignación y transferencias de fondos públicos destinados a este gobierno local.',
    url: 'https://www.transparenciafiscal.gob.do/'
  }
];

export default function TransparenciaPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Volver */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#051429] rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7 text-[#E9D9AE]" />
            </div>
            <div>
              <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429]">
                Transparencia y Oficina de Acceso a la Información
              </h1>
              <p className="text-gray-500 mt-1">Cumplimiento estricto de la Ley General de Libre Acceso a la Información Pública Ley 200-04.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna Principal: Repositorio de Documentos */}
          <div className="lg:col-span-2 space-y-8">
            {SECCIONES_DOCUMENTOS.map((seccion) => (
              <div key={seccion.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-[#051429]">{seccion.categoria}</h2>
                  <p className="text-sm text-slate-500 mt-1">{seccion.descripcion}</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {seccion.documentos.map((doc) => (
                    <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#051429]/5 group-hover:text-[#051429] transition-colors shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#051429] leading-snug group-hover:text-[#B8902F] transition-colors">
                            {doc.titulo}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            Publicado: {doc.fecha} • {doc.tamano}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={async () => await generarDocumentoOficial(doc.titulo)}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-white border border-slate-200 hover:border-[#051429] hover:bg-[#051429] px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar {doc.formato}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Columna Lateral: Portales Externos y Solicitudes */}
          <div className="space-y-6">

            {/* OAI Card */}
            <div className="bg-gradient-to-b from-[#051429] to-[#0a2347] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9D9AE] mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">¿No encuentra lo que busca?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Puede redactar una solicitud formal de información pública dirigida a la Oficina de Acceso a la Información (OAI) de este ayuntamiento.
              </p>
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">Responsable:</span>
                  <span className="font-bold text-white">Responsable OAI</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">Correo:</span>
                  <span className="font-bold text-white">oai@adn.gob.do</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium">Ubicación:</span>
                  <span className="font-bold text-white text-right">Palacio Consistorial, Santo Domingo</span>
                </div>
              </div>
            </div>

            {/* Enlaces a Portales Externos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <Landmark className="w-5 h-5 text-[#B8902F]" />
                <h3 className="text-md font-black text-[#051429]">Sistemas de Transparencia</h3>
              </div>

              <div className="space-y-4">
                {PORTALES_GUBERNAMENTALES.map((portal) => (
                  <a
                    key={portal.id}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#051429] group-hover:text-[#B8902F] transition-colors">
                        {portal.nombre}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#051429] transition-colors" />
                    </div>
                    <p className="text-[10px] font-bold text-[#B8902F] uppercase tracking-wider mb-1">
                      {portal.entidad}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {portal.desc}
                    </p>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}