'use client';

import React from 'react';
import { ArrowLeft, BarChart3, FileText, DollarSign, Users, TrendingUp, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PRESUPUESTO_DATA = [
  { categoria: 'Infraestructura y Obras', asignado: 450_000_000, ejecutado: 387_000_000, porcentaje: 86 },
  { categoria: 'Aseo Urbano y Medio Ambiente', asignado: 280_000_000, ejecutado: 265_000_000, porcentaje: 94.6 },
  { categoria: 'Desarrollo Social', asignado: 120_000_000, ejecutado: 98_000_000, porcentaje: 81.7 },
  { categoria: 'Administración General', asignado: 95_000_000, ejecutado: 88_000_000, porcentaje: 92.6 },
  { categoria: 'Seguridad Ciudadana', asignado: 75_000_000, ejecutado: 62_000_000, porcentaje: 82.7 },
];

const LICITACIONES = [
  { id: 'LIC-2026-042', titulo: 'Rehabilitación Av. George Washington (Tramo III)', monto: 'RD$ 45,000,000', estado: 'En evaluación', fecha: '2026-06-15' },
  { id: 'LIC-2026-038', titulo: 'Adquisición de 20 compactadores de residuos', monto: 'RD$ 28,500,000', estado: 'Adjudicada', fecha: '2026-05-28' },
  { id: 'LIC-2026-035', titulo: 'Construcción Parque Lineal Río Ozama', monto: 'RD$ 62,000,000', estado: 'En evaluación', fecha: '2026-05-10' },
  { id: 'LIC-2026-029', titulo: 'Señalización vial Zona Colonial', monto: 'RD$ 8,200,000', estado: 'Adjudicada', fecha: '2026-04-22' },
];

const STATS = [
  { icon: <DollarSign className="w-5 h-5" />, label: 'Presupuesto 2026', value: 'RD$ 1,020M', desc: 'Aprobado por el Concejo' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Ejecución Global', value: '87.4%', desc: 'Al cierre de junio' },
  { icon: <FileText className="w-5 h-5" />, label: 'Licitaciones Activas', value: '12', desc: '4 en evaluación' },
  { icon: <Users className="w-5 h-5" />, label: 'Empleados en Nómina', value: '4,230', desc: 'Actualizaciones mensuales' },
];

export default function TransparenciaPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#051429] rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-[#E9D9AE]" />
            </div>
            <div>
              <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429]">
                Transparencia y Datos Abiertos
              </h1>
              <p className="text-gray-500 mt-1">Compromiso con la rendición de cuentas permanente.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#051429] mb-4">
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-[#051429]">{stat.value}</p>
              <p className="text-sm font-bold text-slate-600 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Presupuesto Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#051429]">Ejecución Presupuestaria 2026</h2>
              <p className="text-xs text-slate-400 mt-1">Datos actualizados al cierre de junio 2026</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-[#B8902F] hover:text-[#051429] transition-colors bg-[#B8902F]/10 hover:bg-[#B8902F]/20 px-4 py-2.5 rounded-xl">
              <Download className="w-4 h-4" /> Descargar PDF
            </button>
          </div>

          <div className="space-y-5">
            {PRESUPUESTO_DATA.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#051429]">{item.categoria}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-mono">
                      RD$ {(item.ejecutado / 1_000_000).toFixed(0)}M / {(item.asignado / 1_000_000).toFixed(0)}M
                    </span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      item.porcentaje >= 90 ? 'bg-emerald-50 text-emerald-700' : item.porcentaje >= 80 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {item.porcentaje}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      item.porcentaje >= 90 ? 'bg-emerald-500' : item.porcentaje >= 80 ? 'bg-gradient-to-r from-[#B8902F]/60 to-[#B8902F]' : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Licitaciones Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#051429]">Licitaciones Públicas</h2>
              <p className="text-xs text-slate-400 mt-1">Procesos de compras y contrataciones vigentes</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Referencia</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Proceso</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monto Estimado</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {LICITACIONES.map(lic => (
                  <tr key={lic.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <span className="text-xs font-mono font-bold text-slate-500">{lic.id}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-semibold text-[#051429]">{lic.titulo}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{lic.fecha}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-bold font-mono text-[#051429]">{lic.monto}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        lic.estado === 'Adjudicada'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}>
                        {lic.estado}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-slate-400 hover:text-[#B8902F] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
