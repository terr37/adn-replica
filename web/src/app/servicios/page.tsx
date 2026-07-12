'use client';

import React, { useState } from 'react';
import { useGetCatalog } from '../../features/catalog/presentation/hooks/useGetCatalog';
import { ArrowLeft, Search, Filter, MapPin, FileText, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { TaxEntity } from '../../features/catalog/domain/TaxEntity';

const CATEGORIES = ['Todos', 'Urbanismo', 'Aseo', 'Comercio', 'Espacios'];

// Extend catalog with categories for filtering
const CATEGORY_MAP: Record<string, string> = {
  '1': 'Urbanismo',
  '2': 'Aseo',
  '3': 'Espacios',
  '4': 'Comercio',
  '5': 'Comercio',
  '6': 'Aseo',
  '7': 'Urbanismo',
  '8': 'Comercio',
};

// Service details información estática
const SERVICE_DETAILS: Record<string, { requisitos: string[]; canalAtencion: string; tasaInfo: string }> = {
  '1': {
    requisitos: ['Copia de cédula o RNC', 'Planos arquitectónicos sellados', 'Licencia de construcción municipal', 'Comprobante de pago de derechos'],
    canalAtencion: 'Diríjase presencialmente a la ventanilla de Urbanismo del Ayuntamiento con los requisitos correspondientes.',
    tasaInfo: 'Tasa variable según envergadura del proyecto'
  },
  '2': {
    requisitos: ['Copia de cédula', 'Comprobante de residencia o propiedad', 'Identificación comercial si aplica'],
    canalAtencion: 'Para solicitar este servicio, diríjase presencialmente a las ventanillas de Aseo del Ayuntamiento.',
    tasaInfo: 'RD$ 300.00 (Residencial) / RD$ 1,500.00 (Comercial)'
  },
  '3': {
    requisitos: ['Copia de cédula', 'Propuesta técnica de uso', 'Seguro de responsabilidad civil'],
    canalAtencion: 'Diríjase presencialmente a la ventanilla de Espacios Públicos con los requisitos correspondientes.',
    tasaInfo: 'Tasa variable según duración y extensión'
  },
  '4': {
    requisitos: ['Copia de RNC y cédula del representante', 'Comprobante de domicilio comercial', 'Licencia sanitaria si aplica'],
    canalAtencion: 'Para registrar su comercio, diríjase presencialmente a las ventanillas de Comercio del Ayuntamiento.',
    tasaInfo: 'RD$ 500.00 (Patente anual) / RD$ 800.00 (Renovación)'
  },
  '5': {
    requisitos: ['Copia de RNC y cédula', 'Registro sanitario', 'Comprobante de domicilio'],
    canalAtencion: 'Diríjase presencialmente a la ventanilla comercial del Ayuntamiento con los requisitos correspondientes.',
    tasaInfo: 'Según clasificación comercial'
  },
  '6': {
    requisitos: ['Copia de cédula', 'Dirección de inmueble', 'Comprobante de residencia'],
    canalAtencion: 'Para recolección especial, diríjase presencialmente a las ventanillas de Aseo del Ayuntamiento.',
    tasaInfo: 'RD$ 800.00 por servicio especial'
  },
  '7': {
    requisitos: ['Copia de cédula o RNC', 'Comprobante de propiedad', 'Planos de referencia'],
    canalAtencion: 'Diríjase presencialmente a la ventanilla de Urbanismo para certificaciones de uso de suelo.',
    tasaInfo: 'RD$ 150.00 por certificado'
  },
  '8': {
    requisitos: ['Copia de RNC', 'Licencia municipal previa', 'Comprobante de instalaciones'],
    canalAtencion: 'Para publicidad exterior, diríjase presencialmente a la ventanilla comercial del Ayuntamiento.',
    tasaInfo: 'RD$ 200.00 a RD$ 1,200.00 según tipo'
  }
};

export default function ServiciosPage() {
  const { data: catalogData, isLoading } = useGetCatalog();
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedService, setSelectedService] = useState<TaxEntity | null>(null);

  const filteredData = catalogData.filter(tax => {
    const matchesSearch = tax.title.toLowerCase().includes(filter.toLowerCase()) ||
                          tax.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || CATEGORY_MAP[tax.id] === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const serviceDetail = selectedService ? SERVICE_DETAILS[selectedService.id] : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        {!selectedService ? (
          <>
            <div className="mb-10">
              <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Portal
              </Link>
              <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429] mb-3">
                Catálogo de Servicios Municipales
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl">
                Información sobre los servicios, requisitos y tasas municipales disponibles para el Distrito Nacional.
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Buscar servicio..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:ring-2 focus:ring-[#B8902F]/30 focus:border-[#B8902F] outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400" />
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-[#051429] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#B8902F] hover:text-[#B8902F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-72 bg-gray-100 rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {filteredData.length} servicio{filteredData.length !== 1 ? 's' : ''} disponible{filteredData.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredData.map(tax => {
                    const IconComponent = (Icons as any)[tax.iconName] || Icons.FileText;
                    return (
                      <button
                        key={tax.id}
                        onClick={() => setSelectedService(tax)}
                        className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 ease-out border border-gray-50 flex flex-col h-full group hover:-translate-y-2 text-left"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-[#B8902F] group-hover:bg-[#B8902F]/5 transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <h3 className="text-lg font-semibold text-[#051429] mb-2 leading-tight">
                          {tax.title}
                        </h3>

                        <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3">
                          {tax.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <span className="font-bold text-[#051429] font-mono text-sm">
                            Más información
                          </span>
                          <div className="transition-all duration-300 rounded-lg p-2 text-gray-400 group-hover:text-[#B8902F] group-hover:bg-[#B8902F]/10">
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {filteredData.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#051429] mb-2">Sin resultados</h3>
                <p className="text-slate-400">No se encontraron servicios para su búsqueda. Intente con otro término.</p>
              </div>
            )}
          </>
        ) : (
          // Service Detail View
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Catálogo
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#051429] to-[#0a2f5a] p-8 sm:p-12 text-white">
                <div className="flex items-center gap-4 mb-6">
                  {(Icons as any)[selectedService.iconName] && (
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                      {React.createElement((Icons as any)[selectedService.iconName], {
                        className: "w-8 h-8 text-[#E9D9AE]"
                      })}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedService.title}</h1>
                    <p className="text-white/80">{CATEGORY_MAP[selectedService.id]}</p>
                  </div>
                </div>
                <p className="text-white/90 text-lg max-w-2xl">
                  {selectedService.description}
                </p>
              </div>

              {/* Content */}
              {serviceDetail && (
                <div className="p-8 sm:p-12 space-y-10">
                  {/* Requisitos */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#051429] rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#E9D9AE]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#051429]">Requisitos</h2>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                      <ul className="space-y-3">
                        {serviceDetail.requisitos.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tasas Municipales */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#B8902F] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">$</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#051429]">Tasas Municipales</h2>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200">
                      <p className="text-lg font-bold text-[#051429]">
                        {serviceDetail.tasaInfo}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Consulte con las ventanillas de atención para cualquier detalle adicional sobre tasas especiales o exoneraciones.
                      </p>
                    </div>
                  </div>

                  {/* Canal de Atención */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#051429]">Cómo Solicitar</h2>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                      <p className="text-lg font-semibold text-[#051429] mb-4">
                        {serviceDetail.canalAtencion}
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600">
                          <strong>Horario de Atención:</strong> Lunes a Viernes, 8:00 AM - 4:00 PM<br/>
                          <strong>Ubicación:</strong> Ayuntamiento del Distrito Nacional, Avenida Máximo Gómez<br/>
                          <strong>Teléfono:</strong> +1 (809) 555-0100
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">Nota Importante:</strong> Todos los servicios deben solicitarse presencialmente en las ventanillas del Ayuntamiento. 
                      Se recomienda llevar documentos en original y copia. Los tiempos de procesamiento pueden variar según la complejidad del trámite.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
