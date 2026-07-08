'use client';

import React, { useState } from 'react';
import { useGetCatalog } from '../../features/catalog/presentation/hooks/useGetCatalog';
import { ShoppingCart, ArrowLeft, Search, Filter } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { TaxEntity } from '../../features/catalog/domain/TaxEntity';
import { ServiceFormModal } from '../../features/catalog/presentation/components/ServiceFormModal';

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

export default function ServiciosPage() {
  const { data: catalogData, isLoading } = useGetCatalog();
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedService, setSelectedService] = useState<TaxEntity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filteredData = catalogData.filter(tax => {
    const matchesSearch = tax.title.toLowerCase().includes(filter.toLowerCase()) ||
                          tax.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || CATEGORY_MAP[tax.id] === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestService = (tax: TaxEntity) => {
    setSelectedService(tax);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429] mb-3">
            Catálogo de Servicios
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Explore y pre-seleccione los arbitrios, tasas y servicios municipales disponibles para el Distrito Nacional.
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
              placeholder="Buscar en el catálogo..."
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
                const isAdded = addedIds.has(tax.id);
                return (
                  <div
                    key={tax.id}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 ease-out border border-gray-50 flex flex-col h-full group hover:-translate-y-2"
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
                      <span className="font-bold text-[#051429] font-mono">
                        RD$ {tax.price.toLocaleString('es-DO')}
                      </span>
                      <button
                        onClick={() => handleRequestService(tax)}
                        className="transition-all duration-300 rounded-lg p-2 text-gray-400 hover:text-[#B8902F] hover:bg-[#B8902F]/10"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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

      </div>

      <ServiceFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedService(null); }}
        service={selectedService}
      />
    </div>
  );
}
